export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'amphitheater';
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
}
