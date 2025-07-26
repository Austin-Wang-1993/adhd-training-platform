export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface GameScore {
  id: string;
  userId: string;
  username: string;
  gameType: string;
  score: number;
  time: number;
  difficulty: string;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard'; 