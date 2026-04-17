'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Search, PhoneCall, MessageCircle, Clock, MoreHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchReminders, markReminderCompleted, createFollowup, fetchLeadStatuses, updateLead } from '@/redux/slices/leadSlice';
import CommonTable from '@/components/ui/CommonTable';
import CompleteReminderModal from '@/components/modals/CompleteReminderModal';
import Swal from 'sweetalert2';
import { formatDate } from '@/lib/utils';

export default function RemindersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { reminders, reminderPagination, loading, leadStatuses } = useSelector((state: RootState) => state.lead);

  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 10;

  // Modal state
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchReminders({ status: activeTab, page: currentPage, limit: currentLimit }));
  }, [dispatch, activeTab, currentPage]);

  useEffect(() => {
    if (leadStatuses.length === 0) {
      dispatch(fetchLeadStatuses());
    }
  }, [dispatch, leadStatuses.length]);

  const filteredReminders = reminders.filter(r =>
    r.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkCompleted = (reminder: any) => {
    console.log('Reminder clicked for completion:', reminder);
    setSelectedReminder(reminder);
    setIsCompleteModalOpen(true);
  };

  const extractLeadIdFromReminder = (reminder: any): string | null => {
    console.log('Extracting leadId from reminder:', reminder);

    // Method 1: Direct leadId field
    if (reminder.leadId) {
      console.log('Found leadId directly:', reminder.leadId);
      return reminder.leadId;
    }

    // Method 2: From populated lead object
    if (reminder.lead && reminder.lead._id) {
      console.log('Found leadId from lead object:', reminder.lead._id);
      return reminder.lead._id;
    }

    // Method 3: From followup object
    if (reminder.followupId) {
      if (typeof reminder.followupId === 'object') {
        // followupId is populated
        if (reminder.followupId.leadId) {
          console.log('Found leadId from followupId.leadId:', reminder.followupId.leadId);
          return reminder.followupId.leadId;
        }
      } else if (typeof reminder.followupId === 'string') {
        // followupId is just an ID string - this shouldn't happen with populated data
        console.warn('followupId is a string, data may not be properly populated');
      }
    }

    console.error('Could not extract leadId from reminder');
    return null;
  };

  const handleCompleteReminderSubmit = async (data: any) => {
    try {
      console.log('Complete reminder data:', data);
      console.log('Selected reminder:', selectedReminder);

      if (data.outcome === 'reschedule') {
        // Extract leadId using multiple fallback methods
        const leadId = extractLeadIdFromReminder(selectedReminder);

        if (!leadId) {
          console.error('Complete selectedReminder data:', JSON.stringify(selectedReminder, null, 2));
          console.error('Available keys:', Object.keys(selectedReminder));
          throw new Error(`Cannot determine lead ID for rescheduling. Selected reminder: ${JSON.stringify(selectedReminder)}`);
        }

        console.log('Creating rescheduled followup for lead:', leadId);

        const followupResult = await dispatch(createFollowup({
          leadId: leadId,
          followupDate: data.rescheduleData.followupDate,
          followupTime: data.rescheduleData.followupTime || '09:00', // Default time if not provided
          notes: data.rescheduleData.notes
        })).unwrap();

        console.log('Rescheduled followup created successfully:', followupResult);

        console.log('Followup created:', followupResult);
      }

      // Mark the current reminder as completed
      console.log('Marking reminder as completed:', selectedReminder._id);
      await dispatch(markReminderCompleted(selectedReminder._id)).unwrap();

      // Update lead status if outcome is 'won' or 'lost'
      if (data.outcome === 'won' || data.outcome === 'lost') {
        const leadId = extractLeadIdFromReminder(selectedReminder);
        if (leadId) {
          const statusKey = data.outcome === 'won' ? 'WON' : 'LOST';
          const status = leadStatuses.find(s => s.key === statusKey);
          if (status) {
            console.log(`Updating lead ${leadId} status to ${statusKey}`);
            await dispatch(updateLead({
              id: leadId,
              data: { stageId: status._id, stageName: status.name }
            })).unwrap();
          } else {
            console.warn(`Lead status with key ${statusKey} not found`);
          }
        }
      }

      setIsCompleteModalOpen(false);
      setSelectedReminder(null);

      const outcomeMessage = data.outcome === 'won' ? 'Lead marked as won!' :
                           data.outcome === 'lost' ? 'Lead marked as lost.' :
                           'Followup rescheduled successfully!';

      Swal.fire({
        title: 'Success!',
        text: outcomeMessage,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('Error completing reminder:', error);
      console.error('Error details:', error.response?.data || error.message);

      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete reminder. Please try again.';

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const columns = [
    {
      header: 'Action',
      key: 'status',
      className: 'w-12',
      render: (reminder: any) => (
        <button
          onClick={() => !reminder.isSent && handleMarkCompleted(reminder)}
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
             <span className="font-semibold text-slate-900 text-sm block">{reminder.lead}</span>
             <span className="text-xs text-slate-400">Follow-up Reminder</span>
          </div>
        </div>
      )
    },
    {
      header: 'Followup Date',
      key: 'followupDate',
      render: (reminder: any) => (
        <span className="text-sm text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
           {formatDate(reminder.followupDate)}
        </span>
      )
    },
    {
      header: 'Schedule',
      key: 'reminderTime',
      render: (reminder: any) => (
        <div className="flex items-center gap-1.5 text-slate-600 text-sm bg-slate-50 px-2 py-0.5 w-fit rounded border border-slate-100">
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
          "text-xs font-medium px-2 py-0.5 rounded-full",
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
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <Calendar size={12} className="text-indigo-500" />
            Daily Task Management
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100 w-fit mb-4">
        {[
          { label: 'Missed', value: 'missed' },
          { label: 'Today', value: 'today' },
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Completed', value: 'completed' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              activeTab === tab.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab.label === 'Missed' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            {tab.label}
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

      {/* Complete Reminder Modal */}
      <CompleteReminderModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setSelectedReminder(null);
        }}
        onSubmit={handleCompleteReminderSubmit}
        loading={loading}
        reminder={selectedReminder}
      />
    </div>
  );
}
