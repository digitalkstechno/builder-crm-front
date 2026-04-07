'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  Download, 
  MoreVertical, 
  Plus, 
  Search, 
  X, 
  Phone, 
  Building, 
  Target, 
  IndianRupee, 
  User, 
  Calendar,
  LayoutGrid,
  List,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { LEADS as INITIAL_LEADS, STAGES, Lead } from '@/lib/mockData';

const LeadRow = ({ lead }: { lead: Lead }) => (
  <tr className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
          {lead.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
            <Calendar size={10} />
            {lead.createdAt}
          </div>
        </div>
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
        <Phone size={14} className="text-slate-400" />
        {lead.phone}
      </div>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
        <Building size={14} className="text-slate-400" />
        {lead.site}
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={cn(
        "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 w-fit",
        lead.source === 'WhatsApp' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
        lead.source === 'Facebook' ? "bg-blue-50 text-blue-600 border border-blue-100" :
        "bg-purple-50 text-purple-600 border border-purple-100"
      )}>
        <Target size={10} />
        {lead.source}
      </span>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
        <IndianRupee size={14} className="text-slate-400" />
        {lead.budget}
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={cn(
        "text-[10px] font-bold px-3 py-1 rounded-full",
        lead.stage === 'New' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
        lead.stage === 'Contacted' ? "bg-blue-50 text-blue-600 border border-blue-100" :
        lead.stage === 'Interested' ? "bg-cyan-50 text-cyan-600 border border-cyan-100" :
        lead.stage === 'Site Visit' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
        lead.stage === 'Negotiation' ? "bg-amber-50 text-amber-600 border border-amber-100" :
        "bg-green-50 text-green-600 border border-green-100"
      )}>
        {lead.stage}
      </span>
    </td>
    <td className="py-4 px-6">
      <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
        <User size={14} className="text-slate-400" />
        {lead.agent}
      </div>
    </td>
    <td className="py-4 px-6 text-right">
      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
        <MoreVertical size={16} />
      </button>
    </td>
  </tr>
);

const KanbanCard = ({ lead, onDragStart }: { lead: Lead, onDragStart: (e: React.DragEvent, id: string) => void }) => (
  <motion.div
    layoutId={lead.id}
    draggable
    onDragStart={(e) => onDragStart(e, lead.id)}
    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing group"
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
      <button className="p-1 text-slate-300 hover:text-slate-500 rounded-lg hover:bg-slate-50">
        <MoreVertical size={14} />
      </button>
    </div>
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">{lead.source}</span>
      <span className="text-[10px] font-bold text-slate-900">{lead.budget}</span>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
        <MapPin size={10} />
        {lead.site}
      </div>
      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-700 border border-white shadow-sm">
        {lead.agent.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
  </motion.div>
);

export default function LeadsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, stage: stageId as any } : lead
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
            <button className="px-6 py-2 bg-white text-slate-900 shadow-sm rounded-xl text-sm font-bold transition-all">All Leads</button>
            <button className="px-6 py-2 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-all">My Leads</button>
            <button className="px-6 py-2 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-all">Unassigned</button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block" />

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'kanban' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Leads Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="py-5 px-6">Lead Information</th>
                    <th className="py-5 px-6">Phone</th>
                    <th className="py-5 px-6">Site / Project</th>
                    <th className="py-5 px-6">Source</th>
                    <th className="py-5 px-6">Budget</th>
                    <th className="py-5 px-6">Current Stage</th>
                    <th className="py-5 px-6">Assigned To</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(lead => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showing {leads.length} of 3,240 leads</p>
              <div className="flex items-center gap-1.5">
                <button className="px-4 py-2 text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-100">1</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 text-xs font-bold transition-all">2</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white border border-transparent hover:border-slate-200 text-slate-600 text-xs font-bold transition-all">3</button>
                <button className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">Next</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-250px)]"
          >
            {STAGES.map(stage => (
              <div 
                key={stage.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="min-w-[300px] max-w-[300px] flex flex-col gap-4"
              >
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{stage.label}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {leads.filter(l => l.stage === stage.id).length}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex-1 space-y-4 p-3 bg-slate-50 rounded-[2rem] border border-slate-100/50 min-h-[500px]">
                  {leads.filter(l => l.stage === stage.id).map(lead => (
                    <KanbanCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
                  ))}
                  {leads.filter(l => l.stage === stage.id).length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No leads</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add New Lead</h3>
                  <p className="text-sm text-slate-400 mt-1">Fill in the details to create a new potential customer.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="e.g. Rahul Sharma" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="+91 98765 43210" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Site / Project</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium appearance-none">
                        <option>Skyline Heights</option>
                        <option>Skyline Grand</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Source</label>
                    <div className="relative">
                      <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium appearance-none">
                        <option>WhatsApp</option>
                        <option>Facebook</option>
                        <option>Website</option>
                        <option>Walk-in</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Budget Range</label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="e.g. ₹80L - ₹1Cr" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Agent</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium appearance-none">
                        <option>Auto Assign (Round Robin)</option>
                        <option>Kavya Reddy</option>
                        <option>Nikhil Mehta</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[1.25rem] font-bold transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-bold transition-all shadow-xl shadow-indigo-200 active:scale-95"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
