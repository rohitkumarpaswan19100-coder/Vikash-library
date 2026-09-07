import React, { useState } from 'react';
import { 
  Banknote, 
  CheckCircle, 
  XCircle, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { ApiService } from '../../services/api';
import { Booking } from '../../types';

export const AdminCashPayments: React.FC = () => {
  const { allBookings, refreshData } = useBooking();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const pendingCashBookings = allBookings.filter(
    (b) => b.payment_status === 'cash_pending' && b.booking_status === 'pending'
  );

  const filtered = pendingCashBookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.booking_id.toLowerCase().includes(q) ||
      (b.user_name && b.user_name.toLowerCase().includes(q)) ||
      (b.user_mobile && b.user_mobile.includes(q)) ||
      (b.user_email && b.user_email.toLowerCase().includes(q)) ||
      b.seat_number.toString().includes(q)
    );
  });

  const handleConfirmCash = async (booking: Booking) => {
    if (window.confirm(`Confirm receipt of ₹${booking.amount} cash for Seat #${booking.seat_number} from ${booking.user_name || 'Student'}?`)) {
      setProcessingId(booking.id);
      const success = await ApiService.confirmCashPayment(booking.id, 'Verified at Vikash Library Reception Desk');
      setProcessingId(null);

      if (success) {
        setFeedback({
          message: `Payment confirmed for Booking ${booking.booking_id}. Seat #${booking.seat_number} is now officially BOOKED & ACTIVE!`,
          type: 'success',
        });
        await refreshData();
      } else {
        setFeedback({ message: 'Failed to confirm payment.', type: 'error' });
      }

      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleRejectCash = async (booking: Booking) => {
    const reason = window.prompt('Enter reason for rejection (e.g. Student cancelled / No cash received):', 'Cash not received within reservation window');
    if (reason) {
      setProcessingId(booking.id);
      const success = await ApiService.rejectCashPayment(booking.id, reason);
      setProcessingId(null);

      if (success) {
        setFeedback({
          message: `Booking ${booking.booking_id} has been cancelled and Seat #${booking.seat_number} is now released back to AVAILABLE.`,
          type: 'success',
        });
        await refreshData();
      } else {
        setFeedback({ message: 'Failed to reject payment.', type: 'error' });
      }

      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
              Desk Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Cash Payment Confirmation Desk
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify student cash payments received at the Vikash Library counter in Amba.
          </p>
        </div>

        <div className="bg-amber-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
          <Banknote className="w-4 h-4" />
          <span>{pendingCashBookings.length} Pending Approval(s)</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950 border border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, booking ID, mobile, or seat #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {/* Cash Bookings List / Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shrink-0 shadow-md">
                  <span className="text-[9px] uppercase leading-none opacity-80">SEAT</span>
                  <span className="text-lg leading-tight">#{b.seat_number}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">
                      {b.user_name || 'Student'}
                    </span>
                    <span className="font-mono text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800/80">
                      {b.booking_id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span className="font-mono text-slate-300">{b.user_mobile || '—'}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-300">{b.user_email}</span>
                    </span>
                    <span className="capitalize text-indigo-400 font-semibold">
                      {b.floor} Floor • {b.slot_type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Reserved on:{' '}
                    {new Date(b.booking_date).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Amount & Action Buttons */}
              <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-850">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Cash Amount</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    ₹{b.amount}.00
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={processingId === b.id}
                    onClick={() => handleConfirmCash(b)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Cash Payment</span>
                  </button>

                  <button
                    disabled={processingId === b.id}
                    onClick={() => handleRejectCash(b)}
                    className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-white">All Clear!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no pending cash payment approvals at this time. When a student chooses "Cash Payment", it will appear here for verification.
          </p>
        </div>
      )}
    </div>
  );
};
