'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Users, Mail, Shield, Phone, Building, CheckCircle2 } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TeamModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: TeamModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title="Add Team Member">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium uppercase" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="rahul@skylineinfra.com" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Role</label>
              <div className="relative">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium appearance-none outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all uppercase cursor-pointer">
                  <option>Sales Manager</option>
                  <option>Sales Executive</option>
                  <option>Relationship Manager</option>
                  <option>Project Admin</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Site Assignments</label>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-2">
                <Building size={14} /> Assign user to specific projects:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['Skyline Heights', 'Skyline Grand', 'Ocean View Residency', 'Emerald Woods'].map((site, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">{site}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all active:scale-95 uppercase text-[11px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
          >
            <CheckCircle2 size={18} />
            Onboard Member
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
