/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface College {
  id: string;
  name: string;
  floorsOccupied: number[];
  deanOffice?: string;
  contact?: string;
  description?: string;
  vision?: string;
  mission?: string;
  programs?: string[];
  founded?: string;
  campuses?: string[];
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
}

export interface Building {
  code: string;
  name: string;
  totalFloors: number;
  colleges: College[];
  facilities?: string[];
}

export interface NEUCampus {
  name: string;
  address: string;
  contact: string;
  buildings: Building[];
}

export interface RoomDetail {
  code: string;
  name: string;
  description?: string;
  floor?: string;
  isUnderMaintenance?: boolean;
  maintenanceMessage?: string;
  buildingCode?: string;
  capacity?: string;
  inventory?: string[];
  chairCount?: number | null;
}

export interface ExpandedRoom extends RoomDetail {
  building: string;
  room: string;
  abbreviation: string;
}
