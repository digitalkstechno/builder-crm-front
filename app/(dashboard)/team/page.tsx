'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  X,
  IndianRupee,
  Star,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Kavya Reddy',
    role: 'Senior Sales Manager',
    email: 'kavya@skylineinfra.com',
    phone: '+91 98765 43210',
    sites: ['Skyline Heights', 'Skyline Grand'],
    performance: 92,
    dealsClosed: 14,
    status: 'online',
    image: null
  },
  {
    id: 2,
    name: 'Nikhil Mehta',
    role: 'Sales Executive',
    email: 'nikhil@skylineinfra.com',
    phone: '+91 98765 43211',
    sites: ['Skyline Heights'],
    performance: 78,
    dealsClosed: 8,
    status: 'offline',
    image: null
  },
  {
    id: 3,
    name: 'Sneha Rao',
    role: 'Relationship Manager',
    email: 'sneha@skylineinfra.com',
    phone: '+91 98765 43212',
    sites: ['Ocean View Residency'],
    performance: 85,
    dealsClosed: 11,
    status: 'online',
    image: null
  },
  {
    id: 4,
    name: 'Rahul Sharma',
    role: 'Sales Lead',
    email: 'rahul@skylineinfra.com',
    phone: '+91 98765 43213',
    sites: ['Skyline Grand', 'Ocean View'],
    performance: 95,
    dealsClosed: 22,
    status: 'away',
    image: null
  }
];

const PerformanceBadge = ({ score }: { score: number }) => {
  const color = score >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                score >= 80 ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
                'text-amber-600 bg-amber-50 border-amber-100';
  
  return (
    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider", color)}>
      <TrendingUp size={12} />
      {score}% Performance
    </div>
  );
};

const MemberCard = ({ member }: { member: typeof TEAM_MEMBERS[0] }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300 shadow-sm">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
            member.status === 'online' ? "bg-emerald-500" :
            member.status === 'away' ? "bg-amber-500" : "bg-slate-300"
          )} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{member.name}</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <Shield size={12} />
            {member.role}
          </p>
        </div>
      </div>
      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
        <MoreVertical size={18} />
      </button>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Mail size={14} className="text-slate-400" />
        {member.email}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Phone size={14} className="text-slate-400" />
        {member.phone}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Building size={14} className="text-slate-400" />
        <div className="flex flex-wrap gap-1">
          {member.sites.map((site, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-600 font-bold">
              {site}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deals Closed</p>
        <p className="text-lg font-bold text-slate-900">{member.dealsClosed}</p>
      </div>
      <PerformanceBadge score={member.performance} />
    </div>

    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
       <ArrowUpRight size={20} className="text-slate-200" />
    </div>
  </motion.div>
);

export default function TeamPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage user roles, site-wise assignments and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all w-72 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-indigo-200"
          >
            <UserPlus size={20} />
            Add Team Member
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Team', value: '18 Members', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Performance', value: '86%', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active Sites', value: '12 Projects', icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Revenue Generated', value: '₹14.2Cr', icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {TEAM_MEMBERS.map(member => (
          <MemberCard key={member.id} member={member} />
        ))}
        
        {/* Add Member Placeholder Card */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-full min-h-[340px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
            <UserPlus size={32} />
          </div>
          <p className="text-lg font-bold text-slate-400 group-hover:text-indigo-600 transition-all">Add New User</p>
          <p className="text-sm text-slate-400 mt-1 text-center">Onboard a new sales executive or manager to your team.</p>
        </button>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Add Team Member</h3>
                  <p className="text-sm text-slate-400 mt-1">Configure roles and site access for your new team member.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                        <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" placeholder="rahul@skylineinfra.com" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Role</label>
                      <div className="relative">
                        <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all">
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
                        <input type="text" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Site Assignments</label>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
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
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Onboard Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
