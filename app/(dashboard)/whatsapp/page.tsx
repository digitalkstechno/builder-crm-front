'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  QrCode, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  RefreshCcw,
  Power,
  MessageCircle,
  Bot,
  ArrowRight,
  Clock,
  History,
  PlayCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WhatsAppPage() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">WhatsApp Automation</h1>
          <p className="text-slate-500 font-medium mt-1">Connect your WhatsApp to automate lead replies and follow-ups.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2",
            status === 'connected' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
            status === 'disconnected' ? "bg-rose-50 text-rose-600 border border-rose-100" :
            "bg-amber-50 text-amber-600 border border-amber-100"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              status === 'connected' ? "bg-emerald-500 animate-pulse" :
              status === 'disconnected' ? "bg-rose-500" : "bg-amber-500 animate-bounce"
            )} />
            {status}
          </span>
          <button 
            onClick={() => setStatus('connecting')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-xl shadow-slate-200"
          >
            <RefreshCcw size={18} />
            Reconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Connection Status & QR */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-6">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Scan to Connect</h3>
            <p className="text-sm text-slate-500 mt-2 mb-8 max-w-[280px]">
              Open WhatsApp on your phone, go to Settings &gt; Linked Devices &gt; Link a Device.
            </p>
            
            <div className="relative p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8 group">
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-indigo-300 transition-all overflow-hidden relative">
                <QrCode size={120} className="text-slate-200 group-hover:text-indigo-100 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                   <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
                     Generate QR
                   </button>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              {[
                { label: 'Auto-Reply', icon: Zap, active: true },
                { label: 'Lead Capture', icon: Bot, active: true },
                { label: 'Smart Filtering', icon: ShieldCheck, active: false },
              ].map((feature, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <feature.icon size={18} className={feature.active ? "text-indigo-600" : "text-slate-400"} />
                    <span className={cn("text-sm font-bold", feature.active ? "text-slate-900" : "text-slate-400")}>{feature.label}</span>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-all cursor-pointer",
                    feature.active ? "bg-indigo-600" : "bg-slate-200"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      feature.active ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Automation Settings & History */}
        <div className="lg:col-span-7 space-y-8">
          {/* Bot Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Settings2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Bot Logic</h3>
                  <p className="text-xs text-slate-400 font-medium">Configure how the bot interacts with new leads.</p>
                </div>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline">Manage Flows</button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Welcome Message</label>
                <textarea 
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium min-h-[120px]"
                  placeholder="Hello! Thanks for reaching out to Skyline Infra. How can we help you today?"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Response Delay</label>
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold appearance-none">
                    <option>Instant</option>
                    <option>5-10 Seconds</option>
                    <option>30 Seconds</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Working Hours</label>
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold appearance-none">
                    <option>24/7 Always On</option>
                    <option>Office Hours (9AM-6PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <History size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                  <p className="text-xs text-slate-400 font-medium">Tracking automated conversations.</p>
                </div>
              </div>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                <PlayCircle size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { user: 'Rahul Sharma', msg: 'Requested brochure for Skyline Heights', time: '2 mins ago', type: 'Lead Captured' },
                { user: 'Priya Patel', msg: 'Asked about pricing in Worli', time: '15 mins ago', type: 'Replied' },
                { user: 'Amit Kumar', msg: 'Site visit scheduled via bot', time: '1 hour ago', type: 'Conversion' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                      <p className="text-xs text-slate-400 font-medium">{activity.msg}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">{activity.type}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              View All Logs
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
