export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}