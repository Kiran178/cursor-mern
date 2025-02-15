export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
} 