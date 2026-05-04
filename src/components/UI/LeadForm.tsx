'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BIKES } from '@/lib/bikeData';

const DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi',
  'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj',
  'Gazipur', 'Tangail', 'Faridpur', 'Jessore (Jashore)', 'Bogura',
  'Dinajpur', 'Noakhali', 'Cox\'s Bazar', 'Narsingdi', 'Other',
];

const TIMELINES = [
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  'Not sure yet',
];

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  bikeName: string;
}

interface FormState {
  name: string;
  phone: string;
  district: string;
  preferredModel: string;
  preferredDealer: string;
  purchaseTimeline: string;
  consent: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  district: '',
  preferredModel: '',
  preferredDealer: '',
  purchaseTimeline: '',
  consent: false,
};

export default function LeadForm({ isOpen, onClose, bikeName }: LeadFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, preferredModel: bikeName });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { track } = useAnalytics();

  const set = (key: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = () => {
    if (!submitted) track('form_abandon');
    onClose();
    // Reset after animation out
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setForm({ ...EMPTY_FORM, preferredModel: bikeName });
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setError('Please accept the consent checkbox to proceed.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      track('form_submit', { model: form.preferredModel });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-[#005BAC] transition-colors text-sm';
  const labelCls = 'text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1 mb-1 block';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full sm:max-w-lg bg-neutral-950 sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[92dvh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#005BAC] p-6 flex-shrink-0">
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
              <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">Book an Interest</p>
              <h2 className="text-xl font-bold text-white mt-1">Yamaha {bikeName}</h2>
              <p className="text-white/60 text-xs mt-1">
                Our team will contact you with the best Eid offer.
              </p>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className={labelCls}>Mobile Number <span className="text-red-400">*</span></label>
                    <input
                      required
                      type="tel"
                      placeholder="+880 1XXX XXXXXX"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className={labelCls}>District / City <span className="text-red-400">*</span></label>
                    <select
                      required
                      value={form.district}
                      onChange={(e) => set('district', e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="" className="bg-neutral-900">Select district</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d} className="bg-neutral-900">{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Model */}
                  <div>
                    <label className={labelCls}>Preferred Model <span className="text-red-400">*</span></label>
                    <select
                      required
                      value={form.preferredModel}
                      onChange={(e) => set('preferredModel', e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="" className="bg-neutral-900">Select model</option>
                      {BIKES.map((b) => (
                        <option key={b.id} value={b.name} className="bg-neutral-900">
                          {b.name} — {b.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Dealer (optional) */}
                  <div>
                    <label className={labelCls}>Preferred Dealer <span className="text-neutral-700">(optional)</span></label>
                    <input
                      type="text"
                      placeholder="Dealer name or area"
                      value={form.preferredDealer}
                      onChange={(e) => set('preferredDealer', e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  {/* Purchase Timeline (optional) */}
                  <div>
                    <label className={labelCls}>Purchase Timeline <span className="text-neutral-700">(optional)</span></label>
                    <select
                      value={form.purchaseTimeline}
                      onChange={(e) => set('purchaseTimeline', e.target.value)}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="" className="bg-neutral-900">When are you planning to buy?</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t} className="bg-neutral-900">{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Consent */}
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <div
                      onClick={() => set('consent', !form.consent)}
                      className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                        form.consent
                          ? 'bg-[#005BAC] border-[#005BAC]'
                          : 'bg-transparent border-white/20 hover:border-white/40'
                      }`}
                    >
                      {form.consent && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-neutral-500 text-xs leading-relaxed">
                      I agree to Yamaha Bangladesh's{' '}
                      <span className="text-[#005BAC]">Privacy Policy</span> and consent to
                      being contacted regarding my interest in Yamaha motorcycles.{' '}
                      <span className="text-red-400">*</span>
                    </span>
                  </label>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005BAC] text-white py-4 rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#0070d6] disabled:opacity-50 transition-all shadow-lg shadow-[#005BAC]/20 uppercase mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Interest
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                  <p className="text-neutral-400 mt-3 max-w-[300px] text-sm leading-relaxed">
                    Thank you for your interest. The Yamaha team will contact you soon.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 text-[#005BAC] font-bold uppercase tracking-widest text-xs hover:underline"
                  >
                    Back to Showroom
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
