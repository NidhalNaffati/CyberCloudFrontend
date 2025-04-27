export interface User {
  id: string;
  fullName: string;
  birthDate: string;
  email: string;
  username: string;
  password?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  birthDate: string;
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
  isFollowed: boolean;
}

export interface UserPage {
  totalElements: number;
  totalPages: number;
  size: number;
  content: User[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
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
  adminSecretKey: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
