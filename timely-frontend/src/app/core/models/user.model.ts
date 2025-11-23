export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'admin' | 'teacher'; // Support both formats
  avatar?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  name?: string; // Backend uses 'name' instead of firstName
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  email: string;
  role: 'ROLE_ADMIN' | 'ROLE_TEACHER';
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterTeacherRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  telephoneNumber?: number;
  matricule: string;
  grade: string;
  rank: string;
  hourlyRate: string;
}
