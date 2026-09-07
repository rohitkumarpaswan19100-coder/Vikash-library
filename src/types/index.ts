export type SeatStatus = 'available' | 'booked' | 'blocked' | 'pending';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired';

export type PaymentStatus = 'unpaid' | 'cash_pending' | 'paid' | 'rejected';

export type PaymentMethod = 'cash' | 'online';

export type UserRole = 'user' | 'admin';

export type FloorType = 'ground' | 'first';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  gender: 'Male' | 'Female' | 'Other' | string;
  age: number;
  mobile_number: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Seat {
  id: string;
  seat_number: number;
  floor: FloorType;
  status: SeatStatus;
  row_label?: string;
  section?: string;
  current_booking_id?: string | null;
  current_user_name?: string | null;
  created_at?: string;
}

export interface Booking {
  id: string;
  booking_id: string; // Human readable like VKL-2026-00025
  user_id: string;
  seat_id: string;
  seat_number: number;
  floor: FloorType;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  amount: number;
  booking_date: string;
  slot_type?: 'Full Day' | 'Morning' | 'Evening' | 'Monthly' | string;
  confirmed_at?: string | null;
  cancelled_at?: string | null;
  payment_provider?: string | null;
  transaction_id?: string | null;
  payment_reference?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
  user_mobile?: string;
  user_gender?: string;
  user_age?: number;
}

export interface LibrarySettings {
  id?: string;
  library_name: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  opening_hours: string;
  monthly_fee: number;
  daily_fee: number;
  description: string;
  notice_banner?: string;
  enable_online_payment: boolean;
  total_seats: number;
  ground_floor_seats: number;
  first_floor_seats: number;
  updated_at?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Booking' | 'Payment' | 'Rules';
  order: number;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

export interface SiteContent {
  hero_heading: string;
  hero_subheading: string;
  about_title: string;
  about_paragraphs: string[];
  why_choose_us: WhyChooseUsItem[];
  location_note: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  blockedSeats: number;
  pendingBookings: number;
  confirmedBookings: number;
  pendingCashPayments: number;
  totalRevenue: number;
  todayBookingsCount: number;
  groundFloorOccupancy: { total: number; booked: number; available: number };
  firstFloorOccupancy: { total: number; booked: number; available: number };
}
