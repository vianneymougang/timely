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
