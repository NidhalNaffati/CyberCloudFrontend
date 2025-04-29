import { Appointment } from "./appointment";

// consultation.model.ts
export class Consultation {
  id?: number;
  details!: string;
  description!: string;
  actualDuration!: string; // Consider changing to number (minutes)
  appointment!: Appointment;
  
  // New fields for AI features
  consultationType?: string;
  complexity?: 'low' | 'medium' | 'high';
  
  constructor(init?: Partial<Consultation>) {
    Object.assign(this, init);
  }
  
  getShortDescription(): string {
    return this.description.length > 50
      ? this.description.substring(0, 50) + '...'
      : this.description;
  }
  
  // Helper method to get duration in minutes
  getActualDurationMinutes(): number {
    // Assuming actualDuration is in format "HH:mm:ss"
    const [hours, minutes, seconds] = this.actualDuration.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }
}

  
