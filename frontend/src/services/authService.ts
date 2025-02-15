import axios from 'axios';
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:3001/api/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/signup`, credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    return response.data;
  }
}; 