import React, { useState } from 'react';
import { X, Calendar, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface CompleteReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
  reminder?: any;
}

export default function CompleteReminderModal({ isOpen, onClose, onSubmit, loading = false, reminder }: CompleteReminderModalProps) {
  const [outcome, setOutcome] = useState<'won' | 'lost' | 'reschedule'>('won');
  const [rescheduleData, setRescheduleData] = useState({
    followupDate: '',
    followupTime: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      outcome,
      ...(outcome === 'reschedule' && {
        rescheduleData: {
          followupDate: rescheduleData.followupDate,
          followupTime: rescheduleData.followupTime,
          notes: rescheduleData.notes,
          leadId: reminder?.leadId
        }
      })
    };

    try {
      await onSubmit(submitData);
      // Reset form
      setOutcome('won');
      setRescheduleData({ followupDate: '', followupTime: '', notes: '' });
    } catch (error) {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    setOutcome('won');
    setRescheduleData({ followupDate: '', followupTime: '', notes: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Complete Reminder</h2>
                  <p className="text-sm text-slate-500">Mark followup as completed for {reminder?.lead}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Followup Outcome *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="outcome"
                      value="won"
                      checked={outcome === 'won'}
                      onChange={(e) => setOutcome(e.target.value as 'won')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <CheckCircle size={18} className="text-emerald-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Won</div>
                      <div className="text-sm text-slate-500">Lead converted successfully</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="outcome"
                      value="lost"
                      checked={outcome === 'lost'}
                      onChange={(e) => setOutcome(e.target.value as 'lost')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <AlertTriangle size={18} className="text-red-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Lost</div>
                      <div className="text-sm text-slate-500">Lead was not interested</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="outcome"
                      value="reschedule"
                      checked={outcome === 'reschedule'}
                      onChange={(e) => setOutcome(e.target.value as 'reschedule')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <RotateCcw size={18} className="text-amber-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Reschedule</div>
                      <div className="text-sm text-slate-500">Schedule another followup</div>
                    </div>
                  </label>
                </div>
              </div>

              {outcome === 'reschedule' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border-t border-slate-100 pt-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        New Date *
                      </label>
                      <input
                        type="date"
                        value={rescheduleData.followupDate}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, followupDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={rescheduleData.followupTime}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, followupTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Notes *
                    </label>
                    <textarea
                      value={rescheduleData.notes}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter reschedule notes..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows={3}
                      required
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (outcome === 'reschedule' && (!rescheduleData.followupDate || !rescheduleData.followupTime || !rescheduleData.notes.trim()))}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Completing...' : 'Complete Reminder'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}