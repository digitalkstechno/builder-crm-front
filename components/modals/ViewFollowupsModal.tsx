import React, { useEffect } from 'react';
import { X, Calendar, CheckCircle, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ViewFollowupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
}

export default function ViewFollowupsModal({ isOpen, onClose, lead }: ViewFollowupsModalProps) {
  const { followups, loading } = useSelector((state: RootState) => state.lead);

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Calendar className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Lead Followups</h2>
                  <p className="text-sm text-slate-500">{lead?.name} - {followups.length} followups</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : followups.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">No followups scheduled for this lead</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {followups.map((followup: any) => (
                    <div
                      key={followup._id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {followup.isCompleted ? (
                            <CheckCircle className="text-green-600" size={18} />
                          ) : followup.followupDate < today ? (
                            <Clock className="text-red-500" size={18} />
                          ) : (
                            <Clock className="text-amber-500" size={18} />
                          )}
                          <span className="font-semibold text-slate-900">
                            {followup.followupDate}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          followup.isCompleted
                            ? 'bg-green-100 text-green-700'
                            : followup.followupDate < today
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {followup.isCompleted ? 'Completed' : followup.followupDate < today ? 'Overdue' : 'Pending'}
                        </span>
                      </div>

                      <p className="text-slate-700 mb-3 leading-relaxed">
                        {followup.notes}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>Created by {followup.createdBy}</span>
                        </div>
                        <span>{followup.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}