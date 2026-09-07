import React from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  IndianRupee, 
  Armchair, 
  Users, 
  Calendar,
  Layers,
  Banknote,
  CheckCircle2
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const AdminReports: React.FC = () => {
  const { stats, allBookings, seats, settings } = useBooking();

  const totalRevenue = stats?.totalRevenue ?? 0;
  const pendingRevenue = allBookings
    .filter((b) => b.payment_status === 'cash_pending')
    .reduce((acc, b) => acc + b.amount, 0);

  const groundBooked = seats.filter((s) => s.floor === 'ground' && s.status === 'booked').length;
  const firstBooked = seats.filter((s) => s.floor === 'first' && s.status === 'booked').length;

  const handleExportBookingsCSV = () => {
    if (allBookings.length === 0) {
      alert('No bookings to export.');
      return;
    }

    const headers = ['Booking ID', 'Seat Number', 'Floor', 'User Name', 'Mobile', 'Email', 'Amount', 'Payment Method', 'Payment Status', 'Booking Status', 'Date'];
    const rows = allBookings.map((b) => [
      b.booking_id,
      b.seat_number,
      b.floor,
      `"${b.user_name || ''}"`,
      `"${b.user_mobile || ''}"`,
      `"${b.user_email || ''}"`,
      b.amount,
      b.payment_method,
      b.payment_status,
      b.booking_status,
      b.booking_date,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vikash_library_bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
            Financial & Usage Analytics
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Revenue & Occupancy Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit library admissions, collection streams, and export audit files.
          </p>
        </div>

        <button
          onClick={handleExportBookingsCSV}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Bookings (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Verified Paid Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}.00
          </p>
          <p className="text-[11px] text-slate-500">
            Confirmed cash and verified transactions
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Pending Desk Collections</span>
            <Banknote className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono">
            ₹{pendingRevenue.toLocaleString('en-IN')}.00
          </p>
          <p className="text-[11px] text-slate-500">
            Awaiting student counter arrival in Amba
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Seat Utilization</span>
            <Armchair className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-indigo-400">
            {Math.round(((groundBooked + firstBooked) / 130) * 100)}%
          </p>
          <p className="text-[11px] text-slate-500">
            {groundBooked + firstBooked} of 130 desks reserved
          </p>
        </div>
      </div>

      {/* Floor Breakdown Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Ground Floor Breakdown (52 Capacity)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Seats 1 to 52</span>
              <span className="font-bold text-white">52 Units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Occupied Desks</span>
              <span className="font-bold text-rose-400">{groundBooked} ({Math.round((groundBooked / 52) * 100)}%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Available Vacancies</span>
              <span className="font-bold text-emerald-400">{52 - groundBooked}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Estimated Monthly Value</span>
              <span className="font-mono font-bold text-amber-300">₹{(52 * settings.monthly_fee).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>First Floor Breakdown (78 Capacity)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Seats 53 to 130</span>
              <span className="font-bold text-white">78 Units</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Occupied Desks</span>
              <span className="font-bold text-rose-400">{firstBooked} ({Math.round((firstBooked / 78) * 100)}%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-850">
              <span className="text-slate-400">Available Vacancies</span>
              <span className="font-bold text-emerald-400">{78 - firstBooked}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Estimated Monthly Value</span>
              <span className="font-mono font-bold text-indigo-300">₹{(78 * settings.monthly_fee).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
