import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  Shield, 
  ArrowRight, 
  Users, 
  Clock, 
  Layers,
  Zap,
  Activity,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

interface HeroProps {
  onBookSeatClick: () => void;
  openAuthModal?: (mode: 'login' | 'register') => void;
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookSeatClick, openAuthModal, onExploreClick }) => {
  const { user } = useAuth();
  const { settings, stats, seats } = useBooking();

  const availableCount = stats?.availableSeats ?? seats.filter((s) => s.status === 'available').length;
  const bookedCount = stats?.bookedSeats ?? seats.filter((s) => s.status === 'booked').length;
  const pendingCount = stats?.pendingBookings ?? seats.filter((s) => s.status === 'pending').length;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Immersive Atmospheric Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location & Live Telemetry Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settings.address}, Amba, Bihar</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-bold">130 Seats Online</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-cyan-400 font-mono block">
                Official Self-Study Facility
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                VIKASH <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">LIBRARY</span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-300 italic border-l-2 border-cyan-500/50 pl-4 my-3">
                "{settings.tagline}"
              </p>
            </div>

            {/* Narrative Description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Amba’s advanced self-study centre designed for ambitious students and competitive exam aspirants. Guaranteed dedicated personal numbered desks, soundproof calm, uninterrupted high-speed WiFi, and real-time live digital seat reservation.
            </p>

            {/* Core Highlights Glass Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 p-3 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-colors">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Personal Numbered Desks</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 p-3 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-colors">
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">Zero Distraction Zone</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/10 p-3 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-colors col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">6 AM – 11 PM Long Hours</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <button
                id="hero-book-seat-btn"
                onClick={onBookSeatClick}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Reserve Seat Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onExploreClick && (
                <button
                  id="hero-explore-btn"
                  onClick={onExploreClick}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-2xl border border-white/10 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Explore Floor Map</span>
                </button>
              )}

              {!user && openAuthModal && !onExploreClick && (
                <button
                  id="hero-create-account-btn"
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-2xl border border-white/10 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Create Account</span>
                </button>
              )}
            </div>

            {/* Live Database Sync Indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-time live inventory & verified telemetry sync</span>
            </div>
          </div>

          {/* Right Column: Live Interactive Seat Availability Holographic Glass Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#070714]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
              {/* Glowing decorative edge line */}
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75" />

              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">Seat Inventory Status</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Capacity: 130 Verified Desks</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Stat Counters Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6 font-mono">
                <div className="bg-white/[0.02] border border-emerald-500/30 rounded-2xl p-3.5 text-center shadow-inner">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">{availableCount}</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider font-semibold text-slate-300 mt-1">Available</p>
                </div>
                <div className="bg-white/[0.02] border border-rose-500/30 rounded-2xl p-3.5 text-center shadow-inner">
                  <p className="text-2xl sm:text-3xl font-black text-rose-400">{bookedCount}</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider font-semibold text-slate-300 mt-1">Occupied</p>
                </div>
                <div className="bg-white/[0.02] border border-amber-500/30 rounded-2xl p-3.5 text-center shadow-inner">
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider font-semibold text-slate-300 mt-1">Pending Cash</p>
                </div>
              </div>

              {/* Floors Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      Ground Floor (Desks 1–52)
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px]">52 Seats</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden flex border border-white/5">
                    <div 
                      className="bg-rose-500 h-2.5 transition-all duration-500" 
                      style={{ width: `${(seats.filter(s => s.floor === 'ground' && s.status === 'booked').length / 52) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500 h-2.5 transition-all duration-500" 
                      style={{ width: `${(seats.filter(s => s.floor === 'ground' && s.status === 'pending').length / 52) * 100}%` }}
                    />
                    <div 
                      className="bg-emerald-500 h-2.5 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
                      style={{ width: `${(seats.filter(s => s.floor === 'ground' && s.status === 'available').length / 52) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                    <span className="text-emerald-400">
                      {seats.filter(s => s.floor === 'ground' && s.status === 'available').length} free
                    </span>
                    <span className="text-rose-400">
                      {seats.filter(s => s.floor === 'ground' && s.status === 'booked').length} booked
                    </span>
                  </div>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      First Floor (Desks 53–130)
                    </span>
                    <span className="text-amber-400 font-mono text-[11px]">78 Seats</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden flex border border-white/5">
                    <div 
                      className="bg-rose-500 h-2.5 transition-all duration-500" 
                      style={{ width: `${(seats.filter(s => s.floor === 'first' && s.status === 'booked').length / 78) * 100}%` }}
                    />
                    <div 
                      className="bg-amber-500 h-2.5 transition-all duration-500" 
                      style={{ width: `${(seats.filter(s => s.floor === 'first' && s.status === 'pending').length / 78) * 100}%` }}
                    />
                    <div 
                      className="bg-emerald-500 h-2.5 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" 
                      style={{ width: `${(seats.filter(s => s.floor === 'first' && s.status === 'available').length / 78) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
                    <span className="text-emerald-400">
                      {seats.filter(s => s.floor === 'first' && s.status === 'available').length} free
                    </span>
                    <span className="text-rose-400">
                      {seats.filter(s => s.floor === 'first' && s.status === 'booked').length} booked
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Floor Quick Selector Button */}
              <button
                id="hero-open-seatmap-btn"
                onClick={onBookSeatClick}
                className="w-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-98 cursor-pointer"
              >
                <span>Select Desk on Live Map</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

