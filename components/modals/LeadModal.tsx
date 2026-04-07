'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { User, Phone, Building, Target, IndianRupee, Users } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LeadModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: LeadModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6 uppercase font-black tracking-tight">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all uppercase" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                maxLength={10}
                placeholder="e.g. 9876543210" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all tracking-[0.1em]" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 uppercase font-black tracking-tight">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Site / Project</label>
            <div className="relative">
              <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none uppercase cursor-pointer">
                <option>Skyline Heights</option>
                <option>Skyline Grand</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Source</label>
            <div className="relative">
              <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none uppercase cursor-pointer">
                <option>WhatsApp</option>
                <option>Facebook</option>
                <option>Website</option>
                <option>Walk-in</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 uppercase font-black tracking-tight">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Budget Range</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="e.g. ₹80L - ₹1Cr" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all uppercase" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Agent</label>
            <div className="relative">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all appearance-none uppercase cursor-pointer">
                <option>Auto Assign (Round Robin)</option>
                <option>Kavya Reddy</option>
                <option>Nikhil Mehta</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[2] px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            Create Lead
          </button>
        </div>
      </form>
    </CommonDialog>
  );
}
