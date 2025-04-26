import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Assurez-vous d'importer Router
import { ComplaintService } from 'src/app/services/complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { ResponseComplaint } from 'src/app/models/response-complaint';

@Component({
  selector: 'app-navbar-back',
  templateUrl: './navbar-back.component.html',
  styleUrls: ['./navbar-back.component.css'],
    
})
export class NavbarBackComponent implements OnInit {
  unreadComplaints: Complaint[] = [];
  unreadResponses: ResponseComplaint[] = []; // 👈 Ajout des réponses non lues
  selectComplaintId: number | null = null;
  selectResponseId: number | null = null; // 👈 Ajoutez cette ligne

  constructor(
    private complaintService: ComplaintService,
    private responseComplaintService: ResponseComplaintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUnreadComplaints();
    this.loadUnreadResponses(); // 👈 Charger aussi les réponses

    setInterval(() => {
      this.loadUnreadComplaints();
      this.loadUnreadResponses(); // 👈 Recharger aussi
    }, 10000);
  }

  loadUnreadComplaints(): void {
    this.complaintService.getUnreadComplaints().subscribe((data) => {
      this.unreadComplaints = data;
    });
  }

  loadUnreadResponses(): void {
    this.responseComplaintService.getUnreadResponses().subscribe((data) => {
      this.unreadResponses = data;
    });
  }

  openModal(complaintId: number): void {
    this.selectComplaintId = complaintId;
    this.complaintService.markComplaintAsRead(complaintId).subscribe({

      next: () => {
        const modalElement = document.getElementById('responseModal2');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      }
    });
  }

  openResponseModal(responseId: number, complaintId: number): void {
    this.selectComplaintId = complaintId;
    this.selectResponseId = responseId; // 👈 Ajoutez cette ligne
  
    this.responseComplaintService.markResponseAsRead(responseId).subscribe({
      next: () => {
        const modalElement = document.getElementById('responseModal3');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la réponse:", err);
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('responseModal2');
    if (modalElement && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      this.selectComplaintId = null;
    }
  }
}