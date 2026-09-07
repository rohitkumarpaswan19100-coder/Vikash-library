import React, { useState } from 'react';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Shield, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  MapPin, 
  Clock,
  Sparkles,
  Zap,
  Radio,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface NavbarProps {
  currentView: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
  openAuthModal?: (mode: 'login' | 'register') => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenSqlModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigate,
  openAuthModal,
  onOpenAuthModal,
  onOpenSqlModal,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { activeBooking, settings } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isDbConnected = isSupabaseConfigured();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    if (onOpenAuthModal) onOpenAuthModal(mode);
    else if (openAuthModal) openAuthModal(mode);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'seats', label: 'Seat Map' },
    { id: 'about', label: 'About Library' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'faq', label: 'FAQ' },
    { id: 'location', label: 'Location' },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) onNavigate(id);
    else if (setCurrentView) setCurrentView(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#020205]/85 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top telemetry micro-bar */}
      <div className="bg-black/60 border-b border-white/5 text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center text-slate-400">
        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>{settings.address}, {settings.city}, Bihar</span>
          </span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Daily: {settings.opening_hours}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px]">
          {onOpenSqlModal && (
            <button
              id="navbar-supabase-status-btn"
              onClick={onOpenSqlModal}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all cursor-pointer font-bold ${
                isDbConnected
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900/80 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              }`}
              title="Supabase Cloud Database Connection"
            >
              <Database className="w-3 h-3" />
              <span>{isDbConnected ? 'Supabase: Live Sync' : 'Connect Supabase Key'}</span>
            </button>
          )}
          {settings.notice_banner && (
            <span className="hidden lg:inline bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
              {settings.notice_banner}
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>130 Active Desks</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-indigo-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:border-cyan-400 transition-all duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-cyber-glow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {settings.library_name}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  Amba
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-normal tracking-wide">
                Modern Digital Study Library & Reading Room
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Book Seat CTA on Desktop */}
            <button
              id="nav-book-seat-btn"
              onClick={() => handleNavClick('seats')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.55)] transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Book Your Seat</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  id="nav-user-dropdown-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center text-xs font-black">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden md:block pr-1">
                    <p className="text-xs font-bold text-slate-200 leading-none truncate max-w-[100px]">
                      {user.full_name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-cyan-400 capitalize font-mono">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-[#070714] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-2xl">
                      <div className="px-4 py-2.5 border-b border-white/5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate mt-0.5">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-cyan-400 font-mono truncate">{user.email}</p>
                      </div>

                      <button
                        id="dropdown-dashboard-btn"
                        onClick={() => {
                          handleNavClick('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2.5 font-semibold transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>My Profile & Bookings</span>
                        {activeBooking && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </button>

                      {isAdmin && (
                        <button
                          id="dropdown-admin-btn"
                          onClick={() => {
                            handleNavClick('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border-y border-amber-500/20 flex items-center gap-2.5 font-bold transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <button
                        id="dropdown-book-seat-btn"
                        onClick={() => {
                          handleNavClick('seats');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Seat Map (130 Seats)</span>
                      </button>

                      <div className="my-1 border-t border-white/5" />

                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          handleNavClick('home');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => handleOpenAuth('login')}
                  className="text-slate-300 hover:text-white font-semibold text-xs px-3 py-1.5 rounded-xl hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => handleOpenAuth('register')}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl border border-white/15 transition-all shadow-sm cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#070714] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleNavClick('seats')}
              className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Book Seat</span>
            </button>
            {user ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenAuth('login');
                }}
                className="w-full flex items-center justify-center gap-1.5 border border-white/15 bg-white/5 text-slate-200 font-bold text-xs py-2.5 rounded-xl"
              >
                <span>Login</span>
              </button>
            )}
          </div>

          <div className="space-y-1 pt-1 border-t border-white/5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  currentView === link.id
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 mt-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

