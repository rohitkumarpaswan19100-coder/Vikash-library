import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Phone, 
  Mail, 
  User, 
  Banknote, 
  CreditCard,
  Printer,
  X,
  Sparkles
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { ApiService } from '../../services/api';
import { Booking } from '../../types';

interface AdminBookingManagementProps {
  onViewBookingDetail: (booking: Booking) => void;
}

export const AdminBookingManagement: React.FC<AdminBookingManagementProps> = ({
  onViewBookingDetail,
}) => {
  const { allBookings, refreshData } = useBooking();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = allBookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.booking_id.toLowerCase().includes(q) ||
      (b.user_name && b.user_name.toLowerCase().includes(q)) ||
      (b.user_mobile && b.user_mobile.includes(q)) ||
      (b.user_email && b.user_email.toLowerCase().includes(q)) ||
      b.seat_number.toString().includes(q);

    const matchesStatus = statusFilter === 'all' || b.booking_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || b.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleCancelBooking = async (booking: Booking) => {
    if (window.confirm(`Cancel booking ${booking.booking_id} and release Seat #${booking.seat_number}?`)) {
      await ApiService.cancelBooking(booking.id);
      await refreshData();
      setSelectedBooking(null);
      setFeedback(`Booking ${booking.booking_id} cancelled & Seat #${booking.seat_number} released to AVAILABLE.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleConfirmCashPayment = async (booking: Booking) => {
    if (window.confirm(`Confirm receipt of ₹${booking.amount} cash for Seat #${booking.seat_number}?`)) {
      await ApiService.confirmCashPayment(booking.id, 'Verified at Admin desk');
      await refreshData();
      setSelectedBooking(null);
      setFeedback(`Payment confirmed for Booking ${booking.booking_id}!`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
            All Records
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Booking & Reservation Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete database of student seat bookings, payment states, and history.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <span className="font-bold text-white">{filtered.length}</span> of {allBookings.length} bookings
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, booking ID, mobile, or seat #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Booking Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="cash_pending">Cash Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Seat #</th>
                <th className="p-4">Student</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {filtered.length > 0 ? (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-300">
                      {b.booking_id}
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-white">#{b.seat_number}</span>
                      <span className="text-[10px] text-slate-500 block capitalize">
                        {b.floor} Floor
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {b.user_name || 'Student'}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {b.user_mobile || '—'}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₹{b.amount}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.payment_status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : b.payment_status === 'cash_pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {b.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.booking_status === 'confirmed'
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : b.booking_status === 'pending'
                            ? 'bg-amber-900/60 text-amber-300'
                            : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(b.booking_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No booking records found matching current search/filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-base">
                  #{selectedBooking.seat_number}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    Booking: {selectedBooking.booking_id}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {selectedBooking.floor} Floor • {selectedBooking.slot_type}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-white">{selectedBooking.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-mono text-slate-200">{selectedBooking.user_mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-200">{selectedBooking.user_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount & Method:</span>
                <span className="font-bold text-amber-300">
                  ₹{selectedBooking.amount} ({selectedBooking.payment_method})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-extrabold uppercase text-emerald-400">
                  {selectedBooking.payment_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Booking Status:</span>
                <span className="font-extrabold uppercase text-white">
                  {selectedBooking.booking_status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {selectedBooking.payment_status === 'cash_pending' && (
                <button
                  onClick={() => handleConfirmCashPayment(selectedBooking)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs"
                >
                  Confirm Cash
                </button>
              )}

              {selectedBooking.booking_status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  className="flex-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold py-2 rounded-xl text-xs"
                >
                  Cancel & Release Seat
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
