export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
  avatar?: string;
  status?: string;
}
