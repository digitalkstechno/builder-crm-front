'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Clock,
  Phone,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

const FUNNEL_COLORS = [
  'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const MetricCard = ({ label, value, sub, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      <div className={cn('p-1.5 rounded-lg shadow-sm', color)}>
        <Icon size={14} className="text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-semibold text-slate-900 tracking-tight leading-none">{value}</span>
      {sub && (
        <div className={cn('flex items-center gap-1 mt-1 text-[10px] font-medium',
          trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
        )}>
          {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
          {sub}
        </div>
      )}
    </div>
  </div>
);

export default function DashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/lead/dashboard-stats');
      setStats(res.data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const planExpiry = stats?.planExpiry;
  const daysLeft = planExpiry?.daysLeft ?? null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* Plan Expiry Banner */}
      {/* {planExpiry && !planExpiry.isExpired && daysLeft <= 30 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium',
            daysLeft <= 7
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          )}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>
              <span className="font-bold">{planExpiry.planName}</span> plan expires in{' '}
              <span className="font-bold">{daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
              {' '}— on {new Date(planExpiry.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <button
            onClick={() => router.push('/subscriptions')}
            className={cn(
              'text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors',
              daysLeft <= 7
                ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
                : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
            )}
          >
            Renew Now
          </button>
        </motion.div>
      )} */}

      {planExpiry?.isExpired && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl border bg-rose-50 border-rose-300 text-rose-700"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle size={16} />
            <span>Your <span className="font-bold">{planExpiry.planName}</span> plan has expired. Please renew to continue.</span>
          </div>
          <button
            onClick={() => router.push('/subscriptions')}
            className="text-[11px] font-bold px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Renew Now
          </button>
        </motion.div>
      )}

      {/* Plan Expiry Countdown Card (always visible) */}
      {planExpiry && (
        <div className={cn(
          'flex items-center gap-4 px-4 py-3 rounded-xl border',
          planExpiry.isExpired
            ? 'bg-rose-50 border-rose-100'
            : daysLeft <= 7
              ? 'bg-rose-50 border-rose-100'
              : daysLeft <= 30
                ? 'bg-amber-50 border-amber-100'
                : 'bg-emerald-50 border-emerald-100'
        )}>
          <div className={cn(
            'p-2 rounded-lg',
            planExpiry.isExpired ? 'bg-rose-100' : daysLeft <= 7 ? 'bg-rose-100' : daysLeft <= 30 ? 'bg-amber-100' : 'bg-emerald-100'
          )}>
            <Calendar size={18} className={cn(
              planExpiry.isExpired ? 'text-rose-600' : daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-emerald-600'
            )} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Plan</p>
            <p className="text-sm font-bold text-slate-800">{planExpiry.planName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {planExpiry.isExpired ? 'Expired' : 'Expires in'}
            </p>
            <p className={cn(
              'text-2xl font-black leading-none',
              planExpiry.isExpired ? 'text-rose-600' : daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {planExpiry.isExpired ? '0' : daysLeft}
              <span className="text-xs font-semibold ml-1">{planExpiry.isExpired ? 'days ago' : 'days'}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {new Date(planExpiry.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-pulse h-24" />
          ))
        ) : (
          <>
            <MetricCard
              label="Total Leads"
              value={stats?.totalLeads ?? '—'}
              sub={stats?.thisWeekLeads != null ? `${stats.weekChange >= 0 ? '+' : ''}${stats.weekChange}% vs last week` : undefined}
              trend={stats?.weekChange >= 0 ? 'up' : 'down'}
              icon={Users}
              color="bg-indigo-500"
            />
            <MetricCard
              label="This Week"
              value={stats?.thisWeekLeads ?? '—'}
              sub="New leads this week"
              trend="up"
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <MetricCard
              label="Today's Follow-ups"
              value={stats?.todayFollowups?.length ?? '—'}
              sub="Scheduled for today"
              trend="neutral"
              icon={Clock}
              color="bg-amber-500"
            />
            <MetricCard
              label="Lead Stages"
              value={stats?.funnel?.length ?? '—'}
              sub="Active pipeline stages"
              trend="neutral"
              icon={CheckCircle2}
              color="bg-indigo-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Follow-ups */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Today&apos;s Follow-ups</h3>
            <div className="flex items-center gap-2">
              <button onClick={fetchStats} className="text-slate-400 hover:text-indigo-600 transition-colors">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => router.push('/reminders')} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">View All</button>
            </div>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.todayFollowups?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <CheckCircle2 size={32} className="mb-2 text-slate-200" />
              <p className="text-xs font-medium">No follow-ups scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {(stats?.todayFollowups || []).map((item: any, i: number) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[10px] border border-slate-200">
                      {item.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.phone && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone size={9} /> {item.phone}
                          </span>
                        )}
                        {item.site && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Building2 size={9} /> {item.site}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold text-slate-900">{item.time}</p>
                    {item.budget && (
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
                        {item.budget}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Funnel */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-4">Lead Funnel</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          ) : stats?.funnel?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <MapPin size={28} className="mb-2 text-slate-200" />
              <p className="text-xs font-medium">No lead data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.funnel || []).map((stage: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span className="truncate max-w-[120px]">{stage.label}</span>
                    <span>{stage.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={cn('h-full rounded-full shadow-sm', FUNNEL_COLORS[i % FUNNEL_COLORS.length])}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
