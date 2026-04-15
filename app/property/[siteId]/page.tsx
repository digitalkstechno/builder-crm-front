'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MapPin, IndianRupee, Tag, Home, Building2, ChevronLeft, ChevronRight, X, ZoomIn, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function PropertyViewPage() {
  const { siteId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromBuilder = searchParams.get('from');
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    if (!siteId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/sites/${siteId}`)
      .then(res => setSite(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [siteId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';
  const images: string[] = site?.images || [];
  const allImages = images.map((img: string) => `${imageUrl}${img}`);

  const openLightbox = (index: number) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const prev = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + allImages.length) % allImages.length })),
    [allImages.length]);

  const next = useCallback(() =>
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % allImages.length })),
    [allImages.length]);

  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open, prev, next]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading property...</span>
      </div>
    </div>
  );

  if (notFound || !site) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Property Not Found</h2>
        <p className="text-sm text-slate-400">This property may have been removed or is unavailable.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <div className="relative w-full h-[55vh] bg-slate-900 overflow-hidden">
        {allImages[0] ? (
          <img src={allImages[0]} alt={site.name} className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <button
            onClick={() => fromBuilder ? router.push(`/builder/${fromBuilder}`) : router.back()}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
            <Building2 size={13} className="text-white/80" />
            <span className="text-xs font-semibold text-white/90">{site.builderId?.companyName || 'Builder'}</span>
          </div>
        </div>

        <div className="absolute top-6 right-6">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${site.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
            {site.status}
          </span>
        </div>

        <div className="absolute bottom-8 left-6 right-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">{site.name}</h1>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin size={14} />
            <span>{site.area}, {site.city}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={13} className="text-indigo-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{site.city}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={13} className="text-indigo-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{site.area}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={13} className="text-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">By</span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">{site.builderId?.companyName || '—'}</p>
          </div>
        </div>

        {/* Description */}
        {site.description && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">About This Project</h2>
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed [&_*]:break-words [&_*]:overflow-wrap-anywhere"
              dangerouslySetInnerHTML={{ __html: site.description }}
            />
          </div>
        )}

        {/* Property Types + Requirement Types + Budgets */}
        <div className="grid sm:grid-cols-3 gap-4">
          {(site.propertyTypes || []).length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Home size={14} className="text-amber-500" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Types</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.propertyTypes.map((pt: any, i: number) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                    {pt.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(site.requirementTypes || []).length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-indigo-500" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement Types</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.requirementTypes.map((rt: any, i: number) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                    {rt.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(site.budgets || []).length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee size={14} className="text-emerald-500" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Range</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {site.budgets.map((b: any, i: number) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery — ALL images including hero */}
        {allImages.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Gallery</h2>
              <span className="text-xs text-slate-400 font-medium">{allImages.length} photos</span>
            </div>
            {/* Masonry columns — photos fit naturally, no blank space */}
            <div className="columns-2 sm:columns-3 gap-3 space-y-3">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={img}
                    alt={`${site.name} ${i + 1}`}
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">Listed by <span className="font-semibold text-slate-600">{site.builderId?.companyName}</span></p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={closeLightbox}
          >
            <X size={20} className="text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
            {lightbox.index + 1} / {allImages.length}
          </div>

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              className="absolute left-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
            <img
              src={allImages[lightbox.index]}
              alt={`${site.name} ${lightbox.index + 1}`}
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />
          </div>

          {/* Next */}
          {allImages.length > 1 && (
            <button
              className="absolute right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={e => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setLightbox(lb => ({ ...lb, index: i })); }}
                  className={`flex-shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${i === lightbox.index ? 'border-white scale-110' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


