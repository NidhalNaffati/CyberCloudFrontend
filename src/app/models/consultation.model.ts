// consultation.model.ts

import { Appointment } from "./appointment";

export class Consultation {
  id?: number;
  details!: string;
  description!: string;
  actualDuration!: string;
  appointment!: Appointment;

  constructor(init?: Partial<Consultation>) {
    Object.assign(this, init);
  }

  getShortDescription(): string {
    return this.description.length > 50
      ? this.description.substring(0, 50) + '...'
      : this.description;
  }
}
