export class Appointment {
    id?: number;
    date!: string;       // LocalDate -> string (format YYYY-MM-DD)
    startTime!: string;  // LocalTime -> string (format HH:mm:ss)
    endTime!: string;    // LocalTime -> string (format HH:mm:ss)
    userId!: number;
    isAvailable!: boolean;
  }
  