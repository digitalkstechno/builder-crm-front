import React, { useState } from 'react';
import { X, Calendar, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface FollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean;
  lead?: any;
}

export default function FollowupModal({ isOpen, onClose, onSubmit, loading = false, lead }: FollowupModalProps) {
  const [formData, setFormData] = useState({
    followupDate: '',
    followupTime: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.followupDate || !formData.followupTime || !formData.notes.trim()) {
      return;
    }
    try {
      await onSubmit(formData);
      setFormData({ followupDate: '', followupTime: '', notes: '' });
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const handleClose = () => {
    setFormData({ followupDate: '', followupTime: '', notes: '' });
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
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Calendar className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add Followup</h2>
                  <p className="text-sm text-slate-500">Schedule a followup for {lead?.name}</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Followup Date *
                  </label>
                  <input
                    type="date"
                    value={formData.followupDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, followupDate: e.target.value }))}
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
                    value={formData.followupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, followupTime: e.target.value }))}
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
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter followup notes..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="text-amber-600 mt-0.5" size={16} />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold">Reminder will be created</p>
                    <p>A reminder notification will be sent 1 day before the followup date.</p>
                  </div>
                </div>
              </div> */}

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
                  disabled={loading || !formData.followupDate || !formData.followupTime || !formData.notes.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Followup'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}