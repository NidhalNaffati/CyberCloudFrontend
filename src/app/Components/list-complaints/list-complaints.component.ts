import { Component, OnInit } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-list-complaints',
  templateUrl: './list-complaints.component.html',
  styleUrls: ['./list-complaints.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ListComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  selectedComplaintId: number | null = null;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des plaintes:', err);
      }
    });
  }

  delete(id: number | undefined): void {
    if (id !== undefined) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(c => c.complaintId !== id);
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de la plainte:", err);
        }
      });
    }
  }

  openModal(complaintId: number): void {
    this.selectedComplaintId = complaintId;

    // Marquer la plainte comme lue
    this.complaintService.markComplaintAsRead(complaintId).subscribe({
      next: () => {
        // Ouvrir la modale une fois la plainte marquée comme lue
        const modalElement = document.getElementById('responseModal');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        } else {
          console.error('Modal non trouvée ou Bootstrap manquant.');
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la plainte:", err);
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('responseModal');
    if (modalElement && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      this.selectedComplaintId = null;
    }
  }
}
