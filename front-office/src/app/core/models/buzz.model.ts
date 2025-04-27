import { User } from './user.model';

export interface Buzz {
  id: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  createdAt: string;
  user: User;
  viewCount: number;
  commentCount: number;
  shareCount: number;
  exploreCount: number;
  likeCount: number;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
  totalBuzzScore: number;
}

export interface CreateBuzzRequest {
  title: string;
  content: string;
  mediaUrl?: string;
}

export interface TrendingBuzz {
  id: string;
  title: string;
  createdAt: string;
  totalBuzzScore: number;
}
