'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Building2, ArrowLeft, Home, Phone, Mail, Info } from 'lucide-react';
import axios from 'axios';

export default function BuilderPublicPage() {
  const { builderId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!builderId) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/builders/${builderId}`)
      .then(res => setData(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [builderId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Loading...</span>
      </div>
    </div>
  );

  if (notFound || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <Building2 size={28} className="text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Builder Not Found</h2>
        <p className="text-sm text-slate-400">This builder may not exist or is unavailable.</p>
      </div>
    </div>
  );

  const { builder, sites } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900">{builder.companyName}</h1>
            {builder.address && (
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin size={11} />
                <span>{builder.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Our Projects</h2>
          <span className="text-xs text-slate-400 font-medium">{sites.length} {sites.length === 1 ? 'site' : 'sites'}</span>
        </div>

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sites.map((site: any) => {
              const mainImage = site.images?.[0] ? `${imageUrl}${site.images[0]}` : null;
              return (
                <div
                  key={site._id}
                  onClick={() => router.push(`/property/${site._id}?from=${builderId}`)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                        <Building2 size={32} className="text-indigo-200" />
                      </div>
                    )}
                    <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${site.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
                      {site.status}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-black text-slate-900 mb-1.5 truncate">{site.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={11} className="text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{site.area}, {site.city}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Left — Brand */}
            <div className="space-y-4">
              {builder.websiteDetails?.logo ? (
                <img src={builder.websiteDetails.logo} alt={builder.companyName} className="h-12 object-contain" />
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Building2 size={20} className="text-white" />
                  </div>
                  <span className="text-lg font-black">{builder.companyName}</span>
                </div>
              )}
              {builder.websiteDetails?.tagline && (
                <p className="text-sm text-slate-400 italic">"{builder.websiteDetails.tagline}"</p>
              )}
              {builder.websiteDetails?.about && (
                <p className="text-sm text-slate-400 leading-relaxed">{builder.websiteDetails.about}</p>
              )}
            </div>

            {/* Right — Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Us</h3>
              <div className="space-y-3">
                {builder.address && (
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <MapPin size={15} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{builder.address}</span>
                  </div>
                )}
                {builder.websiteDetails?.phone && (
                  <a href={`tel:${builder.websiteDetails.phone}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                    <Phone size={15} className="text-indigo-400 flex-shrink-0" />
                    <span>{builder.websiteDetails.phone}</span>
                  </a>
                )}
                {builder.websiteDetails?.email && (
                  <a href={`mailto:${builder.websiteDetails.email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                    <Mail size={15} className="text-indigo-400 flex-shrink-0" />
                    <span>{builder.websiteDetails.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 text-center">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} {builder.companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
