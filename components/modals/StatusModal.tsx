'use client';

import React from 'react';
import CommonDialog from '@/components/ui/CommonDialog';
import { Zap, Activity, RefreshCcw } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function StatusModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: StatusModalProps) {
  return (
    <CommonDialog isOpen={isOpen} onClose={onClose} title="System Diagnostics">
      <div className="space-y-6 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <Zap size={40} className="animate-pulse" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Run System-wide Audit?</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            This will perform a deep scan of all API nodes, database clusters, and communication hubs. This process may take up to 30 seconds.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Checklist</span>
            <span>Est. Time</span>
          </div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2"><Activity size={14} className="text-indigo-500" /> API Connectivity</div>
            <span>5s</span>
          </div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2"><Activity size={14} className="text-indigo-500" /> DB Latency Test</div>
            <span>12s</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all active:scale-95 uppercase text-[11px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
          >
            <RefreshCcw size={18} />
            Start Audit
          </button>
        </div>
      </div>
    </CommonDialog>
  );
}
