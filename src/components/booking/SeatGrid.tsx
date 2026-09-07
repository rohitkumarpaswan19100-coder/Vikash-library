import React, { useState } from 'react';
import { 
  Check, 
  Lock, 
  Clock, 
  Ban, 
  Sparkles, 
  Layers, 
  Info, 
  ChevronRight, 
  User,
  ShieldAlert,
  ArrowUpDown,
  Zap,
  Radio,
  Wifi,
  Wind
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Seat, FloorType } from '../../types';

interface SeatGridProps {
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenBookingModal?: (seat: Seat) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({ onOpenAuthModal, onOpenBookingModal }) => {
  const { user } = useAuth();
  const { 
    seats, 
    groundFloorSeats, 
    firstFloorSeats, 
    selectedFloor, 
    setSelectedFloor, 
    selectedSeat, 
    selectSeat,
    settings 
  } = useBooking();

  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const activeSeats = selectedFloor === 'ground' ? groundFloorSeats : firstFloorSeats;

  const currentAvailable = activeSeats.filter((s) => s.status === 'available').length;
  const currentBooked = activeSeats.filter((s) => s.status === 'booked').length;
  const currentPending = activeSeats.filter((s) => s.status === 'pending').length;
  const currentBlocked = activeSeats.filter((s) => s.status === 'blocked').length;

  const getSeatColorClasses = (seat: Seat) => {
    const isSelected = selectedSeat?.seat_number === seat.seat_number;

    if (isSelected) {
      return 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-teal-300 text-slate-950 border-cyan-200 ring-4 ring-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.7)] scale-105 z-10 font-black';
    }

    switch (seat.status) {
      case 'available':
        return 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.35)] hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs';
      case 'booked':
        return 'bg-rose-950/20 text-rose-400/70 border-rose-500/20 cursor-not-allowed opacity-65';
      case 'pending':
        return 'bg-amber-950/30 text-amber-400 border-amber-500/30 cursor-not-allowed';
      case 'blocked':
        return 'bg-white/[0.02] text-slate-500 border-white/5 cursor-not-allowed opacity-40';
      default:
        return 'bg-white/5 text-slate-400 border-white/10';
    }
  };

  const getStatusBadge = (status: Seat['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-[10px] font-bold text-emerald-400 font-mono">Open</span>;
      case 'booked':
        return <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5 font-mono"><Lock className="w-2.5 h-2.5" /> Taken</span>;
      case 'pending':
        return <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5 font-mono"><Clock className="w-2.5 h-2.5" /> Hold</span>;
      case 'blocked':
        return <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5 font-mono"><Ban className="w-2.5 h-2.5" /> Off</span>;
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;
    selectSeat(seat);
    if (onOpenBookingModal) {
      onOpenBookingModal(seat);
    }
  };

  return (
    <section id="seats-map" className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header and Value Proposition */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 mb-2 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>130 Active Desks • Live Floor Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Reserved Study Desk
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Click any active green desk below to select your numbered seat and lock your monthly subscription.
            </p>
          </div>

          {/* Pricing Highlight Holographic Card */}
          <div className="bg-[#070714]/80 px-6 py-3.5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-4 shrink-0 backdrop-blur-xl group hover:border-cyan-500/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(34,211,238,0.25)]">
              ₹
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-semibold">Standard Pass</p>
              <p className="text-xl font-black text-white leading-tight font-mono">
                ₹{settings.monthly_fee} <span className="text-xs font-normal text-slate-400">/ mo</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floor Selection Tabs and Controls Panel */}
        <div className="bg-[#070714]/80 rounded-3xl p-5 sm:p-7 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-full sm:w-auto">
              <button
                id="tab-ground-floor-btn"
                onClick={() => setSelectedFloor('ground')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider ${
                  selectedFloor === 'ground'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Ground Floor</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  selectedFloor === 'ground' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/5 text-cyan-400'
                }`}>
                  Desks 1–52
                </span>
              </button>

              <button
                id="tab-first-floor-btn"
                onClick={() => setSelectedFloor('first')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider ${
                  selectedFloor === 'first'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>First Floor</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  selectedFloor === 'first' ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-white/5 text-cyan-400'
                }`}>
                  Desks 53–130
                </span>
              </button>
            </div>

            {/* Floor Status Counters */}
            <div className="flex items-center gap-2.5 text-xs flex-wrap font-mono">
              <span className="flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentAvailable} Available
              </span>
              <span className="flex items-center gap-1.5 font-bold text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {currentBooked} Booked
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {currentPending} Pending
              </span>
            </div>
          </div>

          {/* Color Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="font-bold text-slate-200 uppercase tracking-wider font-mono text-[10px]">Legend:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-950/60 border border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                Available (Click to Pick)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-cyan-400 border border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                Your Selection
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-950/60 border border-amber-400" />
                Pending Verification
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-950/60 border border-rose-400" />
                Occupied
              </span>
            </div>

            <div className="text-[11px] text-cyan-400 font-mono flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Real-time anti-conflict seat lock active</span>
            </div>
          </div>
        </div>

        {/* Selected Seat Floating Banner */}
        {selectedSeat && (
          <div className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-950 text-cyan-400 flex items-center justify-center font-black text-lg shadow-md font-mono border border-cyan-400/40">
                #{selectedSeat.seat_number}
              </div>
              <div>
                <p className="font-black text-sm sm:text-base uppercase tracking-tight">
                  Desk #{selectedSeat.seat_number} Selected ({selectedSeat.floor === 'ground' ? 'Ground Floor' : 'First Floor'})
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Monthly Pass: ₹{settings.monthly_fee} • Instant Desk Reservation Ready
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onOpenBookingModal) onOpenBookingModal(selectedSeat);
              }}
              className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2 shrink-0 shadow-lg cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>Complete Booking</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Visual Library Room Layout Grid */}
        <div className="bg-[#070714]/80 rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative space-y-6">
          {/* Top Corridor Telemetry */}
          <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-mono">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-xl text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>🚪 Library Entrance & Reception Station</span>
            </div>
            <div className="text-cyan-400/80 uppercase tracking-widest text-[10px]">
              Layout: {selectedFloor === 'ground' ? 'Ground Floor Desks (1–52)' : 'First Floor Desks (53–130)'}
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-xl text-slate-300">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>5G High-Speed Mesh Zone</span>
            </div>
          </div>

          {/* Seat Grid Layout */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2.5 sm:gap-3">
            {activeSeats.map((seat) => {
              const isSelected = selectedSeat?.seat_number === seat.seat_number;
              const isAvailable = seat.status === 'available';

              return (
                <button
                  key={seat.id}
                  id={`seat-card-${seat.seat_number}`}
                  disabled={!isAvailable}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  className={`relative p-2.5 sm:p-3 rounded-2xl border flex flex-col items-center justify-center transition-all duration-200 text-center font-mono ${getSeatColorClasses(
                    seat
                  )}`}
                  title={`Seat #${seat.seat_number} - ${seat.status}`}
                >
                  <span className="text-[9px] uppercase tracking-widest opacity-60 leading-none font-sans font-bold">
                    DESK
                  </span>
                  <span className="text-base sm:text-lg font-black tracking-tight my-0.5">
                    {String(seat.seat_number).padStart(2, '0')}
                  </span>
                  <div className="scale-90 origin-center">
                    {getStatusBadge(seat.status)}
                  </div>

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 text-cyan-300 flex items-center justify-center text-xs font-black shadow-md border border-cyan-400">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Room Environment Bar */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Air-Conditioned Comfort</span>
            </span>
            <span className="text-slate-400">
              Click any green desk to reserve and proceed.
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Dedicated 230V Socket per Desk</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

