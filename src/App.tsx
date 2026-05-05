/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Home as HomeIcon, Search, Info, MapPin, Layers, Users, Package, Armchair, ChevronRight, Building, BookOpen, Settings, School } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { campusService } from './services/campusService';
import { NEUCampus, ExpandedRoom, RoomDetail } from './types';
import { DirectoryView } from './components/DirectoryView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { HomeView } from './components/HomeView';
import { CollegesView } from './components/CollegesView';
import { Hammer, AlertTriangle, CheckCircle } from 'lucide-react';

// Building mapping - Fallback for search
const BUILDING_LEGEND: Record<string, string> = {
  'M': 'Main Building',
  'U': 'University Hall',
  'UH': 'University Hall',
  'UHALL': 'University Hall',
  'U-HALL': 'University Hall',
  'SOM': 'School of Management',
  'PSB': 'Professionals School Building',
  'IS': 'Integrated School',
  'MPH': 'Main Building',
  'MPH5': 'Main Building',
  'MFIELD': 'Main Building Field',
  'ISFIELD': 'IS Building Field',
  'PSBFIELD': 'Professionals School Building Field',
  'T.B.A.': 'To Be Announced',
  'TBA': 'To Be Announced',
  'B': 'Main Building B',
  'SHOP': 'Workshop/Shop Area',
};

// Existing room details (Full restoration)
const ROOM_DETAILS: Record<string, { name: string; description?: string; floor?: string }> = {
  'M101': { name: 'Computer Laboratory 1' },
  'M102': { name: 'Computer Laboratory 2' },
  'M103': { name: 'AutoCAD Room', description: 'Computer Laboratory' },
  'M104': { name: 'Mac Lab', description: 'Computer Laboratory' },
  'M105': { name: 'Computer Laboratory 5' },
  'M106': { name: 'Computer Laboratory 6' },
  'M107': { name: 'Computer Laboratory 7' },
  'M108': { name: 'Computer Laboratory 8' },
  'M109': { name: 'Computer Laboratory 9' },
  'M110': { name: 'Computer Laboratory 10' },
  'M111': { name: 'Computer Laboratory 11' },
  'M112': { name: 'NEU Bookstore' },
  'M113A': { name: 'Building Administration Office' },
  'M116A': { name: 'Property Office', description: 'Near MField' },
  'M117': { name: 'Biology Laboratory' },
  'M120': { name: 'DISD / New CSD Office', description: 'Digital Infrastructure & Service Department. This is the NEW location.' },
  'M121': { name: 'Old CSD Office', description: 'This is the OLD location. The office has moved to M120.' },
  'M124': { name: 'CEA & Dean\'s Office', description: 'College of Engineering and Architecture' },
  'M128': { name: 'Engineering Laboratory Workshop', description: 'Engineering Facility' },
  'M132': { name: 'Surveying Laboratory', description: 'Engineering Facility. SHOP 2' },
  'M133': { name: 'Civil Engineering Technology Laboratory', description: 'Engineering Facility. SHOP 3' },
  'M134': { name: 'Fluid Mechanics & Hydraulics Laboratory', description: 'Engineering Facility. SHOP 4' },
  'M240': { name: 'Nursing Arts Laboratory', floor: '2nd Floor' },
  'M226': { name: 'Short Stay Surgical Unit (SSSU)', floor: '2nd Floor' },
  'M241': { name: 'College of Nursing Faculty Room (CON)', floor: '2nd Floor' },
  'M228': { name: 'Procurement Office', floor: '2nd Floor' },
  'M232': { name: 'Physics Laboratory', floor: '2nd Floor' },
  'M231': { name: 'Auditing Department', floor: '2nd Floor' },
  'M233': { name: 'College Registrar\'s Office', description: 'Center part of Main Building', floor: '2nd Floor' },
  'M235': { name: 'Clinic', floor: '2nd Floor' },
  'M214': { name: 'Guidance and Counseling Center', floor: '2nd Floor' },
  'M216': { name: 'Registrar and Records Management Office', floor: '2nd Floor' },
  'M217': { name: 'Micro Biology Laboratory', floor: '2nd Floor' },
  'M210': { name: 'Industrial/Methods/Ergonomics Engineering Laboratory', floor: '2nd Floor' },
  'M209B': { name: 'National Service Training Program (NSTP Office)', floor: '2nd Floor' },
  'M208': { name: 'Information Office', floor: '2nd Floor' },
  'M207': { name: 'Office of International Students Affairs', floor: '2nd Floor' },
  'M206': { name: 'ECE Laboratory 3', floor: '2nd Floor' },
  'M243': { name: 'MPH/5', floor: '2nd Floor' },
  'M202': { name: 'Accounting Department', floor: '2nd Floor' },
  'M201': { name: 'Finance Department', floor: '2nd Floor' },
  'M308': { name: 'NEU Maintenance', floor: '3rd Floor' },
  'M316': { name: 'University Ministers Office', floor: '3rd Floor' },
  'M317': { name: 'Office of the Vice President for Administration', floor: '3rd Floor' },
  'M322': { name: 'NEU Multimedia Office (Photo Studio)', floor: '3rd Floor' },
  'M324A': { name: 'Psychology Laboratory A', floor: '3rd Floor' },
  'M329': { name: 'Students Consultation and Counseling Room', floor: '3rd Floor' },
  'M330': { name: 'Office of Secretary', floor: '3rd Floor' },
  'M431': { name: 'Astrophysics and Astrostatistics Laboratory', description: 'Telescope Maintenance and Optics Laboratory', floor: '4th Floor' },
  'M430': { name: 'Office of Student Discipline (OSD)', floor: '4th Floor' },
  'M432': { name: 'Chemistry Laboratory / Police Photography Laboratory', floor: '4th Floor' },
  'M427': { name: 'Crime Science Room', floor: '4th Floor' },
  'M422': { name: 'Forensic Ballistics Laboratory', floor: '4th Floor' },
  'M421': { name: 'Lie Detection and Interrogation Room', floor: '4th Floor' },
  'M420': { name: 'Questioned Documents and Dactyloscopy', floor: '4th Floor' },
  'M418': { name: 'College of Criminology (COC)', floor: '4th Floor' },
  'M417': { name: 'Criminology Student Society Office', floor: '4th Floor' },
  'M434': { name: 'Office of Student Affairs and Services (OSAS)', floor: '4th Floor' },
  'M415': { name: 'CICS Department', floor: '4th Floor' },
  'M328': { name: 'College of Communication (COC)', description: 'Temporarily located here. NEW location (Old location: nearby M101)', floor: '3rd Floor' },
  'SHOP5': { name: 'Construction Matls. and Testing Laboratory', description: 'Engineering Facility' },
};

// Special named locations (Full restoration)
const SPECIAL_LOCATIONS: Record<string, any> = {
  'MESS HALL': { code: 'MESS HALL', building: 'Main Building', floor: 'Ground Floor', name: 'NEU Main Canteen', abbreviation: 'M' },
  'CANTEEN': { code: 'CANTEEN', building: 'Main Building', floor: 'Ground Floor', name: 'NEU Mess Hall', abbreviation: 'M' },
  'ROTC': { code: 'ROTC OFFICE', building: 'Main Building', floor: 'Under Main Stage', name: 'ROTC Office', abbreviation: 'M', description: 'Located under the main building stage' },
  'BOOKSTORE': { code: 'M112', building: 'Main Building', floor: '1st Floor', name: 'NEU Bookstore', abbreviation: 'M' },
  'DISD': { code: 'M120', building: 'Main Building', floor: '1st Floor', name: 'Digital Infrastructure & Service Department', abbreviation: 'M' },
  'CSD': { code: 'M120', building: 'Main Building', floor: '1st Floor', name: 'New CSD Office', abbreviation: 'M', description: 'NEW location at M120' },
  'COA': { code: 'M124', building: 'Main Building', floor: '1st Floor', name: 'College of Engineering and Architecture', abbreviation: 'M' },
  'COC': { code: 'M328', building: 'Main Building', floor: '3rd Floor', name: 'College of Communication', abbreviation: 'M', description: 'NEW temporary location' },
  'BAO': { code: 'M113A', building: 'Main Building', floor: '1st Floor', name: 'Building Administration Office', abbreviation: 'M' },
  'BUILDING AD': { code: 'M113A', building: 'Main Building', floor: '1st Floor', name: 'Building Administration Office', abbreviation: 'M' },
  'ENGINEERING': { code: 'COA', building: 'Main Building', floor: 'Multiple', name: 'Engineering Facilities', abbreviation: 'M', description: 'Search results for Engineering' },
  'ADMISSION OF COLLEGES': { code: 'M228', building: 'Main Building', floor: '2nd Floor', name: 'Admission of Colleges', abbreviation: 'M', description: 'Nearby M228' },
  'ADMISSION SCHOLARSHIPS': { code: 'M233', building: 'Main Building', floor: '2nd Floor', name: 'Admission, Scholarships and Financial Assistance Office', abbreviation: 'M', description: 'Center part of Main Building' },
  'GYM': { code: 'M244', building: 'Main Building', floor: '2nd Floor', name: 'Gym', abbreviation: 'M', description: 'Nearby M244' },
  'SPORTS DEPARTMENT': { code: 'M306', building: 'Main Building', floor: '3rd Floor', name: 'Sports Department', abbreviation: 'M', description: 'Nearby M306' },
  'MULTIMEDIA ROOM B': { code: 'M320', building: 'Main Building', floor: '3rd Floor', name: 'Multimedia Room B / Office', abbreviation: 'M', description: 'In front of M320' },
  'CAS': { code: 'M327', building: 'Main Building', floor: '3rd Floor', name: 'College of Arts and Sciences Office', abbreviation: 'M', description: 'Nearby M327' },
  'PRESIDENT': { code: '3RD FLOOR', building: 'Main Building', floor: '3rd Floor', name: 'Office of the President', abbreviation: 'M' },
  'STUDENT LOUNGE': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'Student Lounge', abbreviation: 'M', description: 'Center part of Main Building' },
  'NEU BASKETBALL GYM': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'NEU Basketball Gym', abbreviation: 'M', inventory: ['Court', 'Bench'], capacity: '' },
  'BASKETBALL GYM': { code: '4TH FLOOR', building: 'Main Building', floor: '4th Floor', name: 'NEU Basketball Gym', abbreviation: 'M', inventory: ['Court', 'Bench'], capacity: '' },
  'SECRET GARDEN': { code: 'BESIDE MAIN', building: 'Main Building', floor: 'Ground', name: 'Secret Garden', abbreviation: 'M', description: 'Beside Main Building' },
  'CICS': { code: 'M415', building: 'Main Building', floor: '4th Floor', name: 'CICS Department', abbreviation: 'M' },
  'CEA': { code: 'M124', building: 'Main Building', floor: '1st Floor', name: 'College of Engineering and Architecture', abbreviation: 'M' },
  'TBA': { code: 'TBA', building: 'University-wide', floor: 'N/A', name: 'To Be Announced', abbreviation: 'TBA', description: 'Location is yet to be announced' },
  'CASHIER': { code: 'CASHIER', building: 'Main Building', floor: '2nd Floor', name: 'Cashier', abbreviation: 'M', description: 'Located at the second floor of Main Building' },
};

type ViewMode = 'home' | 'search' | 'directory' | 'colleges' | 'admin';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [campusData, setCampusData] = useState<NEUCampus>(campusService.getCampusData());
  const [rooms, setRooms] = useState<RoomDetail[]>(campusService.getRooms());
  const [recent, setRecent] = useState<string[]>(['SOM201', 'M415', 'M124', 'PSB101', 'M120']);

  const refreshData = () => {
    setCampusData(campusService.getCampusData());
    setRooms(campusService.getRooms());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const selectRoomFromDirectory = (code: string) => {
    setInput(code);
    setViewMode('search');
  };

  const results = useMemo((): ExpandedRoom[] => {
    if (!input.trim()) return [];

    const upperInput = input.trim().toUpperCase();
    const foundResults: ExpandedRoom[] = [];

    // Helper to build a room object
    const buildRoom = (code: string, prefix: string, digits: string, suffix: string, defaultBuilding: string): ExpandedRoom => {
      // Check if room exists in dynamic rooms first
      const dynamicRoom = rooms.find(r => r.code.toUpperCase() === code.toUpperCase() || (prefix + digits).toUpperCase() === r.code.toUpperCase());
      const roomDetail = ROOM_DETAILS[code] || ROOM_DETAILS[prefix + digits];
      
      const buildingFromService = campusData.buildings.find(b => b.code === prefix) || 
                                campusData.buildings.find(b => b.name === (dynamicRoom?.buildingCode || defaultBuilding));
      
      const buildingName = buildingFromService ? buildingFromService.name : (dynamicRoom?.buildingCode || defaultBuilding);

      let roomName = dynamicRoom?.name || roomDetail?.name || `Room ${digits || suffix || code}`;
      let finalBuildingName = buildingName;
      
      if (suffix === 'B' && prefix !== 'B') {
        finalBuildingName = `${finalBuildingName} (Building B)`;
      }

      let floor = dynamicRoom?.floor || 'N/A';
      if (floor === 'N/A') {
        if (roomDetail?.floor) {
          floor = roomDetail.floor;
        } else if (digits) {
          const floorDigit = digits.charAt(0);
          let floorSfx = 'th';
          if (floorDigit === '1') floorSfx = 'st';
          else if (floorDigit === '2') floorSfx = 'nd';
          else if (floorDigit === '3') floorSfx = 'rd';
          floor = `${floorDigit}${floorSfx} Floor`;
        }
      }

      return {
        code: dynamicRoom?.code || code,
        name: roomName,
        building: finalBuildingName,
        floor,
        room: digits || 'N/A',
        abbreviation: prefix || dynamicRoom?.buildingCode || 'N/A',
        capacity: dynamicRoom?.capacity || '30-40',
        inventory: dynamicRoom?.description ? [dynamicRoom.description] : (roomDetail?.description ? [roomDetail.description, 'Chairs', 'Whiteboard'] : ['Chairs', 'Whiteboard', 'Projector']),
        chairCount: 40,
        description: dynamicRoom?.description || roomDetail?.description,
        isUnderMaintenance: dynamicRoom?.isUnderMaintenance,
        maintenanceMessage: dynamicRoom?.maintenanceMessage
      };
    };

    // 1. Check special locations
    for (const [key, loc] of Object.entries(SPECIAL_LOCATIONS)) {
      if (upperInput.includes(key) || key.includes(upperInput)) {
        foundResults.push({
          code: loc.code,
          name: loc.name,
          building: loc.building,
          floor: loc.floor,
          room: loc.code,
          abbreviation: loc.abbreviation,
          capacity: loc.capacity !== undefined ? loc.capacity : 'N/A',
          inventory: loc.inventory || (loc.description ? [loc.description] : []),
          chairCount: null,
          description: loc.description
        });
      }
    }

    // 2. Check dynamic rooms from service
    rooms.forEach(r => {
      const matchCode = r.code.toUpperCase().includes(upperInput);
      const matchName = r.name.toUpperCase().includes(upperInput);
      const matchDesc = r.description?.toUpperCase().includes(upperInput);
      
      if (matchCode || matchName || matchDesc) {
        if (!foundResults.some(res => res.code === r.code)) {
          const m = r.code.match(/^([A-Z]+)(\d*)([A-Z]*)$/);
          if (m) {
            foundResults.push(buildRoom(r.code, m[1], m[2], m[3], r.buildingCode || 'Unknown Building'));
          } else {
            foundResults.push(buildRoom(r.code, '', '', '', r.buildingCode || 'Unknown Building'));
          }
        }
      }
    });

    // 3. Check legacy ROOM_DETAILS (Search by name and description)
    for (const [code, detail] of Object.entries(ROOM_DETAILS)) {
      const matchName = detail.name.toUpperCase().includes(upperInput);
      const matchDesc = detail.description?.toUpperCase().includes(upperInput);
      if (matchName || matchDesc || code === upperInput) {
        if (!foundResults.some(r => r.code === code)) {
          const m = code.match(/^([A-Z]+)(\d*)([A-Z]*)$/);
          if (m) {
            foundResults.push(buildRoom(code, m[1], m[2], m[3], BUILDING_LEGEND[m[1]] || 'Main Building'));
          } else {
            // Non-standard code, still try to build
            foundResults.push(buildRoom(code, 'M', '', '', 'Main Building'));
          }
        }
      }
    }

    // 4. Check campusData
    campusData.buildings.forEach(b => {
      if (b.name.toUpperCase().includes(upperInput) || b.code === upperInput) {
        if (!foundResults.some(r => r.code === b.code)) {
          foundResults.push(buildRoom(b.code, b.code, '', '', b.name));
        }
      }
      b.colleges.forEach(c => {
        if (c.name.toUpperCase().includes(upperInput) || c.id === upperInput) {
          if (c.deanOffice) {
             const match = c.deanOffice.match(/^([A-Z]+)(\d*)([A-Z]*)$/);
             if (match && !foundResults.some(r => r.code === c.deanOffice)) {
               foundResults.push(buildRoom(c.deanOffice, match[1], match[2], match[3], b.name));
             }
          }
        }
      });
    });

    // 5. Regex match
    const match = upperInput.match(/^([A-Z.-]+)(\d*)([A-Z]*)$/);
    if (match) {
      let [_, prefix, digits, suffix] = match;
      let buildingName = BUILDING_LEGEND[prefix] || 'New Building';
      const code = upperInput;
      if (!foundResults.some(r => r.code === code)) {
        foundResults.push(buildRoom(code, prefix, digits, suffix, buildingName));
      }
    }

    return Array.from(new Map(foundResults.map(item => [item.code, item])).values());
  }, [input, campusData, rooms]);

  const expanded = results.length === 1 ? results[0] : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFDFD] selection:bg-neu-gold/20 selection:text-neu-navy">
      {/* Sidebar Navigation - Desktop */}
      <nav className="hidden md:flex w-72 flex-col navy-gradient text-white p-8 relative overflow-hidden shrink-0">
        <div className="absolute top-20 -left-10 rail-text text-8xl text-white/10 select-none">
          NEU NAVIGATOR
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-neu-gold rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <MapPin className="w-5 h-5 text-neu-navy" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase">NEU</h1>
              <p className="text-[10px] font-black tracking-widest text-neu-gold/60 uppercase">Navigator</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'home', label: 'Dashboard', icon: HomeIcon },
              { id: 'search', label: 'Quick Search', icon: Search },
              { id: 'directory', label: 'Directory', icon: BookOpen },
              { id: 'colleges', label: 'Colleges', icon: School },
              { id: 'admin', label: 'Management', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  viewMode === tab.id 
                    ? 'bg-white/15 text-white shadow-lg backdrop-blur-md' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${viewMode === tab.id ? 'text-neu-gold' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Popular Spots</p>
            <div className="space-y-1">
              {recent.slice(0, 4).map(spot => (
                <button
                  key={spot}
                  onClick={() => { setInput(spot); setViewMode('search'); }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all"
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-6 navy-gradient text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neu-gold rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-neu-navy" />
          </div>
          <h1 className="text-lg font-black tracking-tight uppercase">NEU Navigator</h1>
        </div>
        <button onClick={() => setViewMode('admin')} className="p-2 bg-white/10 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto min-h-0">
        <div className={`mx-auto w-full ${viewMode === 'home' ? 'max-w-6xl' : 'max-w-4xl'}`}>
          <AnimatePresence mode="wait">
            {viewMode === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <HomeView 
                  onStartSearch={() => setViewMode('search')} 
                  onViewDirectory={() => setViewMode('directory')}
                  featuredBuildings={campusData.buildings}
                />
              </motion.div>
            )}

            {viewMode === 'search' && (
              <motion.div 
                key="search" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Search Bar Section */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-neu-navy to-neu-gold opacity-5 group-hover:opacity-15 blur-2xl transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Where are you headed?"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-16 md:h-24 px-8 md:px-12 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border-2 border-slate-100 focus:outline-none focus:border-neu-navy transition-all text-xl md:text-3xl font-black text-slate-800 input-glow"
                      autoFocus
                    />
                    <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-neu-navy rounded-[24px] text-white shadow-xl shadow-neu-navy/20">
                      <Search className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                </div>

                {results.length > 0 ? (
                  expanded ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      {/* Main Room Card - Large Bento Box */}
                      <div className="md:col-span-8 bento-card border-none navy-gradient text-white flex flex-col justify-between min-h-[300px] md:min-h-[400px]">
                        <div>
                          <div className="flex items-center gap-2 text-neu-gold/60 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
                            <Layers className="w-3 h-3" /> {expanded.building} • {expanded.floor}
                          </div>
                          
                          {expanded.isUnderMaintenance && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/30 mb-4">
                              <Hammer className="w-3 h-3 text-red-500" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-red-100">Under Maintenance</span>
                            </div>
                          )}

                          <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-4">{expanded.code}</h2>
                        </div>
                        <div>
                          <p className="text-2xl md:text-4xl font-bold text-white mb-2">{expanded.name}</p>
                          {expanded.description && (
                            <p className="text-white/60 text-sm md:text-base max-w-md italic mb-4">{expanded.description}</p>
                          )}
                          
                          {expanded.isUnderMaintenance && expanded.maintenanceMessage && (
                            <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-neu-gold shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-black uppercase text-neu-gold/60 tracking-widest mb-1">Notice</p>
                                <p className="text-sm text-white/80">{expanded.maintenanceMessage}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats Column */}
                      <div className="md:col-span-4 flex flex-col gap-5">
                        <div className="bento-card flex-1 flex flex-col justify-center items-center text-center">
                          <div className="p-3 bg-neu-blue-pale rounded-2xl mb-4">
                            <Users className="w-6 h-6 text-neu-navy" />
                          </div>
                          <p className="text-4xl font-black text-slate-800">{expanded.capacity}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Capacity / Pax</p>
                        </div>
                        <div className="bento-card flex-1 bg-neu-gold p-6 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />
                           <p className="text-[10px] font-black uppercase text-neu-navy/40 mb-3 tracking-widest relative z-10 text-center">Inventory</p>
                           <div className="flex flex-wrap justify-center gap-2 relative z-10">
                             {expanded.inventory.map((it, idx) => (
                               <span key={idx} className="px-3 py-1 bg-neu-navy/10 backdrop-blur-sm rounded-lg text-[10px] font-black text-neu-navy uppercase">
                                 {it}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>

                      {/* Wide Bottom Card */}
                      <div className="md:col-span-12 bento-card bg-slate-50 border-dashed border-2 flex items-center justify-between p-8">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                              <MapPin className="w-6 h-6 text-neu-navy" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Building Reference</p>
                              <p className="text-xl font-bold text-slate-700">{expanded.abbreviation} - {expanded.building}</p>
                            </div>
                         </div>
                         <button 
                          onClick={() => setInput('')}
                          className="px-6 py-3 bg-white text-neu-navy text-xs font-black uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all"
                         >
                            New Search
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex items-center gap-3 px-2">
                        <div className="w-1 h-4 bg-neu-navy rounded-full" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Search Matches</h3>
                      </div>
                      {results.map((res, i) => (
                        <motion.button 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={res.code} 
                          onClick={() => setInput(res.code)} 
                          className="bento-card flex items-center justify-between group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-black text-slate-800">{res.code}</p>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{res.name}</p>
                            </div>
                            
                            {res.isUnderMaintenance && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 rounded-full">
                                <Hammer className="w-3 h-3 text-red-500" />
                                <span className="text-[8px] font-black text-red-600 uppercase tracking-tighter">Maint.</span>
                              </div>
                            )}
                          </div>
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-neu-navy group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )
                ) : input.trim() ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="py-24 text-center"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-xl font-black text-slate-300 uppercase tracking-[0.2em]">No spot found</p>
                    <p className="text-slate-400 mt-2 text-sm">Check your room code and try again</p>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-1 h-4 bg-neu-gold rounded-full" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Picks</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {recent.map((spot, i) => (
                        <motion.button 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          key={spot} 
                          onClick={() => setInput(spot)} 
                          className="p-6 bg-white border border-slate-100 rounded-[28px] font-black text-sm text-slate-600 hover:border-neu-navy hover:text-neu-navy transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                        >
                          {spot}
                        </motion.button>
                      ))}
                      <div className="p-6 bg-neu-navy rounded-[28px] flex items-center justify-center col-span-2 text-white/40 font-black text-xs uppercase tracking-[0.3em]">
                        Ready to Explore?
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {viewMode === 'directory' && (
              <motion.div key="directory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <DirectoryView campusData={campusData} onSelectRoom={selectRoomFromDirectory} />
              </motion.div>
            ) }

            {viewMode === 'colleges' && (
              <motion.div key="colleges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <CollegesView />
              </motion.div>
            ) }

            {viewMode === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {isAuthenticated ? (
                  <AdminView campusData={campusData} onRefresh={refreshData} onLogout={() => setIsAuthenticated(false)} />
                ) : (
                  <LoginView onLogin={(success) => setIsAuthenticated(success)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-center gap-2 z-50">
        {[
          { id: 'home', label: 'Home', icon: HomeIcon },
          { id: 'search', label: 'Search', icon: Search },
          { id: 'directory', label: 'Dir', icon: BookOpen },
          { id: 'colleges', label: 'Colleges', icon: School },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as ViewMode)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
              viewMode === tab.id ? 'text-neu-navy bg-neu-blue-pale' : 'text-slate-400'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
