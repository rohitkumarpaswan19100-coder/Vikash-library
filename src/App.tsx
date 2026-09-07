import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider, useBooking } from './context/BookingContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Home Page Components
import { Hero } from './components/home/Hero';
import { AboutSection } from './components/home/AboutSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { HowItWorks } from './components/home/HowItWorks';
import { LocationSection } from './components/home/LocationSection';
import { FAQSection } from './components/home/FAQSection';

// Booking Components
import { SeatGrid } from './components/booking/SeatGrid';
import { BookingSummaryModal } from './components/booking/BookingSummaryModal';
import { BookingConfirmationPass } from './components/booking/BookingConfirmationPass';

// User & Auth Components
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboard } from './components/dashboard/UserDashboard';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardHome } from './components/admin/AdminDashboardHome';
import { AdminCashPayments } from './components/admin/AdminCashPayments';
import { AdminSeatManagement } from './components/admin/AdminSeatManagement';
import { AdminBookingManagement } from './components/admin/AdminBookingManagement';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminContentSettings } from './components/admin/AdminContentSettings';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSqlSetupModal } from './components/admin/AdminSqlSetupModal';

import { Booking, Seat } from './types';

const MainApp: React.FC = () => {
  const { user, isAdmin, switchDemoUser } = useAuth();
  const { 
    selectedSeat, 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    recentCreatedBooking,
    activeBooking
  } = useBooking();

  // Navigation State
  const [activeView, setActiveView] = useState<'home' | 'seats' | 'dashboard' | 'admin'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isPassModalOpen, setIsPassModalOpen] = useState<boolean>(false);
  const [passBookingData, setPassBookingData] = useState<Booking | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);

  // Trigger Confirmation Pass when new booking is created
  useEffect(() => {
    if (recentCreatedBooking) {
      setPassBookingData(recentCreatedBooking);
      setIsPassModalOpen(true);
    }
  }, [recentCreatedBooking]);

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleViewPass = (booking: Booking) => {
    setPassBookingData(booking);
    setIsPassModalOpen(true);
  };

  // Scroll to section helper
  const handleScrollToSection = (sectionId: string) => {
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-300 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Immersive Atmospheric Radial Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,transparent_60%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,#0f172a_0%,transparent_50%)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_30%,#083344_0%,transparent_45%)] opacity-30" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* 1. ADMIN VIEW */}
        {activeView === 'admin' ? (
          <AdminLayout
            currentTab={adminTab}
            setCurrentTab={setAdminTab}
            onExitAdmin={() => setActiveView('home')}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          >
            {/* If user is not admin, provide seamless switch button */}
            {!isAdmin && (
              <div className="mb-6 p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs backdrop-blur-xl">
                <div className="text-amber-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span><strong>Admin Mode Preview:</strong> Browsing as {user ? user.full_name : 'Guest'}. Switch to Administrator account for desk confirmation actions.</span>
                </div>
                <button
                  onClick={() => switchDemoUser('admin')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-[0_0_12px_rgba(251,191,36,0.4)] transition-all"
                >
                  Switch to Admin Account
                </button>
              </div>
            )}

            {adminTab === 'dashboard' && (
              <AdminDashboardHome
                onNavigateTab={(tab) => setAdminTab(tab)}
                onViewBookingDetail={(b) => {
                  setPassBookingData(b);
                  setIsPassModalOpen(true);
                }}
              />
            )}

            {adminTab === 'cash-payments' && <AdminCashPayments />}

            {adminTab === 'seats' && <AdminSeatManagement />}

            {adminTab === 'bookings' && (
              <AdminBookingManagement
                onViewBookingDetail={(b) => {
                  setPassBookingData(b);
                  setIsPassModalOpen(true);
                }}
              />
            )}

            {adminTab === 'users' && <AdminUserManagement />}

            {adminTab === 'settings' && <AdminContentSettings activeSection="settings" />}

            {adminTab === 'content' && <AdminContentSettings activeSection="content" />}

            {adminTab === 'faqs' && <AdminContentSettings activeSection="faqs" />}

            {adminTab === 'reports' && <AdminReports />}
          </AdminLayout>
        ) : (
          /* 2. PUBLIC & STUDENT PORTAL VIEWS */
          <>
            <Navbar
              onOpenAuthModal={handleOpenAuthModal}
              onOpenSqlModal={() => setIsSqlModalOpen(true)}
              onNavigate={(view) => {
                if (view === 'seats') {
                  setActiveView('seats');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'dashboard') {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'admin') {
                  setActiveView('admin');
                } else {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              currentView={activeView}
            />

            <main className="flex-1">
              {activeView === 'seats' ? (
                <div className="py-10">
                  <SeatGrid onOpenBookingModal={handleOpenBookingModal} />
                </div>
              ) : activeView === 'dashboard' ? (
                <UserDashboard
                  onNavigateToSeats={() => {
                    setActiveView('seats');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewPass={handleViewPass}
                />
              ) : (
                /* Home View */
                <div className="space-y-0">
                  <Hero
                    onBookSeatClick={() => {
                      setActiveView('seats');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onExploreClick={() => handleScrollToSection('seat-section')}
                  />

                  <AboutSection />

                  <div id="seat-section" className="py-16 border-t border-b border-white/5 bg-black/30 backdrop-blur-md">
                    <SeatGrid onOpenBookingModal={handleOpenBookingModal} />
                  </div>

                  <WhyChooseUs />

                  <HowItWorks
                    onStartBooking={() => {
                      setActiveView('seats');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />

                  <LocationSection />

                  <FAQSection />
                </div>
              )}
            </main>

            <Footer
              onNavigate={(view) => {
                if (view === 'seats') {
                  setActiveView('seats');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'admin') {
                  setActiveView('admin');
                } else if (view === 'dashboard') {
                  setActiveView('dashboard');
                } else {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* 2. Booking Summary Modal */}
      <BookingSummaryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onOpenAuthModal={(mode) => {
          setIsBookingModalOpen(false);
          handleOpenAuthModal(mode);
        }}
      />

      {/* 3. Printable Confirmation Pass Modal */}
      <BookingConfirmationPass
        booking={passBookingData}
        onClose={() => setIsPassModalOpen(false)}
        onGoToDashboard={() => {
          setIsPassModalOpen(false);
          setActiveView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. Supabase SQL Setup Modal */}
      <AdminSqlSetupModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
