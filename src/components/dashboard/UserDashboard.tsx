import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  Edit3, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  XCircle,
  Eye,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Booking } from '../../types';

interface UserDashboardProps {
  onNavigateToSeats: () => void;
  onViewPass: (booking: Booking) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onNavigateToSeats,
  onViewPass,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const { userBookings, activeBooking, cancelUserBooking, settings } = useBooking();

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(user?.full_name || '');
  const [editMobile, setEditMobile] = useState<string>(user?.mobile_number || '');
  const [editAge, setEditAge] = useState<string>(user?.age?.toString() || '21');
  const [editGender, setEditGender] = useState<string>(user?.gender || 'Male');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white font-sans">Authentication Required</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-6">
          You must be logged in to view your telemetry pass and manage your study bookings.
        </p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    const res = await updateProfile({
      full_name: editName.trim(),
      mobile_number: editMobile.trim(),
      age: parseInt(editAge, 10) || user.age,
      gender: editGender,
    });

    if (res.success) {
      setSaveStatus('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus(res.error || 'Failed to update profile');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this pending seat reservation?')) {
      await cancelUserBooking(bookingId);
    }
  };

  return (
    <div className="py-10 min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#070714]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500 text-slate-950 font-black text-2xl flex items-center justify-center font-mono shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Student Member
                </span>
                <span className="text-xs text-slate-400 font-mono">@{user.username}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Welcome back, {user.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-mono">
                {settings.library_name} Student Portal • Amba, Bihar
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={onNavigateToSeats}
              className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-bold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book New Desk</span>
            </button>
            <button
              onClick={() => logout()}
              className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-mono font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveStatus && (
          <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Student Profile Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#070714]/80 rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 font-black text-white text-base">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span>My Profile Telemetry</span>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setEditName(user.full_name);
                      setEditMobile(user.mobile_number);
                      setEditAge(user.age?.toString() || '21');
                      setEditGender(user.gender || 'Male');
                      setIsEditingProfile(true);
                    }}
                    className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/50 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs font-mono font-bold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Full Name</span>
                    <span className="font-bold text-white">{user.full_name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Username</span>
                    <span className="font-mono font-semibold text-cyan-400">@{user.username}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Email Address</span>
                    <span className="font-semibold text-slate-300 truncate max-w-[200px]">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Mobile Number</span>
                    <span className="font-mono font-bold text-white">{user.mobile_number || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Gender</span>
                    <span className="font-semibold text-slate-300">{user.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-medium">Age</span>
                    <span className="font-semibold text-slate-300">{user.age || '—'} years</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">Registered Since</span>
                    <span className="font-mono text-slate-400 text-xs">
                      {new Date(user.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Gender</label>
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0a0a1f] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Age</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-500/60"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>

            {/* Library Desk Info Card */}
            <div className="bg-[#070714]/80 text-white rounded-3xl p-6 border border-white/10 shadow-sm space-y-3 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>Vikash Library Help Desk</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need to confirm your cash payment, switch seats, or inquire about lockers? Visit the ground floor reception or call the library desk.
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Reception Phone:</span>
                <span className="font-bold text-cyan-400">{settings.phone}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Seat & Booking History */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Seat Spotlight Card */}
            {activeBooking ? (
              <div className="bg-[#070714]/90 rounded-3xl p-6 sm:p-7 border border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden space-y-5 backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <h3 className="font-black text-white text-base sm:text-lg font-sans">
                      Current Assigned Desk
                    </h3>
                  </div>

                  <span className={`text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-full border ${
                    activeBooking.booking_status === 'confirmed'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  }`}>
                    {activeBooking.booking_status === 'confirmed' ? '✓ Active & Confirmed' : '⏱ Cash Verification Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5 font-mono">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Desk</span>
                    <span className="text-3xl font-black text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                      Seat #{activeBooking.seat_number}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block capitalize font-sans">
                      {activeBooking.floor} Floor
                    </span>
                  </div>

                  <div className="text-center sm:text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Booking ID</span>
                    <span className="font-extrabold text-white text-xs sm:text-sm block">
                      {activeBooking.booking_id}
                    </span>
                    <span className="text-xs text-slate-400 block font-sans">
                      {activeBooking.slot_type || 'Monthly Access'}
                    </span>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Status</span>
                    <span className={`font-black text-sm block ${
                      activeBooking.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {activeBooking.payment_status === 'paid' ? 'PAID (₹' + activeBooking.amount + ')' : 'CASH PENDING (₹' + activeBooking.amount + ')'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => onViewPass(activeBooking)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Digital Pass</span>
                  </button>

                  {activeBooking.booking_status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(activeBooking.id)}
                      className="text-xs font-mono font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-rose-950/40 border border-rose-500/20 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Reservation</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#070714]/80 rounded-3xl p-8 border border-white/10 text-center space-y-4 backdrop-blur-xl">
                <div className="w-14 h-14 bg-cyan-950/70 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white font-sans">
                    No Active Desk Reservation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                    You do not currently have an active study desk. Explore the 130-seat map and reserve your spot today.
                  </p>
                </div>
                <button
                  onClick={onNavigateToSeats}
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-mono font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all cursor-pointer"
                >
                  <span>Select Ground / 1st Floor Seat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Booking History Table */}
            <div className="bg-[#070714]/80 rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-black text-white text-base font-sans">
                  Booking History & Passes
                </h3>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {userBookings.length} Record(s)
                </span>
              </div>

              {userBookings.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">
                            Seat #{b.seat_number}
                          </span>
                          <span className="text-slate-400 capitalize font-sans">({b.floor} Floor)</span>
                          <span className="text-cyan-400">#{b.booking_id}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5 font-sans">
                          {new Date(b.booking_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          • ₹{b.amount} ({b.payment_method})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                          b.booking_status === 'confirmed'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : b.booking_status === 'pending'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}>
                          {b.booking_status}
                        </span>

                        <button
                          onClick={() => onViewPass(b)}
                          className="px-3 py-1 rounded-lg border border-white/10 hover:bg-white/5 text-cyan-400 font-bold text-xs cursor-pointer"
                        >
                          View Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-slate-500 text-center py-6">
                  No previous booking records found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

