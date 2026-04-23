'use client';

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  History, 
  ArrowRight,
  ShieldCheck,
  ZapIcon,
  Package,
  Loader2,
  Users2,
  Home,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchPlans } from '@/redux/slices/planSlice';
import { updateBuilder } from '@/redux/slices/authSlice';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import CommonTable from '@/components/ui/CommonTable';

export default function SubscriptionsPage() {
  const dispatch = useDispatch<any>();
  const { builder, user } = useSelector((state: RootState) => state.auth);
  const { plans, loading: plansLoading } = useSelector((state: RootState) => state.plan);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'plans'>('current');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchPlans());
    fetchLatestBuilder();
  }, [dispatch]);

  const fetchLatestBuilder = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/builder/profile/${user._id}`);
      if (res.data.success) {
        dispatch(updateBuilder(res.data.data.builder));
      }
    } catch (err) {
      console.error("Failed to refresh builder data", err);
    }
  };

  const handleRenew = async (plan: any) => {
    if (!builder?._id) return;
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await axios.post('/builder/create-order', {
        amount: plan.price,
        planId: plan._id,
        phone: user.phone
      });

      if (!orderRes.data.success) throw new Error(orderRes.data.message);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: "builderscrm.in",
        description: `Renewal for ${plan.planName} Plan`,
        order_id: orderRes.data.order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post('/builder/renew-subscription', {
              builderId: builder._id,
              planId: plan._id,
              amountPaid: plan.price,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              toast.success("Subscription Renewed Successfully!");
              fetchLatestBuilder();
              setActiveTab('current');
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification Failed");
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Payment Initialization Failed");
    } finally {
      setLoading(false);
    }
  };

  const activeSub = builder?.subscriptions?.find((s: any) => s.status === 'active');
  const upcomingSubs = builder?.subscriptions?.filter((s: any) => s.status === 'upcoming') || [];
  
  // All subscriptions for history (Active + Upcoming + Expired)
  const allSubs = [...(builder?.subscriptions || [])].sort((a: any, b: any) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const historyColumns = [
    {
      header: 'Plan Detail',
      key: 'planName',
      render: (sub: any) => (
        <div>
          <p className="text-sm font-semibold text-slate-900">{sub.planName}</p>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            ID: {sub.razorpayPaymentId || 'MANUAL'}
          </p>
        </div>
      )
    },
    {
      header: 'Purchase Date',
      key: 'startDate',
      render: (sub: any) => (
        <span className="text-sm text-slate-600 font-medium">
           {new Date(sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Expiry Date',
      key: 'endDate',
      render: (sub: any) => (
        <span className="text-sm text-slate-600 font-medium">
           {new Date(sub.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Amount',
      key: 'amountPaid',
      render: (sub: any) => (
        <span className="text-sm font-bold text-slate-900">
           ₹{sub.amountPaid.toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      className: 'text-right',
      render: (sub: any) => (
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
          sub.status === 'active' 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : sub.status === 'upcoming'
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-slate-50 text-slate-400 border-slate-100"
        )}>
          {sub.status}
        </span>
      )
    }
  ];

  if (!mounted) return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
       <Loader2 className="animate-spin text-slate-200" size={48} />
    </div>
  );

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Billing & Subscription</h1>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
           {[
             { id: 'current', label: 'My Plan', icon: Package },
             { id: 'history', label: 'Billing History', icon: History }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                 activeTab === tab.id 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
               )}
             >
               <tab.icon size={14} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'current' && (
          <motion.div 
            key="current"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Active Plan Card */}
              <div className="space-y-6">
                {!activeSub ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center flex flex-col items-center">
                     <Package size={48} className="text-slate-200 mb-4" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
                        No active subscription found.<br />Please contact support to activate your plan.
                     </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-8 h-full flex items-center opacity-[0.03] pointer-events-none">
                       <ShieldCheck size={200} />
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-100/50">
                          Current Plan
                        </span>
                        <h2 className="text-4xl font-black text-slate-900 mt-4 leading-tight group">
                          {activeSub.planName}
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 mt-2 font-bold text-[10px] uppercase tracking-wider">
                           <Calendar size={12} className="text-indigo-400" />
                           Valid until {new Date(activeSub.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Billing Amount</p>
                         <p className="text-3xl font-black text-slate-900">₹{activeSub.amountPaid.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
                      {[
                        { label: 'Staff Members', value: builder?.currentLimits?.noOfStaff || 0, max: activeSub.noOfStaff || 0, icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Project Sites', value: builder?.currentLimits?.noOfSites || 0, max: activeSub.noOfSites || 0, icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'WhatsApp Automation', value: builder?.currentLimits?.noOfWhatsapp || 0, max: activeSub.noOfWhatsapp || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                      ].map((limit, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", limit.bg, limit.color)}>
                               <limit.icon size={22} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{limit.label}</p>
                               <p className="text-xl font-black text-slate-900 mt-0.5">
                                 {limit.max}
                               </p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming section if it exists */}
            {upcomingSubs.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Queued Renewals ({upcomingSubs.length})</p>
                {upcomingSubs.map((sub: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={sub._id} 
                    className="bg-white border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm shadow-emerald-50/30 border-l-4 border-l-emerald-500"
                  >
                     <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ZapIcon size={24} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 inline-block">Renewed Plan</p>
                          <h3 className="text-xl font-black text-slate-800 mt-1">{sub.planName}</h3>
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                             Effective from {new Date(sub.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-8 pl-6 md:border-l border-slate-100">
                        <div className="text-center md:text-right">
                           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
                           <p className="text-xl font-black text-emerald-600">₹{sub.amountPaid.toLocaleString()}</p>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CommonTable 
              title="Billing & Plan History"
              columns={historyColumns}
              data={allSubs}
              loading={false}
              searchValue=""
              onSearchChange={() => {}}
              pagination={{
                totalItems: allSubs.length,
                totalPages: 1,
                currentPage: 1,
                limit: 100
              }}
              onPageChange={() => {}}
              searchPlaceholder="Search history..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
