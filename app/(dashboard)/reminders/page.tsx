'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Search, PhoneCall, MessageCircle, Clock, MoreHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchReminders, markReminderCompleted } from '@/redux/slices/leadSlice';
import CommonTable from '@/components/ui/CommonTable';
import Swal from 'sweetalert2';

export default function RemindersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, reminderPagination, loading } = useSelector((state: RootState) => state.lead);

  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 10;

  useEffect(() => {
    dispatch(fetchReminders({ status: activeTab, page: currentPage, limit: currentLimit }));
  }, [dispatch, activeTab, currentPage]);

  const filteredReminders = reminders.filter(r =>
    r.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkCompleted = async (reminderId: string) => {
    try {
      await dispatch(markReminderCompleted(reminderId)).unwrap();
      Swal.fire({
        title: 'Success!',
        text: 'Reminder marked as completed.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error marking reminder completed:', error);
    }
  };

  const columns = [
    {
      header: 'Action',
      key: 'status',
      className: 'w-12',
      render: (reminder: any) => (
        <button
          onClick={() => !reminder.isSent && handleMarkCompleted(reminder._id)}
          disabled={reminder.isSent}
          className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            reminder.isSent
              ? "bg-emerald-500 border-emerald-500 text-white cursor-not-allowed"
              : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 text-transparent hover:text-emerald-500 cursor-pointer"
          )}
        >
           <Check size={12} className={reminder.isSent ? "text-white" : "text-slate-300"} />
        </button>
      )
    },
    {
      header: 'Lead Information',
      key: 'lead',
      render: (reminder: any) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "bg-indigo-50 text-indigo-600"
          )}>
             <MessageCircle size={12} />
          </div>
          <div>
             <span className="font-semibold text-slate-900 text-xs tracking-tight block">{reminder.lead}</span>
             <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Follow-up Reminder</span>
          </div>
        </div>
      )
    },
    {
      header: 'Followup Date',
      key: 'followupDate',
      render: (reminder: any) => (
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
           {reminder.followupDate}
        </span>
      )
    },
    {
      header: 'Schedule',
      key: 'reminderTime',
      render: (reminder: any) => (
        <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs bg-slate-50 px-2 py-0.5 w-fit rounded border border-slate-100">
           <Clock size={12} className="text-slate-400" />
           {reminder.reminderTime}
        </div>
      )
    },
    {
      header: 'Notes',
      key: 'notes',
      render: (reminder: any) => (
        <div className="max-w-xs truncate text-xs text-slate-600">
          {reminder.notes}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (reminder: any) => (
        <span className={cn(
          "text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
          reminder.isSent ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        )}>
          {reminder.isSent ? 'Completed' : 'Pending'}
        </span>
      )
    }
  ];

  return (
    <div className="mx-auto space-y-4 pb-20 px-6 pt-5">
      {/* High-Density Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight leading-none mb-1">Follow-ups</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center gap-2">
            <Calendar size={10} className="text-indigo-500" />
            Daily Task Management
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 w-fit mb-4">
        {['Missed', 'Today', 'Upcoming', 'Completed'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center gap-2",
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab === 'Missed' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            {tab}
          </button>
        ))}
      </div>

      <CommonTable
        title="Daily Tasks"
        columns={columns}
        data={filteredReminders}
        loading={loading}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search leads or notes..."
        pagination={{
          ...reminderPagination,
          totalItems: reminderPagination.totalRecords
        }}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
