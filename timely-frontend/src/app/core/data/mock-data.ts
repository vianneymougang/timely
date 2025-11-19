import { User } from '../models/user.model';

export const MOCK_USERS = [
  // ADMINISTRATEURS
  {
    email: 'admin@isjcam.org',
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@isjcam.org',
      firstName: 'Admin',
      lastName: 'ISJCAM',
      role: 'admin' as const
    }
  },

  // ENSEIGNANTS
  {
    email: 'arthur.pessah@isjcam.org',
    password: 'teacher123',
    user: {
      id: '3',
      email: 'arthur.pessah@isjcam.org',
      firstName: 'Arthur',
      lastName: 'Pessah',
      role: 'teacher' as const
    }
  },
  {
    email: 'marie.kouam@isjcam.org',
    password: 'teacher123',
    user: {
      id: '4',
      email: 'marie.kouam@isjcam.org',
      firstName: 'Marie',
      lastName: 'Kouam',
      role: 'teacher' as const
    }
  }
];


export const MOCK_TEACHERS = [
  {
    id: '1',
    firstName: 'Arthur',
    lastName: 'Pessah',
    email: 'arthur.pessah@isjcam.org',
    initials: 'MPA',
    phone: '+237 673032389',
    assignedCourses: 3,
    hourlyLoad: {
      used: 4,
      total: 24
    },
    availability: {
      monday: '8h-18h',
      tuesday: '9h-18h',
      wednesday: '8h-18h',
      thursday: '9h-17h',
      friday: '8h-18h',
      saturday: '-'
    },
    schedule: {
      monday: '-',
      tuesday: '-',
      wednesday: '-',
      thursday: '12h-14h',
      friday: '-',
      saturday: '-'
    },
    status: 'available' as const
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Kouam',
    email: 'marie.kouam@isjcam.org',
    initials: 'MK',
    phone: '+237 698765432',
    assignedCourses: 5,
    hourlyLoad: {
      used: 12,
      total: 24
    },
    availability: {
      monday: '8h-17h',
      tuesday: '8h-17h',
      wednesday: '8h-17h',
      thursday: '8h-17h',
      friday: '8h-17h',
      saturday: '9h-12h'
    },
    schedule: {
      monday: '10h-12h',
      tuesday: '14h-16h',
      wednesday: '8h-10h',
      thursday: '10h-12h',
      friday: '14h-16h',
      saturday: '9h-11h'
    },
    status: 'available' as const
  },
  {
    id: '3',
    firstName: 'Jean',
    lastName: 'Mbarga',
    email: 'jean.mbarga@isjcam.org',
    initials: 'JM',
    phone: '+237 677889900',
    assignedCourses: 4,
    hourlyLoad: {
      used: 16,
      total: 24
    },
    availability: {
      monday: '9h-18h',
      tuesday: '9h-18h',
      wednesday: '9h-18h',
      thursday: '9h-18h',
      friday: '9h-16h',
      saturday: '-'
    },
    schedule: {
      monday: '9h-11h',
      tuesday: '14h-16h',
      wednesday: '9h-11h',
      thursday: '14h-16h',
      friday: '9h-11h',
      saturday: '-'
    },
    status: 'busy' as const
  },
  {
    id: '4',
    firstName: 'Claire',
    lastName: 'Ngono',
    email: 'claire.ngono@isjcam.org',
    initials: 'CN',
    phone: '+237 655443322',
    assignedCourses: 6,
    hourlyLoad: {
      used: 18,
      total: 24
    },
    availability: {
      monday: '8h-18h',
      tuesday: '8h-18h',
      wednesday: '8h-18h',
      thursday: '8h-18h',
      friday: '8h-18h',
      saturday: '8h-12h'
    },
    schedule: {
      monday: '10h-12h',
      tuesday: '10h-12h',
      wednesday: '14h-16h',
      thursday: '10h-12h',
      friday: '14h-16h',
      saturday: '8h-10h'
    },
    status: 'busy' as const
  },
  {
    id: '5',
    firstName: 'Paul',
    lastName: 'Tagne',
    email: 'paul.tagne@isjcam.org',
    initials: 'PT',
    phone: '+237 699887766',
    assignedCourses: 2,
    hourlyLoad: {
      used: 6,
      total: 24
    },
    availability: {
      monday: '14h-18h',
      tuesday: '14h-18h',
      wednesday: '14h-18h',
      thursday: '14h-18h',
      friday: '14h-18h',
      saturday: '-'
    },
    schedule: {
      monday: '14h-16h',
      tuesday: '-',
      wednesday: '14h-16h',
      thursday: '-',
      friday: '14h-16h',
      saturday: '-'
    },
    status: 'available' as const
  }
];

export const MOCK_ROOMS = [
  { id: '1', name: 'Salle 101', capacity: 30, type: 'classroom' as const, equipment: ['Projecteur', 'Tableau'], status: 'available' as const },
  { id: '2', name: 'Salle 102', capacity: 25, type: 'classroom' as const, equipment: ['Projecteur'], status: 'occupied' as const },
  { id: '3', name: 'Lab Info 1', capacity: 20, type: 'lab' as const, equipment: ['Ordinateurs', 'Projecteur'], status: 'available' as const },
  { id: '4', name: 'Amphi A', capacity: 100, type: 'amphitheater' as const, equipment: ['Projecteur', 'Sono'], status: 'available' as const },
];

export const MOCK_DASHBOARD_STATS = {
  rooms: {
    total: 33,
    available: 20,
    occupied: 11,
    maintenance: 2
  },
  alerts: 2,
  teachers: 30,
  activeReservations: 15
};
