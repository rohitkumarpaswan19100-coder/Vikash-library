import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Printer, 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
  Sparkles, 
  ShieldCheck, 
  QrCode,
  X,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../../types';
import { useBooking } from '../../context/BookingContext';

interface BookingConfirmationPassProps {
  booking: Booking | null;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const BookingConfirmationPass: React.FC<BookingConfirmationPassProps> = ({
  booking,
  onClose,
  onGoToDashboard,
}) => {
  const { settings } = useBooking();

  if (!booking) return null;

  const isConfirmed = booking.booking_status === 'confirmed';
  const isPendingCash = booking.payment_status === 'cash_pending';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Pass Top Banner */}
        <div className={`p-6 text-white text-center relative ${
          isConfirmed ? 'bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950' : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
            {isConfirmed ? (
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            ) : (
              <Clock className="w-7 h-7 text-amber-400 animate-pulse" />
            )}
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {settings.library_name} • Digital Pass
          </span>

          <h3 className="text-xl font-extrabold text-white mt-2">
            {isConfirmed ? 'Booking Confirmed!' : 'Seat Reserved (Pending Cash Payment)'}
          </h3>

          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {isConfirmed
              ? 'Your seat is activated. Please show this pass at library entry.'
              : 'Visit reception to submit cash and activate your seat.'}
          </p>
        </div>

        {/* Pass Details (Printable Slip) */}
        <div id="printable-pass" className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          {/* Booking ID & Seat Number Banner */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Booking ID
              </p>
              <p className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                {booking.booking_id}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Date: {new Date(booking.booking_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-3 text-center min-w-[75px] shadow-sm">
              <span className="text-[9px] uppercase font-bold text-amber-400 block">SEAT</span>
              <span className="text-2xl font-black">{booking.seat_number}</span>
              <span className="text-[9px] text-slate-300 block capitalize">
                {booking.floor} Floor
              </span>
            </div>
          </div>

          {/* Student & Payment Summary Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Name</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                {booking.user_name || 'Registered Student'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Mobile Number</span>
              <span className="font-semibold text-slate-800 text-xs sm:text-sm block font-mono">
                {booking.user_mobile || '—'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Method</span>
              <span className="font-bold text-slate-900 text-xs uppercase block">
                {booking.payment_method} Payment
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Status</span>
              <span className={`font-bold text-xs capitalize block ${
                booking.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {booking.payment_status === 'cash_pending' ? 'Pending Cash at Desk' : booking.payment_status}
              </span>
            </div>
          </div>

          {/* Location & Instructions Card */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-xs">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>{settings.library_name} Desk Location</span>
            </div>
            <p className="text-xs text-indigo-950 font-medium">
              {settings.address}, {settings.landmark && `${settings.landmark}, `}{settings.city}, Bihar
            </p>
            <p className="text-[11px] text-indigo-800">
              Contact Reception: <span className="font-mono font-bold">{settings.phone}</span>
            </p>
          </div>

          {/* QR & Security Simulation */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px]">
            <div className="flex items-center gap-2">
              <QrCode className="w-6 h-6 text-slate-800" />
              <span>Digital Security Verification Verified</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">AMBA-BIHAR-STUDY</span>
          </div>
        </div>

        {/* Pass Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200/80 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onGoToDashboard();
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>View My Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
