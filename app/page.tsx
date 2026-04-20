'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Target,
  Zap,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Star,
  X,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import LoginModal from '@/components/LoginModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

const Navbar = ({ onLoginClick, onJoinClick, isAuthenticated, userRole }: {
  onLoginClick: () => void;
  onJoinClick: () => void;
  isAuthenticated?: boolean;
  userRole?: string;
}) => (
  <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
    <nav className="max-w-7xl mx-auto flex items-center justify-between p-2 px-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 shadow-lg shadow-indigo-500/5">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
          BF
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">BuildFlow</span>
      </div>

      <div className="hidden md:flex items-center gap-10" />

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Link
            href={userRole === 'STAFF' ? '/leads' : '/dashboard'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-[0.1em]"
          >
            Go to Dashboard
          </Link>
        ) : (
          <>
            <button
              onClick={onLoginClick}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 px-6 py-2.5 transition-colors uppercase tracking-[0.1em]"
            >
              Sign In
            </button>
            <button
              onClick={onJoinClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-slate-900/10 uppercase tracking-[0.1em]"
            >
              Join Now
            </button>
          </>
        )}
      </div>
    </nav>
  </header>
);

const JoinModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [form, setForm] = useState({ name: '', phone: '', companyName: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.companyName.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/admin-leads', form);
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setSubmitted(false); setForm({ name: '', phone: '', companyName: '' }); }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10"
          >
            <button onClick={handleClose} className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">We'll be in touch!</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Thanks for your interest. Our team will contact you shortly to get you started with BuildFlow.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 mb-4">
                    BF
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">Get Started with BuildFlow</h3>
                  <p className="text-slate-500 text-sm mt-1">Fill in your details and our team will reach out to you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Company Name</label>
                    <input
                      type="text"
                      placeholder="Skyline Builders Pvt. Ltd."
                      value={form.companyName}
                      onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {loading ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
  >
    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110', color)}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-snug">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const LayoutDashboard = ({ size, className, strokeWidth }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

export default function LandingPage() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onJoinClick={() => setIsJoinOpen(true)}
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
      />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[1000px] h-[1000px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -z-10" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8 shadow-sm">
                  <Star size={14} className="fill-indigo-600" />
                  Trusted by 500+ Real Estate Builders
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8">
                  The <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Powerhouse CRM</span> for Modern Builders
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-12">
                  Streamline lead capturing, automate WhatsApp follow-ups, and visualize your entire property pipeline in one intelligent dashboard. Designed specifically for the Indian real estate landscape.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => setIsJoinOpen(true)}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 group text-lg"
                  >
                    Get Started Today
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold transition-all text-lg">
                    Book a Demo
                  </button>
                </div>
                <div className="mt-12 flex items-center gap-8 grayscale opacity-50">
                  <Building2 size={32} />
                  <Target size={32} />
                  <Zap size={32} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl blur-[100px] opacity-20 -z-10 scale-90" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/WhatsApp-Automation-1.png"
                    alt="WhatsApp Automation"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Core Ecosystem</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">Everything you need to sell property faster</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={Users} title="Lead Centralization" description="Import leads automatically from WhatsApp, Facebook, Websites, and Portals like MagicBricks or Housing.com." color="bg-indigo-600" />
              <FeatureCard icon={MessageSquare} title="Automated WhatsApp" description="Send instant welcome messages and personalized follow-ups without lifting a finger. Built-in WhatsApp API." color="bg-emerald-600" />
              <FeatureCard icon={Target} title="Sales Pipeline" description="Visual kanban board to track deals from inquiry to registration. Never lose track of high-intent prospects." color="bg-amber-500" />
              <FeatureCard icon={Building2} title="Inventory Tracking" description="Real-time availability of units across all your projects. Sync site engineers with sales teams instantly." color="bg-purple-600" />
              <FeatureCard icon={BarChart3} title="Advanced Analytics" description="Detailed reports on agent performance, site visit conversions, and marketing ROI at your fingertips." color="bg-blue-600" />
              <FeatureCard icon={ShieldCheck} title="Enterprise Security" description="Role-based access controls and encrypted data storage. Your precious leads are always protected." color="bg-slate-900" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/30" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to transform your real estate business?
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Join hundreds of builders who are already closing more deals with BuildFlow.
            </p>
            <button
              onClick={() => setIsJoinOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-900/50 inline-flex items-center gap-3 group"
            >
              Get Started Now
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-16 px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
                BF
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">BuildFlow</span>
            </div>
            <p className="text-slate-400 text-sm mb-12 text-center max-w-md leading-relaxed">
              Leading the digital transformation of Indian Real Estate with cutting-edge CRM technology. Designed and built with ❤️ in India.
            </p>
            <div className="flex gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest mb-12">
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Security</a>
              <a href="#" className="hover:text-indigo-600">Contact</a>
            </div>
            <div className="text-slate-300 text-[10px] font-bold tracking-widest uppercase">
              &copy; 2026 BuildFlow CRM. All rights reserved.
            </div>
          </div>
        </footer>
      </main>

      <JoinModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
