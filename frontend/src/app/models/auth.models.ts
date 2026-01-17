export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}
