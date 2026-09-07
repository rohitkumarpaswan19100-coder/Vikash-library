import React from 'react';
import { 
  Armchair, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CreditCard, 
  MapPin, 
  CheckCircle, 
  Zap,
  LucideIcon
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const iconMap: Record<string, LucideIcon> = {
  Armchair,
  ShieldCheck,
  Sparkles,
  Clock,
  CreditCard,
  MapPin,
  CheckCircle,
};

export const WhyChooseUs: React.FC = () => {
  const { siteContent } = useBooking();

  const items = siteContent.why_choose_us && siteContent.why_choose_us.length > 0
    ? siteContent.why_choose_us
    : [
        {
          id: 'w-1',
          title: 'Dedicated Study Seats',
          description: '130 numbered personal study cubicles so your study spot is uniquely reserved for your daily routine.',
          icon_name: 'Armchair',
        },
        {
          id: 'w-2',
          title: 'Peaceful Environment',
          description: 'Strict silence and disciplined ambiance that guarantees zero distractions during your study sessions.',
          icon_name: 'ShieldCheck',
        },
        {
          id: 'w-3',
          title: 'Easy Seat Booking',
          description: 'Real-time interactive seat map to pick your exact desk on Ground or First floor in seconds.',
          icon_name: 'Sparkles',
        },
        {
          id: 'w-4',
          title: 'Organized Seating',
          description: 'Clearly partitioned rows across Ground Floor (1-52) and First Floor (53-130) for seamless navigation.',
          icon_name: 'CheckCircle',
        },
        {
          id: 'w-5',
          title: 'Flexible Booking Management',
          description: 'Reserve online and pay conveniently at the library reception with manual cash confirmation support.',
          icon_name: 'CreditCard',
        },
        {
          id: 'w-6',
          title: 'Student-Friendly Environment',
          description: 'Centrally situated on Nabinagar Road, Amba, Bihar with safe, well-lit, and comfortable study facilities.',
          icon_name: 'MapPin',
        },
      ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-cyan-400 font-mono bg-cyan-950/50 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Calibrated For High-Stamina Study
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Discover why students and competitive exam aspirants across Amba rely on Vikash Library for their daily academic routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const IconComponent = iconMap[item.icon_name] || CheckCircle;
            return (
              <div
                key={item.id || index}
                className="bg-[#070714]/80 rounded-3xl p-7 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-teal-400 group-hover:text-slate-950 transition-all duration-300 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono font-semibold text-slate-500">
                  <span>SPEC #{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                    Vikash Core
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

