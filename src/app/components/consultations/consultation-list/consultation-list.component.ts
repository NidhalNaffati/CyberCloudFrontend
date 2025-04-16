import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Consultation } from 'src/app/models/consultation.model';
import { ConsultationService } from 'src/app/services/consultation.service';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css']
})
export class ConsultationListComponent implements OnInit {

  consultations: Consultation[] = [];

  constructor(
    private consultationService: ConsultationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.getConsultations().subscribe({
      next: (data) => this.consultations = data,
      error: (err) => console.error('Erreur chargement consultations:', err)
    });
  }

  deleteConsultation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id).subscribe({
        next: () => this.loadConsultations(),
        error: (err) => console.error('Erreur suppression consultation:', err)
      });
    }
  }

  editConsultation(id: number): void {
    this.router.navigate(['/admin/consultations/edit', id]);
  }

}
