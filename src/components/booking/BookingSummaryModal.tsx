import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Calendar,
  Clock,
  Zap
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { Seat } from '../../types';

interface BookingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
}) => {
  const { user } = useAuth();
  const { selectedSeat, settings, createSeatBooking } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [slotType, setSlotType] = useState<string>('Monthly (Full Day Access)');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !selectedSeat) return null;

  const handleConfirmBooking = async () => {
    if (!user) {
      onOpenAuthModal('login');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please agree to the library code of conduct and rules.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createSeatBooking(paymentMethod, slotType);

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Failed to complete booking. Please try another seat.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#070714] text-slate-200 rounded-3xl max-w-xl w-full shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl">
        {/* Header */}
        <div className="bg-[#0a0a1f] p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-lg font-mono shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              #{selectedSeat.seat_number}
            </div>
            <div>
              <h3 className="font-black text-lg text-white font-sans">Desk Telemetry Reservation</h3>
              <p className="text-xs text-slate-400 font-mono">
                {selectedSeat.floor === 'ground' ? 'Ground Floor (1–52)' : 'First Floor (53–130)'} • {settings.library_name}
              </p>
            </div>
          </div>
          <button
            id="close-booking-summary-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* User Details Box */}
          {user ? (
            <div className="bg-white/[0.03] rounded-2xl p-4.5 border border-white/10 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Student Identity Pass</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-white font-sans">{user.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">{user.mobile_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">Age: {user.age} • {user.gender}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 text-center space-y-3">
              <p className="text-xs font-bold text-amber-300">
                You need to log in or create an account to reserve this study desk.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Seat & Slot Configuration */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Study Shift / Subscription Slot
            </label>
            <select
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
              className="w-full p-3 bg-[#0a0a1f] border border-white/10 rounded-2xl text-xs font-semibold text-white focus:outline-hidden focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
            >
              <option value="Monthly (Full Day Access)">Monthly (Full Day Access: 6 AM – 11 PM)</option>
              <option value="Monthly (Morning Shift: 6 AM – 2 PM)">Monthly (Morning Shift: 6 AM – 2 PM)</option>
              <option value="Monthly (Evening Shift: 2 PM – 11 PM)">Monthly (Evening Shift: 2 PM – 11 PM)</option>
            </select>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Select Payment Mode
            </label>

            {/* Option 1: Cash Payment */}
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                paymentMethod === 'cash'
                  ? 'border-cyan-500/60 bg-cyan-950/30 ring-1 ring-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                paymentMethod === 'cash' ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/20'
              }`}>
                {paymentMethod === 'cash' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs sm:text-sm font-sans">
                    Cash Payment (Manual Confirmation at Library Desk)
                  </span>
                  <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your seat will be reserved in <strong>Pending</strong> status. Visit the Vikash Library reception in Amba, submit cash, and the admin will confirm your seat.
                </p>
              </div>
            </div>

            {/* Option 2: Online Payment */}
            <div
              className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] opacity-60 flex items-start gap-3.5"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white/10 flex items-center justify-center shrink-0 mt-0.5 bg-white/5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-400 text-xs sm:text-sm font-sans">
                    Online Payment (UPI / Debit Card / QR)
                  </span>
                  <span className="bg-white/10 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Payment gateway integration in progress. Please use Cash Payment for immediate seat reservation.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-[#030308] border border-white/10 rounded-2xl p-4.5 space-y-2.5 font-mono">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Monthly Study Desk Reservation</span>
              <span className="text-white">₹{settings.monthly_fee}.00</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Security Deposit / Maintenance</span>
              <span className="text-emerald-400 font-semibold">₹0.00 (Waived)</span>
            </div>
            <div className="pt-2.5 border-t border-white/10 flex justify-between items-center">
              <span className="font-bold text-sm text-white font-sans">Total Payable</span>
              <span className="text-xl font-black text-cyan-400 font-mono shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                ₹{settings.monthly_fee}.00
              </span>
            </div>
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400"
            />
            <span>
              I agree to maintain complete silence, respect library discipline, and follow the seat reservation policy at Vikash Library.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#0a0a1f] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 font-mono font-bold text-xs hover:bg-white/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="confirm-booking-btn"
            disabled={isSubmitting || !user}
            onClick={handleConfirmBooking}
            className={`px-6 py-2.5 rounded-xl font-mono font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              !user
                ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                : isSubmitting
                ? 'bg-cyan-500/50 text-slate-950 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95 cursor-pointer'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Reserving Desk...'
                : user
                ? 'Confirm & Create Booking'
                : 'Login to Continue'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

