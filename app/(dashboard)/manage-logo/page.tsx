'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateBuilder } from '@/redux/slices/authSlice';
import { Save, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function ManageLogoPage() {
  const dispatch = useDispatch();
  const { builder } = useSelector((state: RootState) => state.auth);
  const builderId = builder?._id;

  const [form, setForm] = useState({ 
    companyName: '',
    address: '',
    tagline: '', 
    heroSubtitle: '',
    about: '', 
    phone: '', 
    email: '', 
    logo: '',
    heroImage: '',
    yearsActive: '',
    cities: '',
    happyClients: '',
    socialLinks: {}
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`/builder/${builderId}/website`)
      .then(res => {
        const b = res.data.data || {};
        const wd = b.websiteDetails || {};
        setForm({
          companyName: b.companyName || '',
          address: b.address || '',
          tagline: wd.tagline || '',
          heroSubtitle: wd.heroSubtitle || '',
          about: wd.about || '',
          phone: wd.phone || '',
          email: wd.email || '',
          logo: wd.logo || '',
          heroImage: wd.heroImage || '',
          yearsActive: wd.yearsActive || '',
          cities: wd.cities || '',
          happyClients: wd.happyClients || '',
          socialLinks: wd.socialLinks || {}
        });
        if (b.sidebarLogo) {
          setLogoPreview(b.sidebarLogo.startsWith('http') ? b.sidebarLogo : `${process.env.NEXT_PUBLIC_SOCKET_URL || ''}${b.sidebarLogo}`);
        } else {
          setLogoPreview('/logo.png');
        }
      })
      .finally(() => setLoading(false));
  }, [builderId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Please select only JPG or PNG files');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!builderId) return;
    if (!logoFile && !form.logo) {
      toast.error('Please select a logo first');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      if (logoFile) {
        formData.append('sidebarLogo', logoFile);
      }

      const res = await axios.put(`/builder/${builderId}/sidebar-logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedData = res.data.data || {};
      
      dispatch(updateBuilder(updatedData));

      setLogoFile(null);
      toast.success('Logo saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save logo');
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
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ImageIcon size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Add Your Logo</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Upload JPG or PNG</p>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center py-12 space-y-6">
          {logoPreview ? (
            <div className="relative group">
              <img 
                src={logoPreview} 
                alt="Logo Preview" 
                className="h-40 w-40 rounded-2xl object-contain border-2 border-slate-100 p-4 bg-white shadow-inner" 
              />
              <button 
                onClick={() => { setLogoPreview(''); setLogoFile(null); setForm(prev => ({ ...prev, logo: '' })); }} 
                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-rose-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="h-40 w-40 rounded-3xl border-3 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group shadow-sm">
              <input 
                type="file" 
                accept="image/jpeg, image/png" 
                className="hidden" 
                onChange={handleLogoChange} 
              />
              <UploadCloud size={40} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 mt-2 transition-colors">Choose File</span>
            </label>
          )}

          <div className="text-center max-w-xs">
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Selected logo will be displayed at the top of your sidebar.
            </p>
            {logoFile && (
              <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mt-2 inline-block">
                {logoFile.name}
              </p>
            )}
          </div>

          <div className="w-full pt-4 border-t border-slate-50 flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Logo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
