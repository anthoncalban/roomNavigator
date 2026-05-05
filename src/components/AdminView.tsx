/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Plus, Save, Trash2, Edit2, X, School, Building as BuildingIcon, 
  LogOut, Layers, MapPin, Hammer, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { NEUCampus, Building, College, RoomDetail } from '../types';
import { campusService } from '../services/campusService';

interface AdminViewProps {
  campusData: NEUCampus;
  onRefresh: () => void;
  onLogout: () => void;
}

type AdminTab = 'buildings' | 'rooms' | 'colleges';

export const AdminView: React.FC<AdminViewProps> = ({ campusData, onRefresh, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('buildings');
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  
  // Building Form State
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [bForm, setBForm] = useState({ code: '', name: '', totalFloors: 1 });

  // College Form State
  const [isAddingCollege, setIsAddingCollege] = useState<string | null>(null);
  const [editingCollege, setEditingCollege] = useState<{ bCode: string, college: College } | null>(null);
  const [cForm, setCForm] = useState<Partial<College>>({});

  // Room Form State
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDetail | null>(null);
  const [rForm, setRForm] = useState<Partial<RoomDetail>>({ isUnderMaintenance: false });

  useEffect(() => {
    setRooms(campusService.getRooms());
  }, []);

  const refreshRooms = () => {
    setRooms(campusService.getRooms());
  };

  // --- Building Handlers ---
  const handleSaveBuilding = () => {
    if (!bForm.code || !bForm.name) return;
    const building: Building = { 
      code: bForm.code, 
      name: bForm.name, 
      totalFloors: bForm.totalFloors, 
      colleges: editingBuilding ? editingBuilding.colleges : [] 
    };
    if (editingBuilding) {
      campusService.updateBuilding(building);
    } else {
      campusService.addBuilding(building);
    }
    onRefresh();
    resetBForm();
  };

  const resetBForm = () => {
    setBForm({ code: '', name: '', totalFloors: 1 });
    setIsAddingBuilding(false);
    setEditingBuilding(null);
  };

  // --- College Handlers ---
  const handleSaveCollege = (bCode: string) => {
    if (!cForm.id || !cForm.name) return;
    const college: College = {
      id: cForm.id,
      name: cForm.name,
      floorsOccupied: cForm.floorsOccupied || [],
      deanOffice: cForm.deanOffice,
      contact: cForm.contact,
      vision: cForm.vision,
      mission: cForm.mission,
      programs: cForm.programs || [],
      founded: cForm.founded,
      campuses: cForm.campuses || [],
      contactEmail: cForm.contactEmail,
      contactPhone: cForm.contactPhone,
      location: cForm.location
    };

    if (editingCollege) {
      campusService.updateCollege(bCode, college);
    } else {
      campusService.addCollege(bCode, college);
    }
    onRefresh();
    resetCForm();
  };

  const resetCForm = () => {
    setCForm({});
    setIsAddingCollege(null);
    setEditingCollege(null);
  };

  // --- Room Handlers ---
  const handleSaveRoom = () => {
    if (!rForm.code || !rForm.name) return;
    const room: RoomDetail = {
      code: rForm.code,
      name: rForm.name,
      description: rForm.description,
      floor: rForm.floor,
      buildingCode: rForm.buildingCode,
      isUnderMaintenance: rForm.isUnderMaintenance,
      maintenanceMessage: rForm.maintenanceMessage,
      capacity: rForm.capacity,
      chairCount: rForm.chairCount
    };

    if (editingRoom) {
      campusService.updateRoom(editingRoom.code, room);
    } else {
      campusService.addRoom(room);
    }
    refreshRooms();
    resetRForm();
  };

  const resetRForm = () => {
    setRForm({ isUnderMaintenance: false });
    setIsAddingRoom(false);
    setEditingRoom(null);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h3 className="text-3xl font-black text-slate-800">Campus Administration</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Registry & Infrastructure</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-1.5 rounded-[20px] flex gap-2 shadow-inner">
            {(['buildings', 'rooms', 'colleges'] as AdminTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-neu-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center p-4 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'buildings' && (
          <motion.div 
            key="buildings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddingBuilding(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-neu-navy text-white text-xs font-black rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-neu-navy/20"
              >
                <Plus className="w-5 h-5" /> NEW BUILDING
              </button>
            </div>

            {(isAddingBuilding || editingBuilding) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card bg-neu-blue-pale border-none shadow-none p-10">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-black text-xl text-neu-navy">{editingBuilding? 'Update' : 'Initialize'} Building</h4>
                  <button onClick={resetBForm}><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Building Code</label>
                    <input 
                      value={bForm.code} 
                      onChange={e => setBForm({...bForm, code: e.target.value.toUpperCase()})}
                      className="w-full h-14 px-6 bg-white rounded-2xl border-none shadow-sm outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Full Designation</label>
                    <input 
                      value={bForm.name} 
                      onChange={e => setBForm({...bForm, name: e.target.value})}
                      className="w-full h-14 px-6 bg-white rounded-2xl border-none shadow-sm outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                   <button onClick={handleSaveBuilding} className="px-10 py-4 bg-neu-navy text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-neu-navy/20">
                     <Save className="w-5 h-5 mr-2 inline" /> Commit Record
                   </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {campusData.buildings.map(building => (
                <div key={building.code} className="bento-card group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center group-hover:bg-neu-navy/5 transition-colors">
                        <BuildingIcon className="w-8 h-8 text-neu-navy" />
                      </div>
                      <div>
                        <h4 className="font-black text-2xl text-slate-800">{building.name}</h4>
                        <span className="text-[10px] font-black text-neu-navy/40 bg-neu-navy/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{building.code}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingBuilding(building); setBForm({ ...building }); }}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-neu-navy hover:text-white rounded-xl transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => { campusService.deleteBuilding(building.code); onRefresh(); }}
                          className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                  </div>
                  
                  {/* Colleagues/Departments Management */}
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between px-2">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Departments</h5>
                      <button 
                        onClick={() => setIsAddingCollege(building.code)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neu-gold/10 text-neu-gold-dark rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neu-gold hover:text-white transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> Dept
                      </button>
                    </div>

                    {(isAddingCollege === building.code || editingCollege?.bCode === building.code) && (
                      <div className="bg-slate-50 p-8 rounded-[32px] border-2 border-dashed border-slate-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <input value={cForm.name ?? ''} onChange={e => setCForm({...cForm, name: e.target.value})} placeholder="Full Dept Name" className="p-4 bg-white rounded-xl outline-none border border-slate-100 font-bold" />
                           <input value={cForm.id ?? ''} onChange={e => setCForm({...cForm, id: e.target.value})} placeholder="ID (e.g. CICS)" className="p-4 bg-white rounded-xl outline-none border border-slate-100 font-bold" />
                        </div>
                        <button onClick={() => handleSaveCollege(building.code)} className="w-full py-4 bg-neu-navy text-white text-[10px] font-black uppercase tracking-widest rounded-2xl">
                          Save Department Entry
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {building.colleges.map(college => (
                        <div key={college.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group/item">
                           <span className="text-sm font-black text-slate-800">{college.name}</span>
                           <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingCollege({bCode: building.code, college}); setCForm(college); }} className="p-2 text-slate-400 hover:text-neu-navy"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => { campusService.deleteCollege(building.code, college.id); onRefresh(); }} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rooms Management for this building */}
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between px-2">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Building Rooms</h5>
                      <button 
                        onClick={() => {
                          setActiveTab('rooms');
                          setIsAddingRoom(true);
                          setRForm({ buildingCode: building.code });
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-neu-navy/10 text-neu-navy rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neu-navy hover:text-white transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> Room
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {rooms.filter(r => r.buildingCode === building.code).map(room => (
                        <div key={room.code} className="flex flex-col items-center p-3 bg-white border border-slate-100 rounded-2xl group/room relative transition-all hover:border-neu-navy hover:shadow-lg">
                           <span className="text-lg font-black text-slate-800">{room.code}</span>
                           <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter truncate w-full text-center">{room.name}</span>
                           
                           {room.isUnderMaintenance && (
                             <Hammer className="w-2.5 h-2.5 text-red-500 absolute top-2 right-2" />
                           )}

                           <div className="flex gap-1 mt-2 opacity-0 group-hover/room:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setActiveTab('rooms'); setEditingRoom(room); setRForm(room); }} 
                                className="p-1 text-slate-400 hover:text-neu-navy"
                              >
                                <Edit2 className="w-3 h-3"/>
                              </button>
                              <button 
                                onClick={() => { campusService.deleteRoom(room.code); refreshRooms(); }} 
                                className="p-1 text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3"/>
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'rooms' && (
          <motion.div 
            key="rooms"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center px-2">
               <h4 className="text-xl font-black text-slate-800">Room Directory Manager</h4>
               <button onClick={() => setIsAddingRoom(true)} className="flex items-center gap-3 px-8 py-4 bg-neu-navy text-white text-xs font-black rounded-2xl">
                 <Plus className="w-5 h-5" /> NEW ROOM RECORD
               </button>
            </div>

            {(isAddingRoom || editingRoom) && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bento-card border-none bg-neu-blue-pale p-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <h4 className="font-black text-xl text-neu-navy">{editingRoom ? 'Update' : 'Register'} Room</h4>
                    <button onClick={resetRForm}><X className="w-6 h-6 text-slate-400" /></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Room Code (Primary Key)</label>
                       <input value={rForm.code ?? ''} onChange={e => setRForm({...rForm, code: e.target.value.toUpperCase()})} className="w-full h-12 px-6 bg-white rounded-xl border-none shadow-sm outline-none font-bold" placeholder="M415" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Room Display Name</label>
                       <input value={rForm.name ?? ''} onChange={e => setRForm({...rForm, name: e.target.value})} className="w-full h-12 px-6 bg-white rounded-xl border-none shadow-sm outline-none font-bold" placeholder="Networking Lab" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Associated Building</label>
                       <select value={rForm.buildingCode ?? ''} onChange={e => setRForm({...rForm, buildingCode: e.target.value})} className="w-full h-12 px-6 bg-white rounded-xl border-none shadow-sm outline-none font-bold">
                          <option value="">Select Building</option>
                          {campusData.buildings.map(b => (
                            <option key={b.code} value={b.code}>{b.name}</option>
                          ))}
                          <option value="University-wide">University-wide</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Floor Location</label>
                       <input value={rForm.floor ?? ''} onChange={e => setRForm({...rForm, floor: e.target.value})} className="w-full h-12 px-6 bg-white rounded-xl border-none shadow-sm outline-none font-bold" placeholder="4th Floor" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-neu-navy/40 ml-4">Seating Capacity</label>
                       <input value={rForm.capacity ?? ''} onChange={e => setRForm({...rForm, capacity: e.target.value})} className="w-full h-12 px-6 bg-white rounded-xl border-none shadow-sm outline-none font-bold" placeholder="45" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/50">
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <input type="checkbox" id="maintenance" checked={!!rForm.isUnderMaintenance} onChange={e => setRForm({...rForm, isUnderMaintenance: e.target.checked})} className="w-5 h-5 accent-neu-navy" />
                          <label htmlFor="maintenance" className="text-sm font-black text-slate-700 uppercase tracking-widest cursor-pointer">Place Under Maintenance</label>
                       </div>
                       <textarea 
                        value={rForm.maintenanceMessage ?? ''} 
                        onChange={e => setRForm({...rForm, maintenanceMessage: e.target.value})}
                        placeholder="Detail the status (e.g. Renovation ongoing, ETA: May 20)" 
                        className="w-full h-24 p-6 bg-white rounded-2xl border-none shadow-sm outline-none font-bold text-sm resize-none"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">General Observations</label>
                       <textarea 
                        value={rForm.description ?? ''} 
                        onChange={e => setRForm({...rForm, description: e.target.value})}
                        placeholder="Room features, inventory details, etc." 
                        className="w-full h-24 p-6 bg-white rounded-2xl border-none shadow-sm outline-none font-bold text-sm resize-none"
                       />
                    </div>
                 </div>

                 <div className="flex justify-end pt-4">
                    <button onClick={handleSaveRoom} className="px-10 py-5 bg-neu-navy text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-neu-navy/20">
                      Commit Room Record
                    </button>
                 </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {rooms.map(room => (
                 <div key={room.code} className="bento-card p-6 flex flex-col justify-between group">
                    <div className="space-y-4">
                       <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-xl ${room.isUnderMaintenance ? 'bg-red-50 text-red-500' : 'bg-neu-blue-pale text-neu-navy'}`}>
                             {room.isUnderMaintenance ? <Hammer className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => { setEditingRoom(room); setRForm(room); }} className="p-1.5 text-slate-400 hover:text-neu-navy"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => { campusService.deleteRoom(room.code); refreshRooms(); }} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-slate-800 leading-tight">{room.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.code} • {room.floor}</p>
                       </div>
                    </div>
                    {room.isUnderMaintenance && (
                       <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest">{room.maintenanceMessage || 'Restricted Access'}</span>
                       </div>
                    )}
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'colleges' && (
          <motion.div 
            key="colleges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
             <div className="px-2 mb-8">
               <h4 className="text-xl font-black text-slate-800">Master Academic Editor</h4>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Update Vision, Mission & Global Programs</p>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {campusData.buildings.flatMap(b => b.colleges.map(c => ({...c, bCode: b.code, bName: b.name}))).map(college => {
                   const isEditing = editingCollege?.college.id === college.id;
                   
                   return (
                     <div key={college.id} className={`bento-card p-10 transition-all ${isEditing ? 'ring-2 ring-neu-navy' : ''}`}>
                        <div className="flex items-start justify-between mb-10">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-neu-navy">
                                 <School className="w-8 h-8" />
                              </div>
                              <div>
                                 <h4 className="text-2xl font-black text-slate-800">{college.name}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-neu-navy/40 bg-neu-navy/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{college.id}</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">• {college.bName}</span>
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => {
                               if (isEditing) {
                                 resetCForm();
                               } else {
                                 setEditingCollege({ bCode: college.bCode, college });
                                 setCForm(college);
                               }
                             }}
                             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-slate-100 text-slate-400' : 'bg-neu-navy text-white'}`}
                           >
                              {isEditing ? 'Cancel Edit' : 'Modify Record'}
                           </button>
                        </div>

                        {isEditing ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Strategic Vision</label>
                                   <textarea 
                                    className="w-full h-32 p-6 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-neu-navy font-bold text-sm resize-none"
                                    value={cForm.vision ?? ''}
                                    onChange={e => setCForm({...cForm, vision: e.target.value})}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Core Mission</label>
                                   <textarea 
                                    className="w-full h-32 p-6 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-neu-navy font-bold text-sm resize-none"
                                    value={cForm.mission ?? ''}
                                    onChange={e => setCForm({...cForm, mission: e.target.value})}
                                   />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Programs Offered (One per line)</label>
                                <textarea 
                                 className="w-full h-32 p-6 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-neu-navy font-bold text-sm resize-none"
                                 value={cForm.programs?.join('\n') ?? ''}
                                 onChange={e => setCForm({...cForm, programs: e.target.value.split('\n').filter(p => p.trim())})}
                                />
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Founded Year</label>
                                   <input value={cForm.founded ?? ''} onChange={e => setCForm({...cForm, founded: e.target.value})} className="w-full h-12 px-6 bg-slate-50 rounded-xl outline-none border-none focus:ring-1 focus:ring-neu-navy font-bold" />
                                </div>
                                <div>
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Primary Email</label>
                                   <input value={cForm.contactEmail ?? ''} onChange={e => setCForm({...cForm, contactEmail: e.target.value})} className="w-full h-12 px-6 bg-slate-50 rounded-xl outline-none border-none focus:ring-1 focus:ring-neu-navy font-bold" />
                                </div>
                                <div>
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Office Phone</label>
                                   <input value={cForm.contactPhone ?? ''} onChange={e => setCForm({...cForm, contactPhone: e.target.value})} className="w-full h-12 px-6 bg-slate-50 rounded-xl outline-none border-none focus:ring-1 focus:ring-neu-navy font-bold" />
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Campuses (One per line)</label>
                                   <textarea 
                                    className="w-full h-24 p-6 bg-slate-50 rounded-2xl outline-none border-none focus:ring-2 focus:ring-neu-navy font-bold text-sm resize-none"
                                    value={cForm.campuses?.join('\n') ?? ''}
                                    onChange={e => setCForm({...cForm, campuses: e.target.value.split('\n').filter(p => p.trim())})}
                                    placeholder="Main Campus&#10;Rizal Branch"
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Office Specific Location</label>
                                   <input 
                                    value={cForm.location ?? ''} 
                                    onChange={e => setCForm({...cForm, location: e.target.value})} 
                                    className="w-full h-12 px-6 bg-slate-50 rounded-xl outline-none border-none focus:ring-1 focus:ring-neu-navy font-bold" 
                                    placeholder="2nd Floor, Main Building"
                                   />
                                </div>
                             </div>

                             <div className="flex justify-end">
                                <button onClick={() => handleSaveCollege(college.bCode)} className="px-12 py-5 bg-neu-navy text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-neu-navy/20">
                                   Commit Academic Details
                                </button>
                             </div>
                          </motion.div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Academic Overview</h5>
                                <p className="text-sm font-bold text-slate-600 italic">"{college.vision || 'Strategic vision pending initialization...'}"</p>
                             </div>
                             <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Offerings</h5>
                                <div className="flex flex-wrap gap-2">
                                   {college.programs?.slice(0, 3).map((p, idx) => (
                                     <span key={idx} className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">{p}</span>
                                   ))}
                                   {college.programs && college.programs.length > 3 && (
                                     <span className="px-3 py-1 bg-neu-navy text-white rounded-full text-[9px] font-bold uppercase tracking-widest">+{college.programs.length - 3} More</span>
                                   )}
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                   );
                })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
