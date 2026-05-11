import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  loginId: string;
  name: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(`${API_URL}/auth/login`, request);
  return res.data;
}
