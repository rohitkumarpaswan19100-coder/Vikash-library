import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Seat, Booking, FloorType, LibrarySettings, FAQItem, SiteContent, AdminStats } from '../types';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface BookingContextType {
  seats: Seat[];
  groundFloorSeats: Seat[];
  firstFloorSeats: Seat[];
  selectedFloor: FloorType;
  setSelectedFloor: (floor: FloorType) => void;
  selectedSeat: Seat | null;
  selectSeat: (seat: Seat) => void;
  clearSelectedSeat: () => void;
  userBookings: Booking[];
  activeBooking: Booking | null;
  allBookings: Booking[];
  settings: LibrarySettings;
  faqs: FAQItem[];
  siteContent: SiteContent;
  stats: AdminStats | null;
  isLoading: boolean;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  confirmedBookingPass: Booking | null;
  setConfirmedBookingPass: (b: Booking | null) => void;
  createSeatBooking: (paymentMethod: 'cash' | 'online', slotType?: string) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  cancelUserBooking: (bookingId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  updateSettings: (s: Partial<LibrarySettings>) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<FloorType>('ground');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<LibrarySettings>({
    library_name: 'Vikash Library',
    tagline: 'Your Dedicated Space to Study, Focus & Succeed',
    address: 'Amba, Nabinagar Road',
    landmark: 'Near Main Market',
    city: 'Amba',
    state: 'Bihar',
    pincode: '824111',
    phone: '+91 7541053789',
    email: 'info@vikashlibrary.example',
    opening_hours: '6:00 AM – 11:00 PM (Daily)',
    monthly_fee: 800,
    daily_fee: 50,
    description: 'Vikash Library in Amba provides a peaceful, quiet, and disciplined environment for students, competitive exam aspirants, and lifelong learners.',
    enable_online_payment: false,
    total_seats: 130,
    ground_floor_seats: 52,
    first_floor_seats: 78,
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    hero_heading: 'Your Dedicated Space to Study, Focus & Succeed',
    hero_subheading: 'A peaceful, disciplined, and modern study environment in Amba with 130 dedicated seats across two spacious floors. Reserve your seat online today.',
    about_title: 'About Vikash Library',
    about_paragraphs: [],
    why_choose_us: [],
    location_note: 'Amba, Nabinagar Road, Bihar',
  });
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState<Booking | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const [fetchedSeats, fetchedSettings, fetchedFaqs, fetchedContent, fetchedStats, fetchedBookings] =
        await Promise.all([
          ApiService.getSeats(),
          ApiService.getSettings(),
          ApiService.getFaqs(),
          ApiService.getContent(),
          ApiService.getAdminStats(),
          ApiService.getBookings(),
        ]);

      setSeats(fetchedSeats);
      setSettings(fetchedSettings);
      setFaqs(fetchedFaqs);
      setSiteContent(fetchedContent);
      setStats(fetchedStats);
      setAllBookings(fetchedBookings);

      if (user) {
        const myBookings = fetchedBookings.filter((b) => b.user_id === user.id);
        setUserBookings(myBookings);
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      console.warn('Refresh data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
    // Subscribe to real-time seat changes
    const unsubscribe = ApiService.subscribeToChanges(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  const selectSeat = (seat: Seat) => {
    if (seat.status !== 'available') return;
    setSelectedSeat(seat);
    setIsBookingModalOpen(true);
  };

  const clearSelectedSeat = () => {
    setSelectedSeat(null);
  };

  const createSeatBooking = async (
    paymentMethod: 'cash' | 'online',
    slotType: string = 'Monthly (Full Day)'
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Please login or register to book a seat.' };
    }
    if (!selectedSeat) {
      return { success: false, error: 'No seat selected.' };
    }

    const result = await ApiService.createBooking({
      userId: user.id,
      seatNumber: selectedSeat.seat_number,
      floor: selectedSeat.floor,
      paymentMethod,
      amount: settings.monthly_fee || 800,
      slotType,
      userProfile: user,
    });

    if (result.success && result.booking) {
      setIsBookingModalOpen(false);
      setConfirmedBookingPass(result.booking);
      clearSelectedSeat();
      await refreshData();

      // Launch confetti on successful booking
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }

    return result;
  };

  const cancelUserBooking = async (bookingId: string): Promise<boolean> => {
    if (!user) return false;
    const success = await ApiService.cancelBooking(bookingId, user.id);
    if (success) {
      await refreshData();
    }
    return success;
  };

  const handleUpdateSettings = async (newS: Partial<LibrarySettings>) => {
    const updated = await ApiService.updateSettings(newS);
    setSettings(updated);
    await refreshData();
  };

  const groundFloorSeats = seats.filter((s) => s.floor === 'ground');
  const firstFloorSeats = seats.filter((s) => s.floor === 'first');

  const activeBooking =
    userBookings.find((b) => b.booking_status === 'confirmed' || b.booking_status === 'pending') || null;

  return (
    <BookingContext.Provider
      value={{
        seats,
        groundFloorSeats,
        firstFloorSeats,
        selectedFloor,
        setSelectedFloor,
        selectedSeat,
        selectSeat,
        clearSelectedSeat,
        userBookings,
        activeBooking,
        allBookings,
        settings,
        faqs,
        siteContent,
        stats,
        isLoading,
        isBookingModalOpen,
        setIsBookingModalOpen,
        confirmedBookingPass,
        setConfirmedBookingPass,
        createSeatBooking,
        cancelUserBooking,
        refreshData,
        updateSettings: handleUpdateSettings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
