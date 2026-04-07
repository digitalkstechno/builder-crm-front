'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  Database, 
  Globe, 
  MessageSquare, 
  Server,
  TrendingUp,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusModal from '@/components/modals/StatusModal';

const SYSTEM_STATUS = [
  { name: 'Core API Server', status: 'operational', uptime: '99.98%', latency: '42ms', icon: Server },
  { name: 'Real-time Database', status: 'operational', uptime: '100%', latency: '12ms', icon: Database },
  { name: 'WhatsApp Bot Node', status: 'warning', uptime: '98.5%', latency: '156ms', icon: MessageSquare },
  { name: 'Storage Cluster', status: 'operational', uptime: '99.99%', latency: '24ms', icon: Globe },
];

const METRICS = [
  { label: 'System Load', value: '24%', trend: '-4%', status: 'optimal' },
  { label: 'Memory Usage', value: '3.2GB', trend: '+2%', status: 'optimal' },
  { label: 'Active Webhooks', value: '1,240', trend: '+12%', status: 'high' },
  { label: 'Error Rate', value: '0.02%', trend: '-0.01%', status: 'optimal' },
];

const StatusBadge = ({ status }: { status: string }) => (
  <span className={cn(
    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
    status === 'operational' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
    status === 'warning' ? "bg-amber-50 text-amber-600 border border-amber-100" :
    "bg-rose-50 text-rose-600 border border-rose-100"
  )}>
    <div className={cn(
      "w-1.5 h-1.5 rounded-full",
      status === 'operational' ? "bg-emerald-500 animate-pulse" :
      status === 'warning' ? "bg-amber-500 animate-bounce" : "bg-rose-500"
    )} />
    {status}
  </span>
);

export default function StatusPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Activity size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-nowrap">System Status</h1>
          </div>
          <p className="text-slate-500 font-medium">Real-time health monitoring and infrastructure performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw size={18} />
            Refresh Data
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Zap size={18} />
            Run Diagnostics
          </button>
        </div>
      </div>

      <StatusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          // logic here
        }}
      />

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* System Health */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" size={24} />
                <h3 className="text-lg font-bold text-slate-900">Infrastructure Health</h3>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Status: Operational</span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {SYSTEM_STATUS.map((sys, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
                      <sys.icon size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{sys.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} /> {sys.uptime} Uptime
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Zap size={10} /> {sys.latency} Latency
                        </p>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={sys.status} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {METRICS.map((metric, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-lg",
                    metric.trend.startsWith('+') ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {metric.trend}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">{metric.value}</p>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Side Panels */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Events */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">Incidents & Events</h3>
            <div className="space-y-6">
              {[
                { time: '14:20', event: 'WhatsApp API Latency Spike', type: 'warning' },
                { time: '09:45', event: 'Weekly System Backup Completed', type: 'success' },
                { time: 'Yesterday', event: 'Storage Capacity Expanded', type: 'success' },
                { time: '2 Days ago', event: 'Minor Database Connection Error', type: 'error' },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      ev.type === 'warning' ? "bg-amber-500" :
                      ev.type === 'success' ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <div className="w-[1px] h-full bg-slate-100 group-last:hidden" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{ev.event}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
              View History
              <ArrowUpRight size={16} />
            </button>
          </motion.div>

          {/* System Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">BuildFlow v2.4.0</h4>
              <p className="text-indigo-100 text-xs font-medium mb-6">Your infrastructure is protected by Enterprise Shield security.</p>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-200">
                  <span>Server Node</span>
                  <span>AWS-Mumbai-1</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-indigo-200">
                  <span>SSL Expiry</span>
                  <span>240 Days left</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
