import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle, 
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { ApiService } from '../../services/api';
import { LibrarySettings, FAQItem } from '../../types';

interface AdminContentSettingsProps {
  activeSection?: 'settings' | 'content' | 'faqs';
}

export const AdminContentSettings: React.FC<AdminContentSettingsProps> = ({
  activeSection = 'settings',
}) => {
  const { settings, refreshData } = useBooking();
  const [formData, setFormData] = useState<LibrarySettings>(settings);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>(settings.faqs || []);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updated = {
      ...formData,
      faqs,
    };

    const success = await ApiService.updateSettings(updated);
    setIsSaving(false);

    if (success) {
      setFeedback('Library settings and content saved successfully!');
      await refreshData();
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newFaq: FAQItem = {
      id: `faq_${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: 'General',
      order: faqs.length + 1,
    };
    setFaqs([...faqs, newFaq]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
            Configuration Panel
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            {activeSection === 'settings' && 'Library Details & Fee Configuration'}
            {activeSection === 'content' && 'Website Headlines & Copywriting'}
            {activeSection === 'faqs' && 'FAQ Management'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify library details in real-time. Changes immediately reflect on the live website and booking engine.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Settings */}
        {(activeSection === 'settings' || activeSection === 'content') && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-5">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-850 pb-3">
              <Building className="w-4 h-4 text-indigo-400" />
              <span>Core Organization Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Library Name</label>
                <input
                  type="text"
                  value={formData.library_name}
                  onChange={(e) => setFormData({ ...formData, library_name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Monthly Fee (₹)</label>
                <input
                  type="number"
                  value={formData.monthly_fee}
                  onChange={(e) => setFormData({ ...formData, monthly_fee: parseInt(e.target.value, 10) || 800 })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Library Timings</label>
                <input
                  type="text"
                  value={formData.timings}
                  onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Full Physical Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Website Content / Headlines */}
        {(activeSection === 'content' || activeSection === 'settings') && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-850 pb-3">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Website Hero & About Copy</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Hero Section Headline</label>
                <input
                  type="text"
                  value={formData.hero_title}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Hero Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">About Us Section Description</label>
                <textarea
                  rows={3}
                  value={formData.about_text}
                  onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* FAQ Management */}
        {(activeSection === 'faqs' || activeSection === 'content') && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-850 pb-3">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>Frequently Asked Questions ({faqs.length})</span>
            </h3>

            {/* List of current FAQs */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm">{faq.question}</p>
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new FAQ */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-dashed border-slate-700 space-y-3">
              <span className="text-xs font-bold text-amber-300">Add New FAQ</span>
              <input
                type="text"
                placeholder="Question (e.g. Can I bring my own laptop?)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />
              <textarea
                rows={2}
                placeholder="Answer (e.g. Yes, every seat has individual high-speed power charging sockets.)"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFaq}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append FAQ Item</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
