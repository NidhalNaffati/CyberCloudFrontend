import { User } from './response-complaint';

export class Complaint {
  complaintId!: number;
  subject!: string;  // Remplacé consultationId par subject
  content!: string;
  user?: User;
  userId?: number; // Gardé pour compatibilité
  starRatingConsultation!: number;
  isUrgent!: boolean;
  isRead!: boolean;
  date!: string;
}