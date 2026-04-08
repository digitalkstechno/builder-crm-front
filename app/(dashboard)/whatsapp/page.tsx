'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Smartphone,
  Phone,
  CheckCircle2,
  Edit3,
  Trash2,
  LayoutGridIcon,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchWhatsapp, addWhatsapp, updateWhatsapp, deleteWhatsapp } from '@/redux/slices/whatsappSlice';
import { toast } from 'react-hot-toast';
import WhatsAppModal from '@/components/modals/WhatsAppModal';
import CommonTable from '@/components/ui/CommonTable';

const NumberCard = ({ num, onEdit, onDelete }: { num: any, onEdit: (n: any) => void, onDelete: (id: string) => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 flex flex-col gap-6 relative overflow-hidden group"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
           <MessageSquare size={28} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{num.name}</h3>
          <p className="text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1.5 uppercase tracking-widest">
            <Smartphone size={12} />
            Business Hub
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(num)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
        >
          <Edit3 size={16} />
        </button>
        <button 
          onClick={() => onDelete(num._id)}
          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    <div className="space-y-3 font-semibold">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
        <Phone size={14} className="text-slate-400 shrink-0" />
        <span className="tracking-[0.2em]">+91 {num.number}</span>
      </div>
    </div>

    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">Status</p>
        <span className={cn(
          "inline-flex items-center gap-1.5 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
          num.isActive ? "text-emerald-600" : "text-slate-400"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", num.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
          {num.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </motion.div>
);

export default function WhatsAppPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { whatsappList, loading, pagination } = useSelector((state: RootState) => state.whatsapp);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const currentLimit = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  const handleOpenModal = (num: any = null) => {
    setEditingNumber(num);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNumber(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingNumber) {
        const resultAction = await dispatch(updateWhatsapp({ id: editingNumber._id, data }));
        if (updateWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number updated successfully!");
          handleCloseModal();
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to update WhatsApp number");
        }
      } else {
        const resultAction = await dispatch(addWhatsapp(data));
        if (addWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number added successfully!");
          handleCloseModal();
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to add WhatsApp number");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this WhatsApp number?")) {
      try {
        const resultAction = await dispatch(deleteWhatsapp(id));
        if (deleteWhatsapp.fulfilled.match(resultAction)) {
          toast.success("WhatsApp number deleted successfully!");
          dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
        } else {
          toast.error(resultAction.payload as string || "Failed to delete WhatsApp number");
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const resultAction = await dispatch(updateWhatsapp({ id, data: { isActive: newStatus } }));
      if (updateWhatsapp.fulfilled.match(resultAction)) {
        toast.success(`Hub ${newStatus ? 'activated' : 'deactivated'} successfully!`);
        dispatch(fetchWhatsapp({ page: currentPage, limit: currentLimit, search: debouncedSearch }));
      } else {
        toast.error(resultAction.payload as string || "Failed to update status");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  const columns = [
    {
      header: 'Hub Name',
      key: 'name',
      render: (num: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100/50">
             <MessageSquare size={16} />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight block normal-case">{num.name}</span>
        </div>
      )
    },
    {
      header: 'Phone Number',
      key: 'number',
      render: (num: any) => (
        <div className="text-[11px] font-black text-slate-600 tracking-[0.2em]">
          +91 {num.number}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (num: any) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              num.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
            )} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              num.isActive ? "text-emerald-600" : "text-slate-400"
            )}>
              {num.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <button 
            onClick={() => handleStatusToggle(num._id, num.isActive)}
            className={cn(
              "relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none",
              num.isActive ? "bg-emerald-500" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200",
              num.isActive ? "translate-x-4" : "translate-x-0"
            )} />
          </button>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (num: any) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => handleOpenModal(num)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-hover"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(num._id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-hover"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 pt-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <MessageSquare size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">WhatsApp Hub</h1>
          </div>
          <p className="text-slate-500 font-semibold flex items-center gap-2">
             <Smartphone size={14} className="text-indigo-500" />
             Manage provisioned business instances for automated communications.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGridIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-2.5 rounded-lg transition-all",
                viewMode === 'table' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-200 active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={4} />
            Connect Hub
          </button>
        </div>
      </div>

      {/* Grid or Table View */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10"
          >
            {whatsappList.map((num: any) => (
              <NumberCard 
                key={num._id} 
                num={num} 
                onEdit={handleOpenModal} 
                onDelete={handleDelete} 
              />
            ))}
            
            <button 
              onClick={() => handleOpenModal()}
              className="h-full min-h-[220px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                <Plus size={32} />
              </div>
              <p className="text-lg font-black text-slate-400 group-hover:text-indigo-600 transition-all uppercase tracking-widest">Connect New Hub</p>
              <p className="text-xs font-bold text-slate-400 mt-1 text-center">Add another business number for communication.</p>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CommonTable 
              title="WhatsApp Directory"
              columns={columns}
              data={whatsappList}
              loading={loading}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              onPageChange={setCurrentPage}
              pagination={{
                totalItems: pagination.totalRecords,
                totalPages: pagination.totalPages,
                currentPage: currentPage,
                limit: currentLimit
              }}
              searchPlaceholder="Filter instances..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        loading={loading}
        initialData={editingNumber}
      />
    </div>
  );
}
