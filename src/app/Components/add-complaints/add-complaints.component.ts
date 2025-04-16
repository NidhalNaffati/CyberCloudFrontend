import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from 'src/app/services/complaint.service';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaint } from 'src/app/models/response-complaint';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-complaints',
  templateUrl: './add-complaints.component.html',
  styleUrls: ['./add-complaints.component.css']
})
export class AddComplaintsComponent implements OnInit {
  complaintForm!: FormGroup;
  responseForm!: FormGroup;
  complaints: Complaint[] = [];
  responses: ResponseComplaint[] = [];
  isEditMode = false;
  selectedComplaintId: number | null = null;
  p: number = 1; // Pagination for complaints
  selectedComplaint: Complaint | null = null;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private responseComplaintService: ResponseComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.complaintForm = this.fb.group({
      consultationId: [0, Validators.required],
      content: ['', Validators.required],
      userId: [0, Validators.required],
      starRatingConsultation: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      isUrgent: [false],
      isRead: [false]
    });

    this.responseForm = this.fb.group({
      responseContent: ['', Validators.required]
    });

    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe({
      next: (data: Complaint[]) => this.complaints = data,
      error: (err) => console.error('Erreur de chargement des plaintes :', err)
    });
  }

  getComplaint(complaint: Complaint): void {
    this.isEditMode = false;
    this.selectedComplaintId = complaint.complaintId;
    this.selectedComplaint = complaint; // <-- stocke la plainte complète
    this.complaintForm.patchValue(complaint);
    this.loadResponses(complaint.complaintId);
  }
  

  loadResponses(complaintId: number): void {
    this.responseComplaintService.getResponsesByComplaint(complaintId).subscribe({
      next: (data: ResponseComplaint[]) => this.responses = data,
      error: (err) => console.error('Erreur de chargement des réponses :', err)
    });
  }

  onSubmitResponse(): void {
    if (this.responseForm.invalid) {
      alert('Veuillez remplir le champ de réponse.');
      return;
    }
  
    const response: ResponseComplaint = {
      responseId: 0,               // Ou utilisez un ID généré par le backend si nécessaire
      complaintId: this.selectedComplaintId!, // ID de la plainte sélectionnée
      userId: this.complaintForm.value.userId,                   // ID de l'utilisateur qui répond (exemple ici, à ajuster)
      content: this.responseForm.value.responseContent, // Contenu de la réponse
      dateRep: new Date().toISOString() // Date actuelle au format ISO
    };
  
    this.responseComplaintService.addResponse(this.selectedComplaintId!, response).subscribe({
      next: () => {
        alert('Réponse ajoutée avec succès.');
        this.responseForm.reset();
        this.loadResponses(this.selectedComplaintId!); // Reload responses
      },
      error: (err) => alert('Erreur lors de l\'ajout de la réponse.')
    });
  }
  

  onSubmit(): void {
    if (this.complaintForm.invalid) {
      alert('Veuillez remplir tous les champs requis correctement.');
      return;
    }

    const complaint: Complaint = this.complaintForm.value;

    if (this.isEditMode && this.selectedComplaintId !== null) {
      this.complaintService.updateComplaint(this.selectedComplaintId, complaint).subscribe({
        next: () => {
          alert('Plainte mise à jour.');
          this.resetForm();
          this.loadComplaints();
        },
        error: (err) => alert('Erreur lors de la mise à jour.')
      });
    } else {
      this.complaintService.addComplaint(complaint).subscribe({
        next: () => {
          alert('Plainte ajoutée !');
          this.resetForm();
          this.loadComplaints();
        },
        error: (err) => alert('Erreur lors de l\'ajout.')
      });
    }
  }
  startAddingNewComplaint(): void {
    this.isEditMode = false; // Assurez-vous que nous ne sommes pas en mode édition
    this.selectedComplaintId = null; // Aucune plainte sélectionnée
    this.complaintForm.reset({
      consultationId: 0,
      content: '',
      userId: 0,
      starRatingConsultation: 0,
      isUrgent: false,
      isRead: false
    });
  }
  
  resetForm(): void {
    this.complaintForm.reset({
      consultationId: 0,
      content: '',
      userId: 0,
      starRatingConsultation: 0,
      isUrgent: false,
      isRead: false
    });
    this.isEditMode = false;
    this.selectedComplaintId = null;
  }
}
