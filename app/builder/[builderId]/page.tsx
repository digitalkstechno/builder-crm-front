'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Building2, ArrowLeft, Home, Phone, Mail, Info, Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink, Globe } from 'lucide-react';
import axios from 'axios';
import { motion } from 'motion/react';

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
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [builderId]);

  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || '';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Architecting Portfolio...</span>
      </div>
    </div>
  );

  if (notFound || !data || !data.builder) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4 px-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <Building2 size={32} className="text-slate-300" />
        </div>
        <div>
           <h2 className="text-xl font-black text-slate-900">Portfolio Not Found</h2>
           <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto text-balance">The developer profile you're looking for doesn't exist or has been relocated.</p>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">
           Back to Home
        </button>
      </div>
    </div>
  );

  const { builder, sites } = data;
  const logoSrc = builder.websiteDetails?.logo 
    ? (builder.websiteDetails.logo.startsWith('http') ? builder.websiteDetails.logo : `${imageUrl}${builder.websiteDetails.logo}`)
    : null;

  const heroSrc = builder.websiteDetails?.heroImage
    ? (builder.websiteDetails.heroImage.startsWith('http') ? builder.websiteDetails.heroImage : `${imageUrl}${builder.websiteDetails.heroImage}`)
    : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070";

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-indigo-100 selection:text-indigo-900">

      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all active:scale-95 group"
            >
              <ArrowLeft size={18} className="text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="flex items-center gap-3">
              {logoSrc && (
                 <img src={logoSrc} alt="" className="h-8 w-8 object-contain rounded-lg bg-white p-1 border border-slate-100 shadow-sm" />
              )}
              <div>
                <h1 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{builder.companyName}</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] leading-none mt-0.5">Verified Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <section className="relative py-24 overflow-hidden bg-white">
         <div className="absolute top-0 right-0 w-1/4 h-full bg-indigo-600/5 blur-[120px] -z-1" />
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
               <motion.span 
                 initial={{ opacity: 0, x: -20 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="px-5 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] inline-block border border-indigo-100"
               >
                 Builder Portfolio
               </motion.span>
               <motion.h2 
                 initial={{ opacity: 0, y: 30 }} 
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]"
               >
                 {builder.websiteDetails?.tagline || `Redefining Urban Excellence.`}
               </motion.h2>
               <motion.p 
                 initial={{ opacity: 0, y: 30 }} 
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl"
               >
                 {builder.websiteDetails?.heroSubtitle || `We specialize in high-concept architecture and sustainable developments that stand as landmarks of modern legacy.`}
               </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }} 
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative aspect-square lg:aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] ring-16 ring-slate-50"
            >
               <img 
                 src={heroSrc} 
                 alt="Hero Banner" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
               <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between">
                  <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-xl">
                           <img src={`https://i.pravatar.cc/100?img=${i+14}`} alt="" />
                        </div>
                     ))}
                  </div>
                  <div className="text-right">
                     <p className="text-[11px] font-black text-white uppercase tracking-widest opacity-80 mb-1">Established Units</p>
                     <p className="text-3xl font-black text-white leading-none tracking-tighter">1,250+</p>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Projects Feed */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-24 space-y-16">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Our Core Portfolio</h2>
            <div className="flex items-center gap-3">
               <span className="h-1 w-12 bg-indigo-600 rounded-full" />
               <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">Verified managed developments</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <span className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-900 text-sm font-black shadow-sm">{sites.length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4">Active Projects</span>
          </div>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-[4rem] border border-slate-100 border-dashed">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-50">
              <Home size={32} className="text-slate-200" />
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-widest">No Projects Found</h3>
            <p className="text-xs text-slate-400 mt-2">New world-class developments will be announced soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sites.map((site: any) => {
              const mainImage = site.images?.[0] ? `${imageUrl}${site.images[0]}` : null;
              return (
                <motion.div
                  key={site._id}
                  whileHover={{ y: -15, scale: 1.02 }}
                  onClick={() => router.push(`/property/${site._id}?from=${builderId}`)}
                  className="group relative bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden cursor-pointer transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)]"
                >
                  {/* Visual Container */}
                  <div className="relative w-full h-[360px] bg-slate-100 overflow-hidden">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={site.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
                        <Building2 size={64} className="text-indigo-100" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-8 right-8 z-10 transition-transform group-hover:scale-110 duration-500">
                       <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border ${site.status === 'Active' ? 'bg-emerald-500/90 text-white border-emerald-400/20 shadow-emerald-500/20' : 'bg-amber-400/90 text-amber-950 border-amber-300/20 shadow-amber-500/20'}`}>
                         {site.status}
                       </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Body */}
                  <div className="p-10">
                    <div className="flex items-start justify-between gap-4 mb-6">
                       <h3 className="text-2xl font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{site.name}</h3>
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 shrink-0">
                          <ExternalLink size={18} />
                       </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{site.area}, {site.city}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Redesigned Premium Consolidated Footer */}
      <footer className="bg-slate-950 text-white mt-12 pt-24 pb-12 px-6 md:px-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

            {/* Block 1: Brand Identity */}
            <div className="lg:col-span-5 space-y-10">
              <div className="flex items-center gap-6">
                {logoSrc ? (
                  <img src={logoSrc} alt={builder.companyName} className="h-20 w-20 object-contain rounded-[1.5rem] bg-white p-3 shadow-2xl ring-4 ring-white/5" />
                ) : (
                  <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                    <Building2 size={36} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">{builder.companyName}</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mt-3">Architectural Legacy</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-slate-300 leading-relaxed font-medium max-w-lg">
                  {builder.websiteDetails?.about || `Dedicated to delivering iconic landmarks and high-quality dwelling spaces that redefine luxury and urban sustainability.`}
                </p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Direct Portfolio</span>
                </div>
              </div>
            </div>

            {/* Block 2: Redesigned Connectivity Hub */}
            <div className="lg:col-span-7">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Vertical Contact Column */}
                  <div className="space-y-12">
                     <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500">Connectivity Hub</h4>
                        <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                     </div>

                     <div className="space-y-8">
                        {/* Address */}
                        <div className="group space-y-3">
                           <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-indigo-500" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Global Headquarters</span>
                           </div>
                           <p className="text-base font-bold text-slate-200 leading-snug pl-7 group-hover:text-white transition-colors">
                              {builder.address || 'Principal Corporate Office Address'}
                           </p>
                        </div>

                        {/* Phone */}
                        {builder.websiteDetails?.phone && (
                           <a href={`tel:${builder.websiteDetails.phone}`} className="group block space-y-3">
                              <div className="flex items-center gap-3">
                                 <Phone size={16} className="text-emerald-500" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Direct Line</span>
                              </div>
                              <span className="text-lg font-black text-slate-200 pl-7 group-hover:text-emerald-400 transition-colors block">
                                 {builder.websiteDetails.phone}
                              </span>
                           </a>
                        )}

                        {/* Email */}
                        {builder.websiteDetails?.email && (
                           <a href={`mailto:${builder.websiteDetails.email}`} className="group block space-y-3">
                              <div className="flex items-center gap-3">
                                 <Mail size={16} className="text-indigo-400" />
                                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Support Core</span>
                              </div>
                              <span className="text-lg font-black text-slate-200 pl-7 group-hover:text-indigo-400 transition-colors block truncate">
                                 {builder.websiteDetails.email}
                              </span>
                           </a>
                        )}
                     </div>
                  </div>

                  {/* Digital Presence Card */}
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-10 space-y-10">
                     <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Digital Presence</h4>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Connect on socials</p>
                     </div>

                     {builder.websiteDetails?.socialLinks ? (
                        <div className="flex flex-wrap items-center gap-4">
                           {[
                              { icon: Facebook, key: 'facebook' },
                              { icon: Instagram, key: 'instagram' },
                              { icon: Linkedin, key: 'linkedIn' },
                              { icon: Twitter, key: 'twitter' },
                              { icon: Youtube, key: 'youtube' },
                           ].map((social) => (
                              builder.websiteDetails.socialLinks[social.key] && (
                                 <a 
                                    key={social.key} 
                                    href={builder.websiteDetails.socialLinks[social.key]} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-12 h-12 bg-white/5 hover:bg-white text-slate-500 hover:text-slate-900 rounded-2xl transition-all flex items-center justify-center group shadow-lg ring-1 ring-white/5"
                                 >
                                    <social.icon size={20} className="transition-transform group-hover:scale-110" />
                                 </a>
                              )
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-10">
                           <Globe size={32} className="mx-auto text-slate-700 mb-3" />
                           <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Links Connected</p>
                        </div>
                     )}
                  </div>

               </div>
            </div>
          </div>

          {/* Final Line */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
               © {new Date().getFullYear()} {builder.companyName}
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
