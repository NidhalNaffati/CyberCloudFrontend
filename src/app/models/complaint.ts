export class Complaint {
  complaintId!: number;
  subject!: string;  // Remplacé consultationId par subject
  content!: string;
  userId!: number;
  starRatingConsultation!: number;
  isUrgent!: boolean;
  isRead!: boolean;
  date!: string;
}