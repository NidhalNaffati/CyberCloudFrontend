
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],


})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Fetch all appointments from the backend
  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.appointments = data;  // Store the appointments in the array
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
 
  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.loadAppointments();  // Refresh the list after deletion
    });
  }
 
}

