import { Seat, Profile, Booking, LibrarySettings, FAQItem, SiteContent } from '../types';

const STORAGE_KEYS = {
  SEATS: 'vkl_seats_v1',
  PROFILES: 'vkl_profiles_v1',
  BOOKINGS: 'vkl_bookings_v1',
  SETTINGS: 'vkl_settings_v1',
  FAQS: 'vkl_faqs_v1',
  CONTENT: 'vkl_content_v1',
  CURRENT_USER: 'vkl_current_user_v1',
};

// Initial 130 Seats generation (1-52 Ground Floor, 53-130 First Floor)
export const generateInitialSeats = (): Seat[] => {
  const seats: Seat[] = [];
  
  // Ground Floor 1-52
  for (let i = 1; i <= 52; i++) {
    const rowChar = String.fromCharCode(65 + Math.floor((i - 1) / 10)); // A, B, C...
    seats.push({
      id: `seat-ground-${i}`,
      seat_number: i,
      floor: 'ground',
      status: i === 12 || i === 18 ? 'booked' : i === 25 ? 'pending' : i === 30 ? 'blocked' : 'available',
      row_label: `Row ${rowChar}`,
      section: i <= 26 ? 'Ground Floor - Section A' : 'Ground Floor - Section B',
      current_booking_id: i === 12 ? 'VKL-2026-00012' : i === 18 ? 'VKL-2026-00018' : i === 25 ? 'VKL-2026-00025' : null,
      current_user_name: i === 12 ? 'Rohit Paswan' : i === 18 ? 'Pooja Kumari' : i === 25 ? 'Amit Singh' : null,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    });
  }

  // First Floor 53-130
  for (let i = 53; i <= 130; i++) {
    const rowChar = String.fromCharCode(65 + Math.floor((i - 53) / 10));
    seats.push({
      id: `seat-first-${i}`,
      seat_number: i,
      floor: 'first',
      status: i === 58 || i === 72 || i === 104 ? 'booked' : i === 89 ? 'pending' : 'available',
      row_label: `Row ${rowChar}`,
      section: i <= 90 ? 'First Floor - Section A (Quiet Zone)' : 'First Floor - Section B (AC Zone)',
      current_booking_id: i === 58 ? 'VKL-2026-00058' : i === 72 ? 'VKL-2026-00072' : i === 104 ? 'VKL-2026-00104' : i === 89 ? 'VKL-2026-00089' : null,
      current_user_name: i === 58 ? 'Sneha Patel' : i === 72 ? 'Vikash Sharma' : i === 104 ? 'Rohan Verma' : i === 89 ? 'Anjali Roy' : null,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    });
  }

  return seats;
};

// Initial Profiles
export const initialProfiles: Profile[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    full_name: 'Vikash Kumar (Admin)',
    gender: 'Male',
    age: 32,
    mobile_number: '+91 98765 43210',
    email: 'admin@vikashlibrary.com',
    role: 'admin',
    avatar_url: null,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-student-1',
    username: 'demo_student_1',
    full_name: 'Demo Student 1',
    gender: 'Male',
    age: 22,
    mobile_number: '+91 98000 11111',
    email: 'demo1@vikashlibrary.com',
    role: 'user',
    avatar_url: null,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'user-student-2',
    username: 'demo_student_2',
    full_name: 'Demo Student 2',
    gender: 'Female',
    age: 21,
    mobile_number: '+91 98000 22222',
    email: 'demo2@vikashlibrary.com',
    role: 'user',
    avatar_url: null,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

// Initial Bookings
export const initialBookings: Booking[] = [
  {
    id: 'b-001',
    booking_id: 'VKL-2026-00012',
    user_id: 'user-student-1',
    seat_id: 'seat-ground-12',
    seat_number: 12,
    floor: 'ground',
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'cash',
    amount: 800,
    slot_type: 'Monthly (Full Day)',
    booking_date: new Date(Date.now() - 86400000 * 4).toISOString(),
    confirmed_at: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
    user_name: 'Rohit Paswan',
    user_email: 'rohit.paswan@gmail.com',
    user_mobile: '+91 7541053789',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'b-002',
    booking_id: 'VKL-2026-00018',
    user_id: 'user-student-2',
    seat_id: 'seat-ground-18',
    seat_number: 18,
    floor: 'ground',
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'cash',
    amount: 800,
    slot_type: 'Monthly (Full Day)',
    booking_date: new Date(Date.now() - 86400000 * 3).toISOString(),
    confirmed_at: new Date(Date.now() - 86400000 * 3 + 7200000).toISOString(),
    user_name: 'Pooja Kumari',
    user_email: 'pooja.kumari@gmail.com',
    user_mobile: '+91 98222 33445',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'b-003',
    booking_id: 'VKL-2026-00025',
    user_id: 'user-student-3',
    seat_id: 'seat-ground-25',
    seat_number: 25,
    floor: 'ground',
    booking_status: 'pending',
    payment_status: 'cash_pending',
    payment_method: 'cash',
    amount: 800,
    slot_type: 'Monthly (Full Day)',
    booking_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    user_name: 'Amit Singh',
    user_email: 'amit.singh@gmail.com',
    user_mobile: '+91 97111 22334',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'b-004',
    booking_id: 'VKL-2026-00058',
    user_id: 'user-student-4',
    seat_id: 'seat-first-58',
    seat_number: 58,
    floor: 'first',
    booking_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'cash',
    amount: 800,
    slot_type: 'Monthly (Full Day)',
    booking_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    confirmed_at: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
    user_name: 'Sneha Patel',
    user_email: 'sneha.patel@gmail.com',
    user_mobile: '+91 98333 44556',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'b-005',
    booking_id: 'VKL-2026-00089',
    user_id: 'user-student-5',
    seat_id: 'seat-first-89',
    seat_number: 89,
    floor: 'first',
    booking_status: 'pending',
    payment_status: 'cash_pending',
    payment_method: 'cash',
    amount: 800,
    slot_type: 'Monthly (Full Day)',
    booking_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    user_name: 'Anjali Roy',
    user_email: 'anjali.roy@gmail.com',
    user_mobile: '+91 99444 55667',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

export const initialSettings: LibrarySettings = {
  library_name: 'Vikash Library',
  tagline: 'Your Dedicated Space to Study, Focus & Succeed',
  address: 'Amba, Nabinagar Road',
  landmark: 'Near Main Market / Chowk',
  city: 'Amba',
  state: 'Bihar',
  pincode: '824111',
  phone: '+91 7541053789',
  email: 'info@vikashlibrary.example',
  opening_hours: '6:00 AM – 11:00 PM (Daily)',
  monthly_fee: 800,
  daily_fee: 50,
  description: 'Vikash Library in Amba provides a peaceful, quiet, and disciplined environment for students, competitive exam aspirants, and lifelong learners.',
  notice_banner: 'Admissions open for this month! Reserve your preferred study seat online.',
  enable_online_payment: false,
  total_seats: 130,
  ground_floor_seats: 52,
  first_floor_seats: 78,
};

export const initialFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I register an account on Vikash Library?',
    answer: 'Click on "Create Account" on the top navigation bar. Fill in your username, full name, mobile number, age, gender, and email password to register instantly.',
    category: 'General',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How do I book a study seat?',
    answer: 'Go to the "Seats" section or click "Book Your Seat". Select either Ground Floor (Seats 1-52) or First Floor (Seats 53-130), choose an available seat, and proceed to booking.',
    category: 'Booking',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How does Cash Payment confirmation work?',
    answer: 'When you select "Cash Payment", your seat is reserved in "Pending" status. Visit the Vikash Library reception desk at Amba, pay the monthly fee in cash, and the admin will confirm your booking instantly.',
    category: 'Payment',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Can two students book the same seat at the same time?',
    answer: 'No. The system uses strict database-level unique locks to prevent double-booking. If someone books a seat while you are viewing it, the availability updates immediately.',
    category: 'Booking',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What are the library operating hours?',
    answer: 'Vikash Library operates daily from 6:00 AM to 11:00 PM. Please check the timings banner for any holiday updates.',
    category: 'General',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Can I cancel my seat reservation?',
    answer: 'Yes, you can cancel any pending reservation directly from your User Dashboard. For confirmed bookings, please contact the library reception.',
    category: 'Rules',
    order: 6,
  }
];

export const initialSiteContent: SiteContent = {
  hero_heading: 'Your Dedicated Space to Study, Focus & Succeed',
  hero_subheading: 'A peaceful, disciplined, and modern study environment in Amba with 130 dedicated seats across two spacious floors. Reserve your seat online today.',
  about_title: 'About Vikash Library',
  about_paragraphs: [
    'Vikash Library was founded with a singular mission: to provide ambitious students, UPSC, BPSC, SSC, Banking, and Railway aspirants with an uninterrupted, distraction-free environment for serious self-study.',
    'Located conveniently on Nabinagar Road in Amba, Bihar, our facility houses 130 individual study stations spread across Ground and First Floor, designed with ergonomic seating and proper lighting to support long study hours.',
    'We believe consistent discipline and a quiet atmosphere are key to academic and competitive success. Our digital seat booking ensures your chosen desk is always reserved for you.'
  ],
  why_choose_us: [
    {
      id: 'w-1',
      title: 'Dedicated Study Seats',
      description: '130 numbered personal study cubicles so your study spot is uniquely reserved for your daily routine.',
      icon_name: 'Armchair',
    },
    {
      id: 'w-2',
      title: 'Peaceful Environment',
      description: 'Strict silence and disciplined ambiance that guarantees zero distractions during your study sessions.',
      icon_name: 'ShieldCheck',
    },
    {
      id: 'w-3',
      title: 'Easy Seat Booking',
      description: 'Real-time interactive seat map to pick your exact desk on Ground or First floor in seconds.',
      icon_name: 'Sparkles',
    },
    {
      id: 'w-4',
      title: 'Long Study Hours',
      description: 'Open daily from early morning 6:00 AM to late night 11:00 PM to match your personal study schedule.',
      icon_name: 'Clock',
    },
    {
      id: 'w-5',
      title: 'Flexible Cash / Online',
      description: 'Reserve online and pay conveniently at the library reception or prepare for future online payments.',
      icon_name: 'CreditCard',
    },
    {
      id: 'w-6',
      title: 'Student-Friendly Location',
      description: 'Centrally situated on Nabinagar Road, Amba, Bihar with easy connectivity and safe surroundings.',
      icon_name: 'MapPin',
    },
  ],
  location_note: 'Located at Amba, Nabinagar Road, Bihar. Landmark: Near Main Market / Chowk.'
};

// Local storage helper methods
export const getStored = <T>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
};

export const setStored = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Trigger custom window storage event for instant multi-tab & component sync
    window.dispatchEvent(new Event('vkl_storage_change'));
  } catch (err) {
    console.error('Storage error:', err);
  }
};

export const storage = {
  getSeats: (): Seat[] => {
    const seats = getStored<Seat[]>(STORAGE_KEYS.SEATS, generateInitialSeats());
    return seats.map(s => s.current_user_name === 'Rahul Kumar' ? { ...s, current_user_name: 'Rohit Paswan' } : s);
  },
  setSeats: (seats: Seat[]) => setStored<Seat[]>(STORAGE_KEYS.SEATS, seats),

  getProfiles: (): Profile[] => {
    const profiles = getStored<Profile[]>(STORAGE_KEYS.PROFILES, initialProfiles);
    return profiles.map(p => {
      if (p.full_name === 'Rahul Kumar' || p.username === 'rahulkumar' || p.username === 'rohitpaswan' || p.id === 'user-student-1') {
        return {
          ...p,
          username: 'rohitpaswan',
          full_name: 'Rohit Paswan',
          mobile_number: '+91 7541053789',
          email: p.email === 'rahul.kumar@gmail.com' ? 'rohit.paswan@gmail.com' : p.email,
        };
      }
      return p;
    });
  },
  setProfiles: (profiles: Profile[]) => setStored<Profile[]>(STORAGE_KEYS.PROFILES, profiles),

  getBookings: (): Booking[] => {
    const bookings = getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    return bookings.map(b => {
      if (b.user_name === 'Rahul Kumar' || b.user_name === 'Rohit Paswan' || b.user_id === 'user-student-1') {
        return {
          ...b,
          user_name: 'Rohit Paswan',
          user_mobile: '+91 7541053789',
          user_email: b.user_email === 'rahul.kumar@gmail.com' ? 'rohit.paswan@gmail.com' : b.user_email,
        };
      }
      return b;
    });
  },
  setBookings: (bookings: Booking[]) => setStored<Booking[]>(STORAGE_KEYS.BOOKINGS, bookings),

  getSettings: (): LibrarySettings => {
    const s = getStored<LibrarySettings>(STORAGE_KEYS.SETTINGS, initialSettings);
    if (!s.phone || s.phone.includes('90000 00000') || s.phone.includes('Dummy')) {
      return { ...s, phone: '+91 7541053789' };
    }
    return s;
  },
  setSettings: (s: LibrarySettings) => setStored<LibrarySettings>(STORAGE_KEYS.SETTINGS, s),

  getFaqs: (): FAQItem[] => getStored<FAQItem[]>(STORAGE_KEYS.FAQS, initialFaqs),
  setFaqs: (faqs: FAQItem[]) => setStored<FAQItem[]>(STORAGE_KEYS.FAQS, faqs),

  getContent: (): SiteContent => getStored<SiteContent>(STORAGE_KEYS.CONTENT, initialSiteContent),
  setContent: (c: SiteContent) => setStored<SiteContent>(STORAGE_KEYS.CONTENT, c),

  getCurrentUser: (): Profile | null => {
    const u = getStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (u && (u.full_name === 'Rahul Kumar' || u.username === 'rahulkumar' || u.username === 'rohitpaswan' || u.id === 'user-student-1')) {
      return {
        ...u,
        username: 'rohitpaswan',
        full_name: 'Rohit Paswan',
        mobile_number: '+91 7541053789',
        email: u.email === 'rahul.kumar@gmail.com' ? 'rohit.paswan@gmail.com' : u.email,
      };
    }
    return u;
  },
  setCurrentUser: (u: Profile | null) => setStored<Profile | null>(STORAGE_KEYS.CURRENT_USER, u),
};
