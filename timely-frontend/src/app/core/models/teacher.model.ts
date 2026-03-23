export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  phone?: string;
  assignedCourses: number;
  hourlyLoad: {
    used: number;
    total: number;
  };
  availability: WeekAvailability;
  schedule: WeekSchedule;
  status: 'available' | 'busy' | 'unavailable';
  userStatus: UserStatus;
}

export interface WeekAvailability {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

  [key: string]: string;
}

export interface WeekSchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

  [key: string]: string;
}
