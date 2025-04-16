import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Importer les outils des formulaires réactifs
import { ConsultationService } from 'src/app/services/consultation.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import { Consultation } from 'src/app/models/consultation.model';

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.css']
})
export class AddConsultationComponent implements OnInit {

  consultationForm: FormGroup;
  appointments: Appointment[] = [];
  consultation: Consultation = new Consultation();
  
  constructor(
    private consultationService: ConsultationService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    // Création du formulaire réactif avec validations
    this.consultationForm = new FormGroup({
      details: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      actualDuration: new FormControl('', [Validators.required, this.timeValidator]),
      appointment: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data: Appointment[]) => this.appointments = data,
      error: (err: any) => console.error('Erreur chargement appointments:', err)
    });
  }

  addConsultation(): void {
    if (this.consultationForm.valid) {
      this.consultationService.createConsultation(this.consultationForm.value).subscribe({
        next: () => {
          alert('✅ Consultation ajoutée avec succès !'); // Affiche l'alerte
          this.consultationForm.reset();
        },
        error: (err: any) => {
          console.error('Erreur création consultation:', err);
          alert('❌ Échec de l’ajout de la consultation.');
        }
      });
    } else {
      alert('❌ Veuillez remplir tous les champs correctement.');
    }
  }

  // Valide l'heure (ex : format HH:mm:ss)
  timeValidator(control: FormControl): { [key: string]: boolean } | null {
    const timeRegex = /^([0-9]{2}):([0-9]{2})$/; // Format HH:mm:ss
    if (control.value && !timeRegex.test(control.value)) {
      return { 'invalidTime': true };
    }
    return null;
  }
}
