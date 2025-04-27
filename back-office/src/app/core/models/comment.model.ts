import { User } from './user.model';
import { Buzz } from './buzz.model';

export interface Comment {
  id: string;
  content: string;
  buzz: Buzz;
  user: User;
  createdAt: string;
  updatedAt: string;
}
