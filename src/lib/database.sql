-- =========================================================================
-- VIKASH LIBRARY — COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- Location: Amba, Nabinagar Road, Bihar, India
-- Total Seats: 130 (Ground Floor: 1-52, First Floor: 53-130)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    age INTEGER CHECK (age >= 10 AND age <= 100),
    mobile_number TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SEATS TABLE (130 Total Seats)
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seat_number INTEGER UNIQUE NOT NULL CHECK (seat_number >= 1 AND seat_number <= 130),
    floor TEXT NOT NULL CHECK (floor IN ('ground', 'first')),
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'blocked', 'pending')),
    row_label TEXT,
    section TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT UNIQUE NOT NULL, -- Human-readable identifier like VKL-2026-XXXXX
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE RESTRICT,
    seat_number INTEGER NOT NULL,
    floor TEXT NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'expired')),
    payment_status TEXT NOT NULL DEFAULT 'cash_pending' CHECK (payment_status IN ('unpaid', 'cash_pending', 'paid', 'rejected')),
    payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'online')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    slot_type TEXT NOT NULL DEFAULT 'Monthly',
    booking_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    payment_provider TEXT,
    transaction_id TEXT,
    payment_reference TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PAYMENTS AUDIT TABLE (Ready for future Razorpay / Gateway integration)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    payment_gateway TEXT,
    transaction_id TEXT,
    gateway_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. LIBRARY SETTINGS TABLE (Configurable from Admin Panel)
CREATE TABLE IF NOT EXISTS public.library_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    library_name TEXT NOT NULL DEFAULT 'Vikash Library',
    tagline TEXT NOT NULL DEFAULT 'Your Dedicated Space to Study, Focus & Succeed',
    address TEXT NOT NULL DEFAULT 'Amba, Nabinagar Road',
    landmark TEXT DEFAULT 'Near Main Market',
    city TEXT NOT NULL DEFAULT 'Amba',
    state TEXT NOT NULL DEFAULT 'Bihar',
    pincode TEXT NOT NULL DEFAULT '824111',
    phone TEXT NOT NULL DEFAULT '+91 90000 00000 (Dummy Phone)',
    email TEXT NOT NULL DEFAULT 'contact@vikashlibrary.example',
    opening_hours TEXT NOT NULL DEFAULT '6:00 AM – 11:00 PM (Daily)',
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    daily_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    description TEXT NOT NULL DEFAULT 'Peaceful, disciplined, and comfortable self-study reading room equipped with 130 dedicated seats across Ground and First floor.',
    notice_banner TEXT DEFAULT 'Admissions open for this month! Reserve your preferred study seat online.',
    enable_online_payment BOOLEAN NOT NULL DEFAULT false,
    total_seats INTEGER NOT NULL DEFAULT 130,
    ground_floor_seats INTEGER NOT NULL DEFAULT 52,
    first_floor_seats INTEGER NOT NULL DEFAULT 78,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =========================================================================
-- DATABASE CONSTRAINTS & INDEXES
-- =========================================================================

-- Prevent active double booking for the same seat
-- A seat cannot have two active (pending or confirmed) bookings simultaneously
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_seat_booking 
ON public.bookings (seat_id) 
WHERE booking_status IN ('pending', 'confirmed');

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_seats_status ON public.seats(status);
CREATE INDEX IF NOT EXISTS idx_seats_floor ON public.seats(floor);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (role IS NULL OR role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
);

CREATE POLICY "Admins have full access to profiles" 
ON public.profiles FOR ALL USING (public.is_admin());

-- Seats Policies
CREATE POLICY "Anyone can view seats" 
ON public.seats FOR SELECT USING (true);

CREATE POLICY "Admins can update seats" 
ON public.seats FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can insert seats" 
ON public.seats FOR INSERT WITH CHECK (public.is_admin());

-- Bookings Policies
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own bookings" 
ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own pending booking" 
ON public.bookings FOR UPDATE USING (auth.uid() = user_id AND booking_status = 'pending')
WITH CHECK (booking_status = 'cancelled');

CREATE POLICY "Admins have full control over bookings" 
ON public.bookings FOR ALL USING (public.is_admin());

-- Payments Policies
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins have full access to payments" 
ON public.payments FOR ALL USING (public.is_admin());

-- Settings & Content Policies (Read: All, Write: Admins)
CREATE POLICY "Anyone can view library settings" ON public.library_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update library settings" ON public.library_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage faqs" ON public.faqs FOR ALL USING (public.is_admin());

CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (public.is_admin());

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- =========================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    gender, 
    age, 
    mobile_number, 
    email, 
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'Male'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 20),
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- SEED DATA: 130 SEATS (Ground Floor: 1-52, First Floor: 53-130)
-- =========================================================================

DO $$
BEGIN
  -- Insert Ground Floor Seats (1 to 52)
  FOR i IN 1..52 LOOP
    INSERT INTO public.seats (seat_number, floor, status, row_label, section)
    VALUES (
      i, 
      'ground', 
      'available', 
      'Row ' || CHR(65 + ((i - 1) / 10)), 
      CASE WHEN i <= 26 THEN 'Ground Floor Section A' ELSE 'Ground Floor Section B' END
    )
    ON CONFLICT (seat_number) DO NOTHING;
  END LOOP;

  -- Insert First Floor Seats (53 to 130)
  FOR i IN 53..130 LOOP
    INSERT INTO public.seats (seat_number, floor, status, row_label, section)
    VALUES (
      i, 
      'first', 
      'available', 
      'Row ' || CHR(65 + ((i - 53) / 10)), 
      CASE WHEN i <= 90 THEN 'First Floor Section A' ELSE 'First Floor Section B' END
    )
    ON CONFLICT (seat_number) DO NOTHING;
  END LOOP;
END $$;

-- =========================================================================
-- SEED DEFAULT SETTINGS & FAQS
-- =========================================================================

INSERT INTO public.library_settings (
  library_name,
  tagline,
  address,
  landmark,
  city,
  state,
  pincode,
  phone,
  email,
  opening_hours,
  monthly_fee,
  daily_fee,
  description,
  total_seats,
  ground_floor_seats,
  first_floor_seats
)
VALUES (
  'Vikash Library',
  'Your Dedicated Space to Study, Focus & Succeed',
  'Amba, Nabinagar Road',
  'Near Main Market',
  'Amba',
  'Bihar',
  '824111',
  '+91 90000 00000',
  'info@vikashlibrary.example',
  '6:00 AM – 11:00 PM (Daily)',
  800.00,
  50.00,
  'Vikash Library in Amba provides a peaceful, quiet, and disciplined environment for students, competitive exam aspirants, and lifelong learners.',
  130,
  52,
  78
)
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category, display_order)
VALUES 
  ('How do I register an account on Vikash Library?', 'Click on "Create Account" on the top navigation bar. Fill in your username, full name, mobile number, age, gender, and email password to register instantly.', 'General', 1),
  ('How do I book a study seat?', 'Go to the "Seats" section or click "Book Your Seat". Select either Ground Floor (Seats 1-52) or First Floor (Seats 53-130), choose an available seat, and proceed to booking.', 'Booking', 2),
  ('How does Cash Payment confirmation work?', 'When you select "Cash Payment", your seat is reserved in "Pending" status. Visit the Vikash Library reception desk at Amba, pay the monthly fee in cash, and the admin will confirm your booking instantly.', 'Payment', 3),
  ('Can two students book the same seat at the same time?', 'No. The system uses strict database-level unique locks to prevent double-booking. If someone books a seat while you are viewing it, the availability updates immediately.', 'Booking', 4),
  ('What are the library operating hours?', 'Vikash Library operates daily from 6:00 AM to 11:00 PM. Please check the timings banner for any holiday updates.', 'General', 5),
  ('Can I cancel my seat reservation?', 'Yes, you can cancel any pending reservation directly from your User Dashboard. For confirmed bookings, please contact the library reception.', 'Rules', 6)
ON CONFLICT DO NOTHING;

-- =========================================================================
-- HOW TO CREATE / ASSIGN THE FIRST ADMIN:
-- Run this SQL in your Supabase SQL Editor after registering an account:
-- 
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-admin-email@example.com';
-- =========================================================================
