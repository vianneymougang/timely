export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
  avatar?: string;
  status?: string;
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
  telephoneNumber?: number;
  grade: string;
  rank: string;
  hourlyRate: string;
}

export interface RegisterAdminRequest {
  name: string;
  surname: string;
  email: string;
  telephoneNumber?: number;
}
