import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthStoreService } from '../../auth/auth-store.service'; // Import AuthStoreService

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  availableSlots: string[] = [];
  workingHours = { start: 9, end: 17 };
  appointmentForm: FormGroup;

  constructor(
    private appointmentService: AppointmentService,
    private authStoreService: AuthStoreService
  ) {
    this.appointmentForm = new FormGroup({
      date: new FormControl('', [Validators.required, this.weekendValidator]),
      startTime: new FormControl('', Validators.required),
      isAvailable: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Add this method to fix the error
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(data => {
      this.appointments = data;
    });
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const formData = this.appointmentForm.value;
      const { date, startTime } = formData;
      
      // Calculate end time (1 hour after start)
      const endTime = this.calculateEndTime(startTime);
      
      if (this.isSlotAvailable(date, startTime, endTime)) {
        // Get user ID from token
        const userId = this.authStoreService.getUserId();
        
        if (!userId) {
          Swal.fire('Erreur!', 'Utilisateur non authentifié.', 'error');
          return;
        }
        
        const appointmentData = {
          ...formData,
          endTime: endTime,
          userId: userId // Add user ID to appointment data
        };
        
        console.log('Creating appointment with data:', appointmentData);
        
        this.appointmentService.createAppointment(appointmentData).subscribe({
          next: () => {
            Swal.fire('Succès!', 'Rendez-vous ajouté avec succès!', 'success');
            this.loadAppointments();
            this.appointmentForm.reset();
          },
          error: (error) => {
            const errorMessage = error?.error?.message || 'Erreur lors de l\'ajout.';
            Swal.fire('Erreur!', errorMessage, 'error');
          }
        });
      } else {
        Swal.fire('Erreur!', 'Le créneau sélectionné est déjà pris.', 'error');
      }
    } else {
      Swal.fire('Erreur!', 'Veuillez remplir tous les champs correctement.', 'error');
    }
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      Swal.fire('Succès!', 'Rendez-vous supprimé avec succès!', 'success');
      this.loadAppointments();
    });
  }

  onDateChange(): void {
    const selectedDate = this.appointmentForm.get('date')?.value;
    if (selectedDate) {
      // Generate available time slots for the selected date
      this.generateTimeSlots(selectedDate);
      
      // Reset start time when date changes
      this.appointmentForm.get('startTime')?.reset();
    }
  }

  generateTimeSlots(date: string): void {
    const slots: string[] = [];
    const dateObj = new Date(date);
    const day = dateObj.getDay();
    
    // Only generate slots for weekdays
    if (day !== 0 && day !== 6) {
      for (let hour = this.workingHours.start; hour < this.workingHours.end; hour++) {
        // Generate slots on the hour (e.g., 09:00, 10:00, etc.)
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(timeString);
      }
    }
    
    this.availableSlots = slots;
  }

  calculateEndTime(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHour = hours + 1;
    
    // Handle crossing into the next hour
    if (endHour >= 24) {
      endHour = 0;
    }
    
    return `${endHour.toString().padStart(2, '0')}:00`;
  }

  isSlotAvailable(date: string, startTime: string, endTime: string): boolean {
    return !this.appointments.some(app => {
      const appStart = new Date(`${app.date}T${app.startTime}`);
      const appEnd = new Date(`${app.date}T${app.endTime}`);
      const selectedStart = new Date(`${date}T${startTime}`);
      const selectedEnd = new Date(`${date}T${endTime}`);

      return (selectedStart < appEnd && selectedEnd > appStart);
    });
  }

  weekendValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const date = new Date(control.value);
    const day = date.getDay();
    
    // 0 is Sunday, 6 is Saturday
    if (day === 0 || day === 6) {
      return { weekend: true };
    }
    
    return null;
  }

  getSelectedEndTime(): string {
    const startTime = this.appointmentForm.get('startTime')?.value;
    if (!startTime) return '';
    return this.calculateEndTime(startTime);
  }
}