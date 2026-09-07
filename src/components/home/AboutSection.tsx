import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles, Clock, Target, Compass, Zap } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const AboutSection: React.FC = () => {
  const { settings, siteContent } = useBooking();

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl bg-[#070714]/90 p-8 text-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-2xl group hover:border-cyan-500/40 transition-all">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Amba’s Premier Self-Study Hub</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  Built For Determined Aspirants & Focused Learners
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Every element of Vikash Library — from high-focus sound-dampened cubicles to continuous 17-hour power backup — is calibrated to maximize your daily study stamina.
                </p>

                <div className="pt-5 border-t border-white/5 grid grid-cols-2 gap-4 font-mono">
                  <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <p className="text-3xl font-black text-cyan-400">130</p>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">Numbered Desks</p>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <p className="text-3xl font-black text-emerald-400">2 Floors</p>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">Ground & 1st Floor</p>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <p className="text-3xl font-black text-amber-400">17 hrs</p>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">6 AM – 11 PM</p>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    <p className="text-3xl font-black text-indigo-400">100%</p>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">Zero Distraction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Hologram Pill */}
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-4.5 flex items-start gap-3.5">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200 italic">
                  "Silence is the soil in which great intellects grow."
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Vikash Library Core Philosophy • Amba, Bihar
                </p>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-cyan-400 font-mono bg-cyan-950/50 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
                About The Library
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
                {siteContent.about_title || 'About Vikash Library'}
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {siteContent.about_paragraphs && siteContent.about_paragraphs.length > 0 ? (
                siteContent.about_paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
              ) : (
                <>
                  <p>
                    Vikash Library was established in Amba on Nabinagar Road with the goal of creating a peaceful, organized, and focused environment where students and competitive exam aspirants can study without interruptions.
                  </p>
                  <p>
                    Whether preparing for Civil Services (UPSC, BPSC), Banking, SSC, Railway, Medical, Engineering, or Academic Board Examinations, students need a designated space that encourages consistent study habits.
                  </p>
                  <p>
                    With 130 dedicated individual seats distributed across Ground Floor (Seats 1–52) and First Floor (Seats 53–130), we offer each learner a reserved personal desk equipped with individual lighting and comfortable seating.
                  </p>
                </>
              )}
            </div>

            {/* Core Values / Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-colors">
                <Target className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Personal Assigned Desks</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your seat is exclusively yours for your registered period.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-colors">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Central Amba Location</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Easily accessible on Nabinagar Road near local transit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

