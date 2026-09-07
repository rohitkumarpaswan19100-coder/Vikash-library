import React, { useState } from 'react';
import { 
  Armchair, 
  Check, 
  Lock, 
  Ban, 
  Clock, 
  Search, 
  User, 
  Calendar, 
  ShieldCheck, 
  AlertCircle,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { ApiService } from '../../services/api';
import { Seat, FloorType } from '../../types';

export const AdminSeatManagement: React.FC = () => {
  const { seats, groundFloorSeats, firstFloorSeats, refreshData } = useBooking();
  const [activeFloor, setActiveFloor] = useState<FloorType>('ground');
  const [searchNumber, setSearchNumber] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const displayedSeats = activeFloor === 'ground' ? groundFloorSeats : firstFloorSeats;

  const filteredSeats = displayedSeats.filter((s) => {
    if (!searchNumber) return true;
    return s.seat_number.toString().includes(searchNumber);
  });

  const handleUpdateStatus = async (newStatus: Seat['status']) => {
    if (!selectedSeat) return;
    setIsUpdating(true);

    const bookingId = newStatus === 'available' ? null : selectedSeat.current_booking_id;
    const userName = newStatus === 'available' ? null : selectedSeat.current_user_name;

    await ApiService.updateSeatStatus(selectedSeat.seat_number, newStatus, bookingId, userName);
    await refreshData();
    setIsUpdating(false);
    setSelectedSeat(null);
    setFeedback(`Seat #${selectedSeat.seat_number} status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
            Floor Management
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Seat Master Directory (130 Seats)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage real-time status, occupant assignments, and maintenance blocks across floors.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveFloor('ground')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeFloor === 'ground'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ground Floor (1–52)
          </button>
          <button
            onClick={() => setActiveFloor('first')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeFloor === 'first'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            First Floor (53–130)
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Quick Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="number"
            placeholder="Search seat number (e.g. 25)..."
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {displayedSeats.filter((s) => s.status === 'available').length} Free
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {displayedSeats.filter((s) => s.status === 'booked').length} Booked
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {displayedSeats.filter((s) => s.status === 'pending').length} Pending
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            {displayedSeats.filter((s) => s.status === 'blocked').length} Blocked
          </span>
        </div>
      </div>

      {/* Seats Interactive Visual Grid */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2.5">
          {filteredSeats.map((seat) => {
            const isSelected = selectedSeat?.seat_number === seat.seat_number;
            return (
              <button
                key={seat.id}
                onClick={() => setSelectedSeat(seat)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-400/20'
                    : seat.status === 'available'
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:border-emerald-500'
                    : seat.status === 'booked'
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:border-rose-500'
                    : seat.status === 'pending'
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-300 hover:border-amber-500'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-[9px] uppercase font-bold opacity-60">SEAT</span>
                <span className="text-base font-black text-white">{seat.seat_number}</span>
                <span className="text-[9px] font-bold uppercase mt-0.5">
                  {seat.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Seat Inspector Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg">
                  #{selectedSeat.seat_number}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    Seat #{selectedSeat.seat_number} Inspector
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {selectedSeat.floor} Floor • {selectedSeat.section || 'General Section'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeat(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-extrabold capitalize text-amber-300">
                  {selectedSeat.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Occupant:</span>
                <span className="font-semibold text-white">
                  {selectedSeat.current_user_name || 'No active student'}
                </span>
              </div>
              {selectedSeat.current_booking_id && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono text-slate-300">
                    {selectedSeat.current_booking_id}
                  </span>
                </div>
              )}
            </div>

            {/* Status Change Controls */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Change Status Override
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('available')}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-2 rounded-xl"
                >
                  Set Available
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('blocked')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-xl"
                >
                  Block (Maint.)
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('booked')}
                  className="bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl"
                >
                  Mark Booked
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedSeat(null)}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
