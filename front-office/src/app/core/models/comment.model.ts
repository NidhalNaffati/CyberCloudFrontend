import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  likeCount: number;
  dislikeCount: number;
  likedByCurrentUser: boolean;
  dislikedByCurrentUser: boolean;
}

export interface CreateCommentRequest {
  content: string;
}
