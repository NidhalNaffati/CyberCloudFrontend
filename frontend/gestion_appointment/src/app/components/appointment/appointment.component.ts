import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  newAppointment: Appointment = new Appointment();

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // 🔹 Charger les rendez-vous
   // 🔹 Charger les rendez-vous
   loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(data => {
      this.appointments = data;
    });
  }

  // 🔹 Ajouter un rendez-vous
  addAppointment(): void {
    this.appointmentService.createAppointment(this.newAppointment).subscribe(() => {
      Swal.fire({
        title: 'Succès!',
        text: 'Appointment added with success!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      this.loadAppointments();
      this.newAppointment = new Appointment(); // Réinitialiser le formulaire
    });
  }

  // 🔹 Supprimer un rendez-vous
  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.loadAppointments();
    });
  }
}
