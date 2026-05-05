/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, MapPin, Phone, Mail, BookOpen, Target, Info, ChevronDown, ChevronUp, History, Globe, Search } from 'lucide-react';
import { campusService } from '../services/campusService';
import { College } from '../types';

export function CollegesView() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const campusData = campusService.getCampusData();

  const allCollegesInCampus = campusData.buildings.flatMap(b => b.colleges.map(c => ({...c, buildingName: b.name})));

  const filteredColleges = allCollegesInCampus.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-1 h-8 bg-neu-gold rounded-full" />
             <h2 className="text-4xl font-black text-slate-800 tracking-tight">Academic Registry</h2>
           </div>
           <p className="text-slate-500 font-medium">Explore colleges and academic programs at New Era University</p>
        </div>
        
        <div className="relative group">
          <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-neu-navy transition-colors" />
          <input 
            type="text"
            placeholder="Filter by college name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-80 h-14 pl-12 pr-6 bg-white rounded-2xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-neu-navy outline-none font-bold text-slate-800 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredColleges.map((college) => {
          const isSelected = selectedCollege === college.id;
          
          return (
            <motion.div
              key={college.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bento-card flex flex-col group transition-all duration-500 ${isSelected ? 'ring-2 ring-neu-navy shadow-2xl' : 'hover:shadow-xl'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-neu-navy text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-neu-gold/10 group-hover:text-neu-gold-dark'}`}>
                    <School className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">{college.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{college.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCollege(isSelected ? null : college.id)}
                  className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-neu-navy text-white rotate-180' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-2 mb-4">
                {college.founded && (
                   <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <History className="w-3 h-3" /> Est. {college.founded}
                   </div>
                )}
                {college.campuses && (
                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <Globe className="w-3 h-3" /> {college.campuses.length} Campuses
                   </div>
                )}
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 border-t border-slate-100 space-y-8">
                      {/* Vision & Mission */}
                      {(college.vision || college.mission) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {college.vision && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-neu-navy">
                                <Target className="w-4 h-4" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Our Vision</h4>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-4">
                                "{college.vision}"
                              </p>
                            </div>
                          )}
                          {college.mission && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-neu-navy">
                                <Info className="w-4 h-4" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Our Mission</h4>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 leading-relaxed border-l-2 border-slate-100 pl-4">
                                {college.mission}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Programs */}
                      {college.programs && college.programs.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Academic Programs</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {college.programs.map((program, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl group/prog hover:bg-neu-blue-pale transition-colors cursor-default">
                                <div className="w-1.5 h-1.5 bg-neu-gold rounded-full group-hover/prog:scale-125 transition-transform" />
                                <span className="text-[11px] font-bold text-slate-700">{program}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Campus & Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Locations</h4>
                          <div className="space-y-3">
                            {college.campuses?.map((campus, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-slate-600">{campus}</p>
                              </div>
                            ))}
                            {college.location && (
                               <div className="flex items-start gap-3 p-3 bg-neu-gold/5 rounded-xl border border-neu-gold/10">
                                 <Info className="w-4 h-4 text-neu-gold shrink-0 mt-0.5" />
                                 <p className="text-[10px] font-black text-neu-gold-dark uppercase tracking-widest">{college.location}</p>
                               </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Connect</h4>
                          <div className="space-y-3">
                            {college.contactEmail && (
                              <a href={`mailto:${college.contactEmail}`} className="flex items-center gap-3 text-slate-600 hover:text-neu-navy transition-colors">
                                <Mail className="w-4 h-4 text-slate-300" />
                                <span className="text-xs font-bold">{college.contactEmail}</span>
                              </a>
                            )}
                            {college.contactPhone && (
                              <div className="flex items-center gap-3 text-slate-600">
                                <Phone className="w-4 h-4 text-slate-300" />
                                <span className="text-xs font-bold">{college.contactPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredColleges.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
             <BookOpen className="w-8 h-8 text-slate-200" />
           </div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching colleges found</p>
        </div>
      )}
    </div>
  );
}
