/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NEUCampus, Building, College, RoomDetail } from '../types';

const INITIAL_ROOMS: RoomDetail[] = [
  { code: 'M101', name: 'Computer Laboratory 1', buildingCode: 'M' },
  { code: 'M102', name: 'Computer Laboratory 2', buildingCode: 'M' },
  { code: 'M103', name: 'AutoCAD Room', description: 'Computer Laboratory', buildingCode: 'M' },
  { code: 'M104', name: 'Mac Lab', description: 'Computer Laboratory', buildingCode: 'M' },
  { code: 'M105', name: 'Computer Laboratory 5', buildingCode: 'M' },
  { code: 'M106', name: 'Computer Laboratory 6', buildingCode: 'M' },
  { code: 'M107', name: 'Computer Laboratory 7', buildingCode: 'M' },
  { code: 'M108', name: 'Computer Laboratory 8', buildingCode: 'M' },
  { code: 'M109', name: 'Computer Laboratory 9', buildingCode: 'M' },
  { code: 'M110', name: 'Computer Laboratory 10', buildingCode: 'M' },
  { code: 'M111', name: 'Computer Laboratory 11', buildingCode: 'M' },
  { code: 'M112', name: 'NEU Bookstore', buildingCode: 'M' },
  { code: 'M113A', name: 'Building Administration Office', buildingCode: 'M' },
  { code: 'M116A', name: 'Property Office', description: 'Near MField', buildingCode: 'M' },
  { code: 'M117', name: 'Biology Laboratory', buildingCode: 'M' },
  { code: 'M120', name: 'DISD / New CSD Office', description: 'Digital Infrastructure & Service Department.', buildingCode: 'M' },
  { code: 'M121', name: 'Old CSD Office', description: 'The office has moved to M120.', buildingCode: 'M' },
  { code: 'M124', name: 'CEA & Dean\'s Office', description: 'College of Engineering and Architecture', buildingCode: 'M' },
  { code: 'M128', name: 'Engineering Laboratory Workshop', description: 'Engineering Facility', buildingCode: 'M' },
  { code: 'M132', name: 'Surveying Laboratory', description: 'Engineering Facility. SHOP 2', buildingCode: 'M' },
  { code: 'M133', name: 'Civil Engineering Technology Laboratory', description: 'Engineering Facility. SHOP 3', buildingCode: 'M' },
  { code: 'M134', name: 'Fluid Mechanics & Hydraulics Laboratory', description: 'Engineering Facility. SHOP 4', buildingCode: 'M' },
  { code: 'M240', name: 'Nursing Arts Laboratory', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M226', name: 'Short Stay Surgical Unit (SSSU)', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M241', name: 'College of Nursing Faculty Room (CON)', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M228', name: 'Procurement Office', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M232', name: 'Physics Laboratory', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M231', name: 'Auditing Department', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M233', name: 'College Registrar\'s Office', description: 'Center part of Main Building', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M235', name: 'Clinic', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M214', name: 'Guidance and Counseling Center', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M216', name: 'Registrar and Records Management Office', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M217', name: 'Micro Biology Laboratory', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M210', name: 'Industrial/Methods/Ergonomics Engineering Laboratory', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M209B', name: 'National Service Training Program (NSTP Office)', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M208', name: 'Information Office', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M207', name: 'Office of International Students Affairs', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M206', name: 'ECE Laboratory 3', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M243', name: 'MPH/5', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M202', name: 'Accounting Department', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M201', name: 'Finance Department', floor: '2nd Floor', buildingCode: 'M' },
  { code: 'M308', name: 'NEU Maintenance', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M316', name: 'University Ministers Office', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M317', name: 'Office of the Vice President for Administration', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M322', name: 'NEU Multimedia Office (Photo Studio)', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M324A', name: 'Psychology Laboratory A', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M329', name: 'Students Consultation and Counseling Room', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M330', name: 'Office of Secretary', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'M431', name: 'Astrophysics and Astrostatistics Laboratory', description: 'Telescope Maintenance and Optics Laboratory', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M430', name: 'Office of Student Discipline (OSD)', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M432', name: 'Chemistry Laboratory / Police Photography Laboratory', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M427', name: 'Crime Science Room', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M422', name: 'Forensic Ballistics Laboratory', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M421', name: 'Lie Detection and Interrogation Room', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M420', name: 'Questioned Documents and Dactyloscopy', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M418', name: 'College of Criminology (COC)', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M417', name: 'Criminology Student Society Office', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M434', name: 'Office of Student Affairs and Services (OSAS)', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M415', name: 'CICS Department', floor: '4th Floor', buildingCode: 'M' },
  { code: 'M328', name: 'College of Communication (COC)', description: 'Temporarily located here.', floor: '3rd Floor', buildingCode: 'M' },
  { code: 'SHOP5', name: 'Construction Matls. and Testing Laboratory', description: 'Engineering Facility', buildingCode: 'M' },
  { code: 'TBA', name: 'To Be Announced', buildingCode: 'University-wide' },
  { code: 'CASHIER', name: 'Cashier', description: 'Located at the second floor of Main Building', floor: '2nd Floor', buildingCode: 'M' },
];

const INITIAL_CAMPUS_DATA: NEUCampus = {
  name: 'New Era University Main Campus',
  address: '#9 Central Avenue, New Era, Quezon City',
  contact: '(02) 8981-4221',
  buildings: [
    {
      code: 'M',
      name: 'Main Building',
      totalFloors: 4,
      colleges: [
        {
          id: 'CCS',
          name: 'College of Computer Studies',
          floorsOccupied: [4],
          deanOffice: 'M415',
          contact: 'ccs@neu.edu.ph'
        },
        {
          id: 'COE',
          name: 'College of Engineering',
          floorsOccupied: [1, 2],
          deanOffice: 'M124',
          contact: 'engineering@neu.edu.ph'
        },
        {
          id: 'CED',
          name: 'College of Education',
          floorsOccupied: [3],
          deanOffice: 'M330',
          contact: 'education@neu.edu.ph'
        },
        {
          id: 'CON',
          name: 'College of Nursing',
          floorsOccupied: [2],
          deanOffice: 'M241',
          contact: 'nursing@neu.edu.ph'
        }
      ],
      facilities: ['Mess Hall', 'Bookstore', 'Gym', 'Secret Garden']
    },
    {
      code: 'SOM',
      name: 'School of Management',
      totalFloors: 4,
      colleges: [
        {
          id: 'SOM-COL',
          name: 'School of Management',
          floorsOccupied: [1, 2, 3, 4],
          deanOffice: 'SOM101',
          contact: 'som@neu.edu.ph'
        }
      ],
      facilities: ['Canteen', 'Library']
    },
    {
      code: 'PSB',
      name: 'Professional School Building',
      totalFloors: 5,
      colleges: [
        {
          id: 'SGS',
          name: 'School of Graduate Studies',
          floorsOccupied: [1, 2],
          deanOffice: 'PSB101'
        },
        {
          id: 'LAW',
          name: 'Juris Doctor (J.D.) Program',
          floorsOccupied: [3, 4],
          deanOffice: 'PSB301'
        }
      ]
    },
    {
      code: 'IS',
      name: 'Integrated School',
      totalFloors: 4,
      colleges: [
        {
          id: 'IS-BASIC',
          name: 'Integrated School (Basic Education)',
          floorsOccupied: [1, 2, 3, 4],
          deanOffice: 'IS101'
        }
      ]
    }
  ]
};

const STORAGE_KEY = 'neu_campus_data';
const ROOMS_KEY = 'neu_rooms_data';

export const campusService = {
  getCampusData(): NEUCampus {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored campus data', e);
      }
    }
    return INITIAL_CAMPUS_DATA;
  },

  getRooms(): RoomDetail[] {
    const stored = localStorage.getItem(ROOMS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored rooms data', e);
      }
    }
    return INITIAL_ROOMS;
  },

  saveCampusData(data: NEUCampus) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  saveRooms(rooms: RoomDetail[]) {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  },

  addBuilding(building: Building) {
    const data = this.getCampusData();
    data.buildings.push(building);
    this.saveCampusData(data);
  },

  updateBuilding(updatedBuilding: Building) {
    const data = this.getCampusData();
    const index = data.buildings.findIndex(b => b.code === updatedBuilding.code);
    if (index !== -1) {
      data.buildings[index] = updatedBuilding;
      this.saveCampusData(data);
    }
  },

  deleteBuilding(code: string) {
    const data = this.getCampusData();
    data.buildings = data.buildings.filter(b => b.code !== code);
    this.saveCampusData(data);
  },

  addCollege(buildingCode: string, college: College) {
    const data = this.getCampusData();
    const building = data.buildings.find(b => b.code === buildingCode);
    if (building) {
      if (!building.colleges) building.colleges = [];
      building.colleges.push(college);
      this.saveCampusData(data);
    }
  },

  updateCollege(buildingCode: string, updatedCollege: College) {
    const data = this.getCampusData();
    const building = data.buildings.find(b => b.code === buildingCode);
    if (building) {
      const index = building.colleges.findIndex(c => c.id === updatedCollege.id);
      if (index !== -1) {
        building.colleges[index] = { ...building.colleges[index], ...updatedCollege };
        this.saveCampusData(data);
      }
    }
  },

  deleteCollege(buildingCode: string, collegeId: string) {
    const data = this.getCampusData();
    const building = data.buildings.find(b => b.code === buildingCode);
    if (building) {
      building.colleges = building.colleges.filter(c => c.id !== collegeId);
      this.saveCampusData(data);
    }
  },

  addRoom(room: RoomDetail) {
    const rooms = this.getRooms();
    rooms.push(room);
    this.saveRooms(rooms);
  },

  updateRoom(roomCode: string, updatedRoom: RoomDetail) {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.code === roomCode);
    if (index !== -1) {
      rooms[index] = updatedRoom;
      this.saveRooms(rooms);
    } else {
      // If code changed and we didn't find the old one, but we are in update mode
      // This part depends on how we want to handle it. 
      // For now, let's just make sure it updates the right one.
      const directIndex = rooms.findIndex(r => r.code === updatedRoom.code);
      if (directIndex !== -1) {
        rooms[directIndex] = updatedRoom;
        this.saveRooms(rooms);
      }
    }
  },

  deleteRoom(code: string) {
    const rooms = this.getRooms();
    const filtered = rooms.filter(r => r.code !== code);
    this.saveRooms(filtered);
  }
};
