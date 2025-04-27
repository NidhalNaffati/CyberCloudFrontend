// appointment.model.ts
export class Appointment {
  id?: number;
  date?: string;       // LocalDate -> string (format YYYY-MM-DD)
  startTime!: string;  // LocalTime -> string (format HH:mm:ss)
  endTime!: string;    // LocalTime -> string (format HH:mm:ss)
  userId!: number;
  isAvailable?: boolean;
  
  // New fields to support AI features
  predictedDuration?: string; // Predicted time needed
  score?: number; // Optimization score (0-1)
  consultationType?: string; // Type of consultation
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  
  // Helper method to get Date objects
  getStartDateTime(): Date {
    if (!this.date || !this.startTime) return new Date();
    return new Date(`${this.date}T${this.startTime}`);
  }
  
  getEndDateTime(): Date {
    if (!this.date || !this.endTime) return new Date();
    return new Date(`${this.date}T${this.endTime}`);
  }
  
  getDurationMinutes(): number {
    const start = this.getStartDateTime();
    const end = this.getEndDateTime();
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }
}
