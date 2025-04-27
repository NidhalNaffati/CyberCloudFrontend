export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  website: string | null;
  followersCount: number;
  followingsCount: number;
  buzzCount: number;
  isBanned: boolean;
  isAdmin: boolean;
  joinedAt: string;
  isFollowed?: boolean;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  birthDate: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
