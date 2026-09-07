import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const FAQSection: React.FC = () => {
  const { faqs } = useBooking();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || 'faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'General', 'Booking', 'Payment', 'Rules'];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-cyan-400 font-mono bg-cyan-950/50 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Everything you need to know about reserving desks, monthly fees, cash verification, and library discipline.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-cyan-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. cash, booking, hours)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#070714]/80 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 shadow-inner backdrop-blur-xl transition-all"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-[#070714]/80 rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-xl ${
                    isOpen ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 transition-colors focus:outline-hidden cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-white text-sm sm:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                      <div className="mt-4 pt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400 border-t border-white/5">
                        <span className="bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-medium">
                          Category: {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-[#070714]/80 rounded-2xl p-8 text-center text-slate-400 border border-white/10 backdrop-blur-xl">
              <p className="text-sm font-semibold">No questions found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs font-mono font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Note about admin editable FAQs */}
        <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>All FAQ telemetry items can be configured in real-time directly from the Admin Panel.</span>
        </div>
      </div>
    </section>
  );
};

