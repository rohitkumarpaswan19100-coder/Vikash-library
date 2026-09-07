import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { useBooking } from '../../context/BookingContext';
import { Profile } from '../../types';

export const AdminUserManagement: React.FC = () => {
  const { allBookings } = useBooking();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      const data = await ApiService.getProfiles();
      setProfiles(data);
    };
    loadProfiles();
  }, []);

  const filtered = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.mobile_number.includes(q)
    );
  });

  const getUserBookingsCount = (userId: string) => {
    return allBookings.filter((b) => b.user_id === userId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
            Student & Staff Directory
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Registered Users ({profiles.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View student profiles, mobile contact numbers, and total bookings.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const bookingCount = getUserBookingsCount(p.id);
          const isAdmin = p.role === 'admin';

          return (
            <div
              key={p.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base shadow-sm ${
                    isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-indigo-900 text-indigo-200'
                  }`}>
                    {p.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-white">{p.full_name}</h4>
                      {isAdmin && (
                        <span className="text-[10px] uppercase font-bold bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">@{p.username}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  {bookingCount} Booking(s)
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-850 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-200">{p.mobile_number || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate text-slate-300">{p.email}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Age: {p.age} • {p.gender}</span>
                  <span>
                    Joined{' '}
                    {new Date(p.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
