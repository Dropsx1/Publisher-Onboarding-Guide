import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
  initialMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialSubject,
  initialMessage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject || 'Integration & Gate Setup');
  const [message, setMessage] = useState(initialMessage || '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialSubject) setSubject(initialSubject);
      if (initialMessage) setMessage(initialMessage);
      setSubmitted(false);
    }
  }, [isOpen, initialSubject, initialMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Contact Linktain Publisher Desk</h3>
              <p className="text-[11px] text-slate-400">Direct assistance from Andrew@linktain.com</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Inquiry Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you, <span className="text-white font-semibold">{name || 'Creator'}</span>. Your inquiry has been routed to Andrew and the Linktain publisher team. We typically respond within 12 business hours.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Name or Channel</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex (Apex Gaming)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Integration & Gate Setup">Integration & Gate Setup</option>
                  <option value="VIP High-Volume Traffic Tier">VIP High-Volume Traffic Tier (100k+ clicks)</option>
                  <option value="Custom Creator Pass Pricing">Custom Creator Pass Pricing</option>
                  <option value="Payout & Bank Wire Verification">Payout & Bank Wire Verification</option>
                  <option value="Other Question">Other Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message / Question</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your traffic source, content niche, or specific questions..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
