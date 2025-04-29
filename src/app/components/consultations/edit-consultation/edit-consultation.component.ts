import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from 'src/app/services/consultation.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Consultation } from 'src/app/models/consultation.model';
import { Appointment } from 'src/app/models/appointment';

@Component({
  selector: 'app-edit-consultation',
  templateUrl: './edit-consultation.component.html',
  styleUrls: ['./edit-consultation.component.css']
})
export class EditConsultationComponent implements OnInit {
  consultation: Consultation = new Consultation();
  appointments: Appointment[] = [];

  constructor(
    private route: ActivatedRoute,
    private consultationService: ConsultationService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    // Charger les données de la consultation à modifier
    this.consultationService.getConsultationById(id).subscribe({
      next: (data) => {
        this.consultation = data;
      },
      error: (err) => {
        console.error('Erreur de chargement de la consultation :', err);
      }
    });

    // Charger la liste des appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Erreur de chargement des appointments :', err);
      }
    });
  }

  updateConsultation(): void {
    if (this.consultation.id) {
      this.consultationService.updateConsultation(this.consultation.id, this.consultation).subscribe({
        next: () => {
          alert('Consultation mise à jour avec succès');
          this.router.navigate(['/admin/consultations']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour :', err);
        }
      });
    }
  }
  
}
