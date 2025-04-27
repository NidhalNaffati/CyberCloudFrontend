import { User } from './user.model';

export interface Buzz {
  id: string;
  user: User;
  title?: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  commentCount: number;
  shareCount: number;
  exploreCount: number;
}
