import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from './mockStorage';
import { Seat, Profile, Booking, LibrarySettings, FAQItem, SiteContent, AdminStats } from '../types';

export class ApiService {
  // -------------------------------------------------------------
  // SEATS API
  // -------------------------------------------------------------
  static async getSeats(): Promise<Seat[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('seats')
          .select('*')
          .order('seat_number', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as Seat[];
        }
      } catch (err) {
        console.warn('Supabase seats fetch error, falling back to local store:', err);
      }
    }
    return storage.getSeats();
  }

  static async getSeatByNumber(seatNumber: number): Promise<Seat | null> {
    const seats = await this.getSeats();
    return seats.find((s) => s.seat_number === seatNumber) || null;
  }

  static async updateSeatStatus(
    seatNumber: number,
    status: Seat['status'],
    bookingId?: string | null,
    userName?: string | null
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('seats')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('seat_number', seatNumber);

        if (!error) {
          // Continue to keep local storage in sync
        }
      } catch (err) {
        console.warn('Supabase updateSeat error:', err);
      }
    }

    const seats = storage.getSeats();
    const updated = seats.map((s) => {
      if (s.seat_number === seatNumber) {
        return {
          ...s,
          status,
          current_booking_id: bookingId !== undefined ? bookingId : s.current_booking_id,
          current_user_name: userName !== undefined ? userName : s.current_user_name,
        };
      }
      return s;
    });
    storage.setSeats(updated);
    return true;
  }

  // -------------------------------------------------------------
  // BOOKINGS API (With Database Double-Booking Prevention)
  // -------------------------------------------------------------
  static async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, profiles:user_id(full_name, email, mobile_number, gender, age)')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((b: any) => ({
            ...b,
            user_name: b.profiles?.full_name || b.user_name,
            user_email: b.profiles?.email || b.user_email,
            user_mobile: b.profiles?.mobile_number || b.user_mobile,
            user_gender: b.profiles?.gender || b.user_gender,
            user_age: b.profiles?.age || b.user_age,
          })) as Booking[];
        }
      } catch (err) {
        console.warn('Supabase bookings fetch error:', err);
      }
    }
    return storage.getBookings();
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    const all = await this.getBookings();
    return all.filter((b) => b.user_id === userId);
  }

  static async createBooking(params: {
    userId: string;
    seatNumber: number;
    floor: 'ground' | 'first';
    paymentMethod: 'cash' | 'online';
    amount: number;
    slotType?: string;
    userProfile: Profile;
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    // 1. Strict Double-Booking Check
    const seats = storage.getSeats();
    const currentSeat = seats.find((s) => s.seat_number === params.seatNumber);

    if (!currentSeat) {
      return { success: false, error: `Seat #${params.seatNumber} not found.` };
    }

    if (currentSeat.status === 'booked') {
      return {
        success: false,
        error: `Sorry, Seat #${params.seatNumber} has already been booked by another user. Please choose another seat.`,
      };
    }

    if (currentSeat.status === 'blocked') {
      return {
        success: false,
        error: `Seat #${params.seatNumber} is currently blocked for administrative maintenance.`,
      };
    }

    // Check if user already has an active booking for this exact seat
    const allBookings = storage.getBookings();
    const existingActive = allBookings.find(
      (b) =>
        b.seat_number === params.seatNumber &&
        (b.booking_status === 'pending' || b.booking_status === 'confirmed')
    );

    if (existingActive) {
      return {
        success: false,
        error: `Seat #${params.seatNumber} is already reserved under active booking (${existingActive.booking_id}).`,
      };
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const bookingIdCode = `VKL-2026-${String(params.seatNumber).padStart(3, '0')}-${randomSuffix}`;
    const newBookingId = `b-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      id: newBookingId,
      booking_id: bookingIdCode,
      user_id: params.userId,
      seat_id: currentSeat.id,
      seat_number: params.seatNumber,
      floor: params.floor,
      booking_status: 'pending',
      payment_status: params.paymentMethod === 'cash' ? 'cash_pending' : 'unpaid',
      payment_method: params.paymentMethod,
      amount: params.amount,
      slot_type: params.slotType || 'Monthly (Full Day)',
      booking_date: nowIso,
      user_name: params.userProfile.full_name,
      user_email: params.userProfile.email,
      user_mobile: params.userProfile.mobile_number,
      user_gender: params.userProfile.gender,
      user_age: params.userProfile.age,
      created_at: nowIso,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('bookings').insert([
          {
            booking_id: bookingIdCode,
            user_id: params.userId,
            seat_id: currentSeat.id,
            seat_number: params.seatNumber,
            floor: params.floor,
            booking_status: 'pending',
            payment_status: 'cash_pending',
            payment_method: params.paymentMethod,
            amount: params.amount,
            slot_type: params.slotType || 'Monthly',
          },
        ]).select().single();

        if (error) {
          console.warn('Supabase booking insert error:', error);
          if (error.code === '23505') {
            return {
              success: false,
              error: 'Seat was just reserved by another student. Please select another seat.',
            };
          }
        } else if (data) {
          newBooking.id = data.id;
        }
      } catch (err: any) {
        console.warn('Supabase booking catch error:', err);
      }
    }

    // Save in storage
    const updatedBookings = [newBooking, ...allBookings];
    storage.setBookings(updatedBookings);

    // Update Seat Status to pending
    await this.updateSeatStatus(
      params.seatNumber,
      'pending',
      bookingIdCode,
      params.userProfile.full_name
    );

    return { success: true, booking: newBooking };
  }

  // -------------------------------------------------------------
  // ADMIN CASH CONFIRMATION / REJECTION / CANCEL
  // -------------------------------------------------------------
  static async confirmCashPayment(bookingId: string, adminNotes?: string): Promise<boolean> {
    const allBookings = storage.getBookings();
    let targetBooking: Booking | undefined;
    const nowIso = new Date().toISOString();

    const updatedBookings = allBookings.map((b) => {
      if (b.id === bookingId || b.booking_id === bookingId) {
        targetBooking = b;
        return {
          ...b,
          payment_status: 'paid' as const,
          booking_status: 'confirmed' as const,
          confirmed_at: nowIso,
          admin_notes: adminNotes || 'Cash verified & confirmed at library desk',
          updated_at: nowIso,
        };
      }
      return b;
    });

    if (!targetBooking) return false;

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            booking_status: 'confirmed',
            confirmed_at: nowIso,
            admin_notes: adminNotes || 'Cash payment verified by admin',
          })
          .eq('booking_id', targetBooking.booking_id);
      } catch (err) {
        console.warn('Supabase confirm cash error:', err);
      }
    }

    storage.setBookings(updatedBookings);

    // Update seat to booked
    await this.updateSeatStatus(
      targetBooking.seat_number,
      'booked',
      targetBooking.booking_id,
      targetBooking.user_name
    );

    return true;
  }

  static async rejectCashPayment(bookingId: string, reason?: string): Promise<boolean> {
    const allBookings = storage.getBookings();
    let targetBooking: Booking | undefined;
    const nowIso = new Date().toISOString();

    const updatedBookings = allBookings.map((b) => {
      if (b.id === bookingId || b.booking_id === bookingId) {
        targetBooking = b;
        return {
          ...b,
          payment_status: 'rejected' as const,
          booking_status: 'cancelled' as const,
          cancelled_at: nowIso,
          admin_notes: reason || 'Cash payment rejected or not received',
          updated_at: nowIso,
        };
      }
      return b;
    });

    if (!targetBooking) return false;

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'rejected',
            booking_status: 'cancelled',
            cancelled_at: nowIso,
            admin_notes: reason,
          })
          .eq('booking_id', targetBooking.booking_id);
      } catch (err) {
        console.warn('Supabase reject cash error:', err);
      }
    }

    storage.setBookings(updatedBookings);

    // Release seat back to available
    await this.updateSeatStatus(targetBooking.seat_number, 'available', null, null);
    return true;
  }

  static async cancelBooking(bookingId: string, cancelledByUserId?: string): Promise<boolean> {
    const allBookings = storage.getBookings();
    let targetBooking: Booking | undefined;
    const nowIso = new Date().toISOString();

    const updatedBookings = allBookings.map((b) => {
      if (b.id === bookingId || b.booking_id === bookingId) {
        targetBooking = b;
        return {
          ...b,
          booking_status: 'cancelled' as const,
          cancelled_at: nowIso,
          admin_notes: cancelledByUserId ? 'Cancelled by user request' : 'Cancelled by administrator',
          updated_at: nowIso,
        };
      }
      return b;
    });

    if (!targetBooking) return false;

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('bookings')
          .update({
            booking_status: 'cancelled',
            cancelled_at: nowIso,
          })
          .eq('booking_id', targetBooking.booking_id);
      } catch (err) {
        console.warn('Supabase cancel booking error:', err);
      }
    }

    storage.setBookings(updatedBookings);

    // Release seat
    await this.updateSeatStatus(targetBooking.seat_number, 'available', null, null);
    return true;
  }

  // -------------------------------------------------------------
  // PROFILES API
  // -------------------------------------------------------------
  static async getProfiles(): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Profile[];
      } catch (err) {
        console.warn('Supabase profiles fetch error:', err);
      }
    }
    return storage.getProfiles();
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').update(updates).eq('id', userId);
      } catch (err) {
        console.warn('Supabase profile update error:', err);
      }
    }

    const profiles = storage.getProfiles();
    let updatedProfile: Profile | null = null;
    const updated = profiles.map((p) => {
      if (p.id === userId) {
        updatedProfile = { ...p, ...updates, updated_at: new Date().toISOString() };
        return updatedProfile;
      }
      return p;
    });
    storage.setProfiles(updated);

    const currentUser = storage.getCurrentUser();
    if (currentUser && currentUser.id === userId && updatedProfile) {
      storage.setCurrentUser(updatedProfile);
    }

    return updatedProfile;
  }

  // -------------------------------------------------------------
  // SETTINGS & CONTENT API
  // -------------------------------------------------------------
  static async getSettings(): Promise<LibrarySettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('library_settings').select('*').single();
        if (!error && data) return data as LibrarySettings;
      } catch (err) {
        console.warn('Supabase settings fetch error:', err);
      }
    }
    return storage.getSettings();
  }

  static async updateSettings(newSettings: Partial<LibrarySettings>): Promise<LibrarySettings> {
    const current = storage.getSettings();
    const updated = { ...current, ...newSettings, updated_at: new Date().toISOString() };
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('library_settings').upsert(updated);
      } catch (err) {
        console.warn('Supabase settings update error:', err);
      }
    }
    storage.setSettings(updated);
    return updated;
  }

  static async getFaqs(): Promise<FAQItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data as FAQItem[];
      } catch (err) {
        console.warn('Supabase faqs fetch error:', err);
      }
    }
    return storage.getFaqs();
  }

  static async saveFaq(faq: FAQItem): Promise<FAQItem[]> {
    const faqs = storage.getFaqs();
    const exists = faqs.some((f) => f.id === faq.id);
    const updated = exists ? faqs.map((f) => (f.id === faq.id ? faq : f)) : [...faqs, faq];
    storage.setFaqs(updated);
    return updated;
  }

  static async deleteFaq(faqId: string): Promise<FAQItem[]> {
    const faqs = storage.getFaqs();
    const updated = faqs.filter((f) => f.id !== faqId);
    storage.setFaqs(updated);
    return updated;
  }

  static async getContent(): Promise<SiteContent> {
    return storage.getContent();
  }

  static async updateContent(content: SiteContent): Promise<SiteContent> {
    storage.setContent(content);
    return content;
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD STATS
  // -------------------------------------------------------------
  static async getAdminStats(): Promise<AdminStats> {
    const [seats, profiles, bookings] = await Promise.all([
      this.getSeats(),
      this.getProfiles(),
      this.getBookings(),
    ]);

    const groundSeats = seats.filter((s) => s.floor === 'ground');
    const firstSeats = seats.filter((s) => s.floor === 'first');

    const totalRevenue = bookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookingsCount = bookings.filter(
      (b) => b.created_at && b.created_at.startsWith(todayStr)
    ).length;

    return {
      totalUsers: profiles.filter((p) => p.role === 'user').length,
      totalSeats: seats.length,
      availableSeats: seats.filter((s) => s.status === 'available').length,
      bookedSeats: seats.filter((s) => s.status === 'booked').length,
      blockedSeats: seats.filter((s) => s.status === 'blocked').length,
      pendingBookings: bookings.filter((b) => b.booking_status === 'pending').length,
      confirmedBookings: bookings.filter((b) => b.booking_status === 'confirmed').length,
      pendingCashPayments: bookings.filter((b) => b.payment_status === 'cash_pending').length,
      totalRevenue,
      todayBookingsCount,
      groundFloorOccupancy: {
        total: groundSeats.length,
        booked: groundSeats.filter((s) => s.status === 'booked').length,
        available: groundSeats.filter((s) => s.status === 'available').length,
      },
      firstFloorOccupancy: {
        total: firstSeats.length,
        booked: firstSeats.filter((s) => s.status === 'booked').length,
        available: firstSeats.filter((s) => s.status === 'available').length,
      },
    };
  }

  // -------------------------------------------------------------
  // REAL-TIME LISTENER
  // -------------------------------------------------------------
  static subscribeToChanges(callback: () => void): () => void {
    // 1. Window custom event for local sync across components
    const handleStorage = () => callback();
    window.addEventListener('vkl_storage_change', handleStorage);
    window.addEventListener('storage', handleStorage);

    // 2. Real Supabase channel subscription if configured
    let subscription: any = null;
    if (isSupabaseConfigured()) {
      try {
        subscription = supabase
          .channel('public_library_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'seats' }, () => {
            callback();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
            callback();
          })
          .subscribe();
      } catch (e) {
        console.warn('Realtime subscription error:', e);
      }
    }

    return () => {
      window.removeEventListener('vkl_storage_change', handleStorage);
      window.removeEventListener('storage', handleStorage);
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }
}
