"use client";

import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Correction / Feedback',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate feedback submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Contact Our Editorial Team
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-base">
          Have an inquiry, discovered an erratum in a published notification, or seeking assistance? Reach out to our Guwahati desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Info Columns */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Official Email</h3>
            <p className="text-xs text-slate-500 mb-2">For general support and erratum reports:</p>
            <a href="mailto:contact@assamjobshub.com" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              contact@assamjobshub.com
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Headquarters</h3>
            <p className="text-xs text-slate-500 mb-2">Operating location:</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Guwahati, Kamrup Metropolitan<br />Assam – 781001, India
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Response SLA</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We typically review and respond to legitimate inquiries within <strong>24–48 hours</strong>.
            </p>
          </div>

        </div>

        {/* Right Interactive Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-emerald-500" />
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Received!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Thank you for contacting AssamJobsHub. Our editorial team will review your message and reply via email within 24–48 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', category: 'Correction / Feedback', subject: '', message: '' }); }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 outline-none transition text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 outline-none transition text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 outline-none transition text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Correction / Feedback">Correction / Erratum Report</option>
                      <option value="General Query">General Recruitment Query</option>
                      <option value="Copyright / Notice">Copyright / Organization Notice</option>
                      <option value="Partnership">Partnership / Advertising Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Subject *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief subject of inquiry"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 outline-none transition text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Your Message *</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide detailed description of your query or the specific URL that requires attention..."
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-emerald-500 outline-none transition text-slate-900 dark:text-white resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? "Sending..." : (
                      <>
                        <Send size={16} /> Send Message
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
