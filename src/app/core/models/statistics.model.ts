export interface DashboardStats {
  rooms: {
    used: number;
    total: number;
  };
  teachers: {
    count: number;
  };
  reservations: {
    upcoming: number;
  };
  roomDistribution: RoomDistribution[];
  alerts: Alert[];
}

export interface RoomDistribution {
  day: string;
  coordinators: number;
  classrooms: number;
  labs: number;
}

export interface Alert {
  type: 'conflict' | 'availability';
  message: string;
  room: string;
  time: string;
  action?: string;
}
