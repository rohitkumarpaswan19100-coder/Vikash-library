import React from 'react';
import { UserPlus, LayoutGrid, CreditCard, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface HowItWorksProps {
  onBookSeatClick: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBookSeatClick, openAuthModal }) => {
  const steps = [
    {
      step: '01',
      title: 'Create Account',
      description: 'Register in 30 seconds with your name, mobile number, age, gender, and secure password.',
      icon: UserPlus,
      color: 'from-cyan-500 to-blue-600',
      action: () => openAuthModal('register'),
      actionLabel: 'Sign Up',
    },
    {
      step: '02',
      title: 'Select Your Desk',
      description: 'Explore the live interactive telemetry map. Pick Ground Floor (1–52) or First Floor (53–130).',
      icon: LayoutGrid,
      color: 'from-blue-600 to-indigo-600',
      action: onBookSeatClick,
      actionLabel: 'Open Seat Map',
    },
    {
      step: '03',
      title: 'Choose Payment Mode',
      description: 'Select "Cash Payment" for instant reservation or prepare for digital online confirmation.',
      icon: CreditCard,
      color: 'from-indigo-600 to-teal-500',
      action: onBookSeatClick,
      actionLabel: 'View Pricing',
    },
    {
      step: '04',
      title: 'Desk Pass Confirmed',
      description: 'Get your digital booking ID pass. Visit reception to confirm cash or start studying immediately!',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
      action: onBookSeatClick,
      actionLabel: 'Book Now',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-cyan-400 font-mono bg-cyan-950/50 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            Simple 4-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            How Desk Booking Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Reserve your personal study desk in minutes with real-time availability and transparent cash verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#070714]/80 rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 backdrop-blur-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-white/20 font-mono group-hover:text-cyan-400/40 transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

