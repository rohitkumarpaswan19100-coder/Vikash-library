import React from 'react';
import { BookOpen, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Zap } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, openAuthModal }) => {
  const { settings } = useBooking();

  return (
    <footer className="bg-[#030308] text-slate-300 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white tracking-tight font-sans">
                {settings.library_name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {settings.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold bg-cyan-950/40 px-3 py-2 rounded-xl border border-cyan-500/20 w-fit">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Disciplined & Peaceful Study Environment</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400 hover:translate-x-1 inline-block transform"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('seats');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-300 transition-colors font-medium text-cyan-400 cursor-pointer hover:translate-x-1 inline-block transform"
                >
                  Seat Map & Telemetry (130 Seats)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400 hover:translate-x-1 inline-block transform"
                >
                  About Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400 hover:translate-x-1 inline-block transform"
                >
                  How It Works & Booking Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('faq');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-slate-400 hover:translate-x-1 inline-block transform"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Location & Contact
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.landmark && `${settings.landmark}, `}
                  {settings.city}, {settings.state} - {settings.pincode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-mono text-xs">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300">{settings.opening_hours}</span>
              </li>
            </ul>
          </div>

          {/* Student Access & Admin */}
          <div>
            <h4 className="text-white font-mono font-bold text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
              Student Portal
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Login to view your assigned seat pass, check cash verification status, or extend your monthly subscription.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => openAuthModal('login')}
                className="w-full text-center bg-white/5 hover:bg-white/10 text-white font-mono font-semibold text-xs py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                Student Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="w-full text-center bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-mono font-bold text-xs py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
              >
                New Student Registration
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.library_name}, Amba, Bihar. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Ground Floor (1–52) & 1st Floor (53–130)</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-sans">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Amba learners
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

