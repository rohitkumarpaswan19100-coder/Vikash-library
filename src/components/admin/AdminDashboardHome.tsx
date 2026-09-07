import React from 'react';
import { 
  Users, 
  Armchair, 
  CalendarCheck, 
  Banknote, 
  IndianRupee, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Booking } from '../../types';

interface AdminDashboardHomeProps {
  onNavigateTab: (tab: string) => void;
  onViewBookingDetail: (booking: Booking) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  onNavigateTab,
  onViewBookingDetail,
}) => {
  const { stats, allBookings, seats, settings } = useBooking();

  const pendingCashBookings = allBookings.filter((b) => b.payment_status === 'cash_pending');
  const recentBookings = allBookings.slice(0, 5);

  const kpis = [
    {
      label: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-[#070714]/80 border-white/10',
    },
    {
      label: 'Total Library Seats',
      value: stats?.totalSeats ?? 130,
      icon: Armchair,
      color: 'text-teal-300',
      bg: 'bg-[#070714]/80 border-white/10',
      subtitle: '52 Ground • 78 First Floor',
    },
    {
      label: 'Available Free Seats',
      value: stats?.availableSeats ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-[#070714]/80 border-emerald-500/20',
    },
    {
      label: 'Occupied / Booked',
      value: stats?.bookedSeats ?? 0,
      icon: Armchair,
      color: 'text-rose-400',
      bg: 'bg-[#070714]/80 border-rose-500/20',
    },
    {
      label: 'Pending Cash Approvals',
      value: stats?.pendingCashPayments ?? 0,
      icon: Banknote,
      color: 'text-amber-300',
      bg: 'bg-[#070714]/80 border-amber-500/30',
      alert: (stats?.pendingCashPayments ?? 0) > 0,
    },
    {
      label: 'Confirmed Bookings',
      value: stats?.confirmedBookings ?? 0,
      icon: CalendarCheck,
      color: 'text-cyan-300',
      bg: 'bg-[#070714]/80 border-white/10',
    },
    {
      label: 'Total Verified Revenue',
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-300',
      bg: 'bg-[#070714]/80 border-white/10',
    },
    {
      label: "Today's New Bookings",
      value: stats?.todayBookingsCount ?? 0,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-[#070714]/80 border-white/10',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Pending Cash Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>REAL-TIME TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            Library Operations & Live Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Vikash Library • Amba, Nabinagar Road, Bihar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('cash-payments')}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-mono font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all active:scale-95 cursor-pointer"
          >
            <Banknote className="w-4 h-4" />
            <span>Review Pending Cash ({pendingCashBookings.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${kpi.bg} relative overflow-hidden flex flex-col justify-between backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)]`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 font-mono">{kpi.label}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-black font-mono ${kpi.color}`}>
                  {kpi.value}
                </p>
                {kpi.subtitle && (
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{kpi.subtitle}</p>
                )}
              </div>
              {kpi.alert && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Floor Occupancy Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ground Floor Progress */}
        <div className="bg-[#070714]/80 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
                G
              </div>
              <div>
                <h3 className="font-bold text-sm text-white font-sans">Ground Floor (Seats 1–52)</h3>
                <p className="text-xs text-slate-400 font-mono">Capacity: 52 Desks</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('seats')}
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              View Grid →
            </button>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/5 border border-white/5 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-rose-500 h-3 transition-all"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'ground' && s.status === 'booked').length / 52) * 100}%`,
                }}
              />
              <div
                className="bg-amber-400 h-3 transition-all"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'ground' && s.status === 'pending').length / 52) * 100}%`,
                }}
              />
              <div
                className="bg-cyan-500 h-3 transition-all shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'ground' && s.status === 'available').length / 52) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono font-semibold pt-1">
              <span className="text-cyan-400">
                {seats.filter((s) => s.floor === 'ground' && s.status === 'available').length} Available
              </span>
              <span className="text-amber-400">
                {seats.filter((s) => s.floor === 'ground' && s.status === 'pending').length} Pending
              </span>
              <span className="text-rose-400">
                {seats.filter((s) => s.floor === 'ground' && s.status === 'booked').length} Booked
              </span>
            </div>
          </div>
        </div>

        {/* First Floor Progress */}
        <div className="bg-[#070714]/80 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-xs font-mono">
                1F
              </div>
              <div>
                <h3 className="font-bold text-sm text-white font-sans">First Floor (Seats 53–130)</h3>
                <p className="text-xs text-slate-400 font-mono">Capacity: 78 Desks</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('seats')}
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              View Grid →
            </button>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-white/5 border border-white/5 rounded-full h-3 overflow-hidden flex">
              <div
                className="bg-rose-500 h-3 transition-all"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'first' && s.status === 'booked').length / 78) * 100}%`,
                }}
              />
              <div
                className="bg-amber-400 h-3 transition-all"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'first' && s.status === 'pending').length / 78) * 100}%`,
                }}
              />
              <div
                className="bg-cyan-500 h-3 transition-all shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{
                  width: `${(seats.filter((s) => s.floor === 'first' && s.status === 'available').length / 78) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono font-semibold pt-1">
              <span className="text-cyan-400">
                {seats.filter((s) => s.floor === 'first' && s.status === 'available').length} Available
              </span>
              <span className="text-amber-400">
                {seats.filter((s) => s.floor === 'first' && s.status === 'pending').length} Pending
              </span>
              <span className="text-rose-400">
                {seats.filter((s) => s.floor === 'first' && s.status === 'booked').length} Booked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-[#070714]/80 rounded-2xl border border-white/10 p-6 space-y-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white font-sans">Recent Seat Bookings</h3>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {recentBookings.map((b) => (
            <div
              key={b.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                  #{b.seat_number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {b.user_name || 'Student'}
                    </span>
                    <span className="font-mono text-slate-400">({b.booking_id})</span>
                  </div>
                  <p className="text-slate-400 mt-0.5 font-mono">
                    {b.floor === 'ground' ? 'Ground Floor' : 'First Floor'} • {b.slot_type} • ₹{b.amount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center font-mono">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    b.payment_status === 'paid'
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {b.payment_status === 'cash_pending' ? 'Cash Pending' : b.payment_status}
                </span>

                <button
                  onClick={() => onViewBookingDetail(b)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

