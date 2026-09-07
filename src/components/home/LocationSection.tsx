import React from 'react';
import { MapPin, Phone, Mail, Clock, Shield, Navigation, AlertCircle, Sparkles, Compass } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const LocationSection: React.FC = () => {
  const { settings } = useBooking();

  return (
    <section id="location" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-cyan-400 font-mono bg-cyan-950/50 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            Visit Our Library
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Location & Access Telemetry
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Centrally situated in Amba on Nabinagar Road with convenient transit connectivity for local students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Location Details Card */}
          <div className="lg:col-span-6 bg-[#070714]/80 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
                  <Navigation className="w-4 h-4" />
                  <span>Physical Address Telemetry</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {settings.library_name}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
                  {settings.address}, {settings.landmark && `${settings.landmark}, `}
                  {settings.city}, {settings.state} – {settings.pincode}, India
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Operating Hours</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{settings.opening_hours}</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Open All 7 Days</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1.5">
                    <Phone className="w-4 h-4" />
                    <span>Phone Contact</span>
                  </div>
                  <p className="text-sm font-semibold text-white font-mono">{settings.phone}</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Reception Desk</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
                    <Mail className="w-4 h-4" />
                    <span>Email Inquiries</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{settings.email}</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Support & Queries</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Desk Count</span>
                  </div>
                  <p className="text-sm font-semibold text-white">130 Dedicated Desks</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Ground & 1st Floor</p>
                </div>
              </div>
            </div>

            {/* Note & Admin Edit Badge */}
            <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-cyan-300 font-mono">
                  Administrative Real-Time Sync
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Library hours, contact numbers, and address details can be customized directly by the administrator via the Admin Panel.
                </p>
              </div>
            </div>
          </div>

          {/* Map Representation & Directions Guide */}
          <div className="lg:col-span-6 bg-[#070714]/80 rounded-3xl p-7 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  Interactive Location Hub
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  Amba, Bihar
                </span>
              </div>

              {/* Stylized Cyber Map Card */}
              <div className="relative h-64 rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 text-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
                <div className="relative z-10 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-pulse">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-white">Vikash Library</h4>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Nabinagar Road, Amba, Bihar 824111
                    </p>
                    <p className="text-[11px] text-cyan-400 font-mono mt-1">
                      Ground Floor (1–52) • 1st Floor (53–130)
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-black/80 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                  GPS: Amba, Nabinagar Rd
                </div>
              </div>

              {/* Transit & Landmarks */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">How to Reach:</p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Located directly on the main Nabinagar Road stretch in Amba.</li>
                  <li>Auto-rickshaws and local transport readily available from Amba Bus Stand / Chowk.</li>
                  <li>Safe bicycle and two-wheeler parking available at the premises.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

