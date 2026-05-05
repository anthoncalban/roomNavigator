/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building as BuildingIcon, ChevronRight, School, MapPin, Phone, Info, Layers, Hammer, AlertTriangle } from 'lucide-react';
import { NEUCampus, Building, College, RoomDetail } from '../types';
import { campusService } from '../services/campusService';

interface DirectoryViewProps {
  campusData: NEUCampus;
  onSelectRoom: (code: string) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ campusData, onSelectRoom }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const rooms = campusService.getRooms();

  const buildingRooms = selectedBuilding ? rooms.filter(r => r.buildingCode === selectedBuilding.code) : [];

  return (
    <div className="space-y-8 pb-24">
      <AnimatePresence mode="wait">
        {!selectedBuilding ? (
          <motion.div
            key="building-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2 flex items-center gap-3 mb-2 px-2">
              <div className="w-1 h-6 bg-neu-navy rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Campus Directory</h3>
            </div>
            {campusData.buildings.map((building) => (
              <button
                key={building.code}
                onClick={() => setSelectedBuilding(building)}
                className="bento-card text-left group flex flex-col justify-between min-h-[200px]"
              >
                <div className="flex items-center justify-between">
                   <div className="p-3 bg-neu-blue-pale rounded-2xl group-hover:bg-neu-navy transition-colors">
                      <BuildingIcon className="w-6 h-6 text-neu-navy group-hover:text-white" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Code: {building.code}</span>
                </div>
                <div>
                   <h4 className="text-2xl font-black text-slate-800 leading-tight mb-1">{building.name}</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {building.colleges.length} {building.colleges.length === 1 ? 'Department' : 'Departments'} • {building.totalFloors} Floors
                   </p>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="building-detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <button
              onClick={() => setSelectedBuilding(null)}
              className="flex items-center gap-2 text-neu-navy font-black text-xs uppercase tracking-widest hover:underline px-2"
            >
              ← Back to Overview
            </button>

            <div className="bento-card border-none navy-gradient text-white p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 rail-text text-white/5 text-6xl">{selectedBuilding.code}</div>
              <h3 className="text-4xl md:text-6xl font-black mb-6 relative z-10 leading-none">{selectedBuilding.name}</h3>
              
              <div className="flex flex-wrap gap-3 relative z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl">
                  <Layers className="w-4 h-4 text-neu-gold" />
                  <span className="text-xs font-black uppercase tracking-wider">{selectedBuilding.totalFloors} Floors</span>
                </div>
                {selectedBuilding.facilities?.map(f => (
                  <div key={f} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl">
                    <Info className="w-4 h-4 text-white/40" />
                    <span className="text-xs font-bold text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-3 px-2">
                <div className="w-1 h-6 bg-neu-gold rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-bold">Colleges & Offices</h3>
              </div>
              {selectedBuilding.colleges.length > 0 ? (
                selectedBuilding.colleges.map((college) => (
                  <div key={college.id} className="bento-card hover:translate-y-0 hover:shadow-none p-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neu-blue-pale rounded-2xl flex items-center justify-center">
                          <School className="w-6 h-6 text-neu-navy" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-800 leading-tight">{college.name}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Layers className="w-4 h-4" />
                          <span>Floor(s): {college.floorsOccupied.join(', ')}</span>
                        </div>
                        {college.contact && (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Phone className="w-4 h-4" />
                            <span>{college.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {college.deanOffice && (
                      <div className="w-full md:w-64 bg-slate-50 p-6 rounded-3xl border border-slate-100 group">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Office</p>
                        <button
                          onClick={() => onSelectRoom(college.deanOffice!)}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="text-2xl font-black text-neu-navy">{college.deanOffice}</span>
                          <div className="w-8 h-8 rounded-full bg-neu-navy text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-[32px] text-slate-400">
                  <p className="font-bold text-[10px] uppercase tracking-widest">No major offices registered</p>
                </div>
              )}
            </div>

            {/* Room Directory for this building */}
            {buildingRooms.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1 h-6 bg-neu-navy rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 font-bold">Room Directory</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {buildingRooms.map(room => (
                    <button
                      key={room.code}
                      onClick={() => onSelectRoom(room.code)}
                      className={`p-4 rounded-2xl border text-center transition-all group hover:border-neu-navy ${room.isUnderMaintenance ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 hover:shadow-lg'}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${room.isUnderMaintenance ? 'text-red-500' : 'text-slate-400'}`}>
                          {room.floor}
                        </span>
                        <span className="text-lg font-black text-slate-800 leading-none">{room.code}</span>
                        {room.isUnderMaintenance ? (
                          <Hammer className="w-3 h-3 text-red-500 mt-1" />
                        ) : (
                          <div className="w-5 h-1 bg-slate-100 rounded-full mt-1 group-hover:bg-neu-navy group-hover:w-8 transition-all" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
