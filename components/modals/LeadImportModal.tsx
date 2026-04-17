'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { downloadSampleExcel, importLeads, fetchLeads } from '@/redux/slices/leadSlice';
import { cn } from '@/lib/utils';

interface ImportResult {
  imported: number;
  failedCount: number;
  failedExcel: string | null;
}

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadImportModal({ isOpen, onClose }: LeadImportModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) return;
    setFile(selectedFile);
    setImportResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleDownloadSample = async () => {
    setDownloading(true);
    await dispatch(downloadSampleExcel({}));
    setDownloading(false);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    const result = await dispatch(importLeads(file));
    setImporting(false);
    if (importLeads.fulfilled.match(result)) {
      setImportResult({
        imported: result.payload.imported,
        failedCount: result.payload.failedCount || 0,
        failedExcel: result.payload.failedExcel || null,
      });
      dispatch(fetchLeads({ page: 1, limit: 10 }));
    }
  };

  const handleDownloadFailedRows = () => {
    if (!importResult?.failedExcel) return;
    const byteCharacters = atob(importResult.failedExcel);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'failed_leads.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FileSpreadsheet className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Import Leads</h2>
                  <p className="text-xs text-slate-500">Upload Excel file to bulk import leads</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1 – Download Template */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-indigo-900">Step 1: Download Template</p>
                    {/* <p className="text-xs text-indigo-600 mt-0.5">
                      The template has your actual <span className="font-semibold">Sites</span>,{' '}
                      <span className="font-semibold">Sources</span> &amp;{' '}
                      <span className="font-semibold">Stages</span> as in-cell dropdowns — directly from your CRM data.
                    </p> */}
                  </div>
                  <button
                    onClick={handleDownloadSample}
                    disabled={downloading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                  >
                    <Download size={13} />
                    {downloading ? 'Downloading...' : 'Download Template'}
                  </button>
                </div>
              </div>

              {/* Step 2 – Upload */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Step 2: Upload Filled Excel</p>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                    isDragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50",
                    file && "border-emerald-300 bg-emerald-50"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileSpreadsheet size={20} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">{file.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); setImportResult(null); }}
                        className="p-0.5 text-emerald-500 hover:text-rose-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <CloudUpload size={28} className="mx-auto text-slate-300" />
                      <p className="text-sm text-slate-500">Drag &amp; drop or <span className="text-indigo-600 font-semibold">browse</span></p>
                      <p className="text-xs text-slate-400">.xlsx or .xls files only</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Import Result */}
              {importResult && (
                <div className="space-y-3">
                  {importResult.imported > 0 && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span className="text-sm font-semibold text-emerald-800">
                        {importResult.imported} leads imported successfully
                      </span>
                    </div>
                  )}

                  {importResult.failedCount > 0 && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={16} className="text-rose-500 shrink-0" />
                          <span className="text-sm font-semibold text-rose-800">
                            {importResult.failedCount} rows failed validation
                          </span>
                        </div>
                        {importResult.failedExcel && (
                          <button
                            onClick={handleDownloadFailedRows}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
                          >
                            <Download size={12} />
                            Download Failed Rows
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-rose-600 mt-1.5 pl-6">
                        Download the failed rows file, fix the errors, and re-import.
                      </p>
                    </div>
                  )}

                  {importResult.imported === 0 && importResult.failedCount === 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                      <AlertCircle size={16} className="text-amber-500" />
                      <span className="text-sm font-semibold text-amber-800">No data found in the file</span>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  {importResult ? 'Close' : 'Cancel'}
                </button>
                {!importResult && (
                  <button
                    onClick={handleImport}
                    disabled={!file || importing}
                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Upload size={15} />
                    {importing ? 'Importing...' : 'Import Leads'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
