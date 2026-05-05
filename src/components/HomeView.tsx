/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Building, Users, Search, BookOpen } from 'lucide-react';
import { Building as BuildingType } from '../types';

interface HomeViewProps {
  onStartSearch: () => void;
  onViewDirectory: () => void;
  featuredBuildings: BuildingType[];
}

export function HomeView({ onStartSearch, onViewDirectory, featuredBuildings }: HomeViewProps) {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden navy-gradient flex items-center px-8 md:px-16">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 rail-text text-[15rem] leading-none pointer-events-none select-none">
          NEU
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <div className="w-2 h-2 bg-neu-gold rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Campus Live Navigator</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
          >
            Navigate your <br />
            <span className="text-neu-gold">university life.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl font-medium max-w-md"
          >
            Find any room, office, or facility across New Era University with precision and speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={onStartSearch}
              className="flex items-center gap-3 px-8 py-4 bg-white text-neu-navy rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              Start Searching <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onViewDirectory}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              View Directory
            </button>
          </motion.div>
        </div>

        {/* Floating Elements (Decorative) */}
        <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 space-y-4">
           <motion.div 
             animate={{ y: [0, -10, 0] }} 
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="w-48 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4"
           >
              <div className="w-10 h-10 bg-neu-gold rounded-xl flex items-center justify-center">
                 <MapPin className="w-5 h-5 text-neu-navy" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-neu-gold uppercase tracking-widest">Main Building</p>
                 <p className="text-xs font-bold text-white">4th Floor Wing</p>
              </div>
           </motion.div>
           <motion.div 
             animate={{ y: [0, 10, 0] }} 
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="w-48 h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 translate-x-8"
           >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">SOM 201</p>
                 <p className="text-xs font-bold text-white">Capacity: 45</p>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Search, title: 'Smart Search', desc: 'Instant room finding by code', color: 'bg-neu-blue-pale', text: 'text-neu-navy', action: onStartSearch },
          { icon: BookOpen, title: 'Directory', desc: 'Browse all buildings & depts', color: 'bg-slate-50', text: 'text-slate-800', action: onViewDirectory },
          { icon: Building, title: 'Campus Map', desc: 'Full building overview', color: 'bg-neu-gold/10', text: 'text-neu-gold-dark', action: onViewDirectory },
        ].map((item, i) => (
          <motion.button
            key={item.title}
            onClick={item.action}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className={`${item.color} p-8 rounded-[32px] text-left hover:scale-[1.02] transition-all group bento-card border-none shadow-none`}
          >
            <div className={`w-12 h-12 ${item.text} bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-black ${item.text} mb-2`}>{item.title}</h3>
            <p className="text-slate-500 font-medium">{item.desc}</p>
          </motion.button>
        ))}
      </section>

      {/* Featured Buildings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <div className="w-1 h-6 bg-neu-gold rounded-full" />
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Featured Locations</h3>
          </div>
          <button onClick={onViewDirectory} className="text-[10px] font-black uppercase tracking-[0.2em] text-neu-navy hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBuildings.slice(0, 2).map((building, i) => (
            <motion.div
              key={building.code}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bento-card group flex flex-col justify-between min-h-[250px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 rail-text text-slate-100 text-7xl opacity-50 group-hover:text-neu-navy/5 transition-colors">{building.code}</div>
              <div className="relative z-10 flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-neu-blue-pale rounded-2xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-neu-navy" />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-slate-800 leading-tight">{building.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{building.colleges.length} Departments</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex -space-x-2">
                   {building.colleges.slice(0, 3).map((c, idx) => (
                     <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[8px] font-black text-neu-navy shadow-sm">
                       {c.id.substring(0, 2)}
                     </div>
                   ))}
                   {building.colleges.length > 3 && (
                     <div className="w-8 h-8 rounded-full bg-neu-navy text-white text-[8px] font-black flex items-center justify-center border-2 border-slate-50">
                       +{building.colleges.length - 3}
                     </div>
                   )}
                </div>
                <button 
                  onClick={onViewDirectory}
                  className="p-3 bg-slate-50 rounded-xl group-hover:bg-neu-navy group-hover:text-white transition-all shadow-sm"
                >
                   <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Footer Info */}
      <footer className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">NEU Campus Navigator</p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-center md:text-right">
          Official University Infrastructure Terminal<br />
          Data Integrity Verified • 2026
        </p>
      </footer>
    </div>
  );
}
