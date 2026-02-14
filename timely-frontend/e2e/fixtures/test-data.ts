/**
 * Données de test pour les tests E2E
 *
 * Ce fichier centralise toutes les données de test utilisées dans les scénarios E2E.
 * Cela permet de maintenir facilement les données et d'assurer la cohérence entre les tests.
 */

export const TEST_USERS = {
  admin: {
    email: 'admin@iusjc.edu',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'System',
    role: 'ADMIN',
  },
  teacher: {
    email: 'teacher@iusjc.edu',
    password: 'teacher123',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'TEACHER',
  },
  teacher2: {
    email: 'teacher2@iusjc.edu',
    password: 'teacher123',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'TEACHER',
  },
};

export const TEST_COURSES = {
  math101: {
    code: 'MATH101',
    name: 'Mathématiques 1',
    credits: 3,
    hours: 45,
    semester: 1,
    department: 'Mathématiques',
  },
  phys201: {
    code: 'PHYS201',
    name: 'Physique Générale',
    credits: 4,
    hours: 60,
    semester: 2,
    department: 'Physique',
  },
  info301: {
    code: 'INFO301',
    name: 'Programmation Avancée',
    credits: 5,
    hours: 75,
    semester: 3,
    department: 'Informatique',
  },
};

export const TEST_ROOMS = {
  room101: {
    name: 'Salle 101',
    building: 'Bâtiment A',
    capacity: 30,
    type: 'LECTURE_HALL',
    floor: 1,
    equipment: ['PROJECTOR', 'WHITEBOARD'],
  },
  lab201: {
    name: 'Lab 201',
    building: 'Bâtiment B',
    capacity: 20,
    type: 'LABORATORY',
    floor: 2,
    equipment: ['COMPUTERS', 'PROJECTOR'],
  },
  amphitheater: {
    name: 'Amphithéâtre',
    building: 'Bâtiment C',
    capacity: 100,
    type: 'AMPHITHEATER',
    floor: 0,
    equipment: ['PROJECTOR', 'MICROPHONE', 'AUDIO_SYSTEM'],
  },
};

export const TEST_SCHEDULES = {
  monday9am: {
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
  },
  tuesday14pm: {
    dayOfWeek: 'TUESDAY',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
  },
  wednesday10am: {
    dayOfWeek: 'WEDNESDAY',
    startTime: '10:00',
    endTime: '12:00',
    duration: 120,
  },
};

export const TEST_AVAILABILITIES = {
  fullWeek: {
    dayOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    startTime: '08:00',
    endTime: '18:00',
  },
  morningOnly: {
    dayOfWeek: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    startTime: '08:00',
    endTime: '12:00',
  },
  afternoonOnly: {
    dayOfWeek: ['TUESDAY', 'THURSDAY'],
    startTime: '14:00',
    endTime: '18:00',
  },
};

export const EXPECTED_VALIDATION_MESSAGES = {
  auth: {
    invalidCredentials: 'Email ou mot de passe incorrect',
    emailRequired: 'L\'email est requis',
    passwordRequired: 'Le mot de passe est requis',
    sessionExpired: 'Votre session a expiré',
  },
  user: {
    createSuccess: 'Utilisateur créé avec succès',
    updateSuccess: 'Utilisateur mis à jour avec succès',
    deleteSuccess: 'Utilisateur supprimé avec succès',
    emailExists: 'Cet email est déjà utilisé',
  },
  schedule: {
    generateSuccess: 'Emploi du temps généré avec succès',
    publishSuccess: 'Emploi du temps publié avec succès',
    conflictDetected: 'Conflit détecté',
    conflictResolved: 'Conflit résolu',
  },
  room: {
    createSuccess: 'Salle créée avec succès',
    bookingSuccess: 'Réservation créée avec succès',
    bookingConflict: 'Cette salle est déjà réservée pour ce créneau',
  },
};

export const API_ENDPOINTS = {
  gateway: process.env.GATEWAY_URL || 'http://localhost:8090',
  auth: '/api/auth',
  users: '/api/users',
  planning: '/api/planning',
  booking: '/api/booking',
  reports: '/api/reports',
  notifications: '/api/notifications',
};

export const TIMEOUTS = {
  short: 2000,
  medium: 5000,
  long: 10000,
  veryLong: 30000,
};

/**
 * Génère un email unique pour les tests
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}@iusjc.test`;
}

/**
 * Génère un code de cours unique
 */
export function generateUniqueCourseCode(prefix: string = 'TEST'): string {
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
}

/**
 * Génère un nom de salle unique
 */
export function generateUniqueRoomName(prefix: string = 'Salle Test'): string {
  const timestamp = Date.now();
  return `${prefix} ${timestamp}`;
}
