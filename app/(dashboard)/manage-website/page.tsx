'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Save, ExternalLink, Globe, Phone, Mail, FileText, Info } from 'lucide-react';
import axios from '@/lib/axios';

export default function ManageWebsitePage() {
  const { builder } = useSelector((state: RootState) => state.auth);
  const builderId = builder?._id;

  const [form, setForm] = useState({ tagline: '', about: '', phone: '', email: '', logo: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`/builder/${builderId}/website`)
      .then(res => {
        const wd = res.data.data?.websiteDetails || {};
        setForm({
          tagline: wd.tagline || '',
          about: wd.about || '',
          phone: wd.phone || '',
          email: wd.email || '',
          logo: wd.logo || '',
        });
      })
      .finally(() => setLoading(false));
  }, [builderId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!builderId) return;
    setSaving(true);
    try {
      await axios.put(`/builder/${builderId}/website`, form);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-slate-900">Manage Website</h1>
          <p className="text-xs text-slate-400 mt-0.5">Ye details aapke public builder page par dikhegi</p>
        </div>
        <a
          href={`/builder/${builderId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
        >
          <ExternalLink size={13} />
          Preview
        </a>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">

        {/* Logo URL */}
        <div className="p-5 space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Globe size={12} /> Logo URL
          </label>
          <input
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
          {form.logo && (
            <img src={form.logo} alt="logo preview" className="h-12 mt-2 rounded-lg object-contain border border-slate-100 p-1" />
          )}
        </div>

        {/* Tagline */}
        <div className="p-5 space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <FileText size={12} /> Tagline
          </label>
          <input
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="e.g. Building Dreams, Delivering Excellence"
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* About */}
        <div className="p-5 space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Info size={12} /> About Company
          </label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
            placeholder="About company details..."
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
          />
        </div>

        {/* Phone */}
        <div className="p-5 space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Phone size={12} /> Contact Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* Email */}
        <div className="p-5 space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
            <Mail size={12} /> Contact Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contact@yourcompany.com"
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} disabled:opacity-60`}
      >
        <Save size={15} />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
