import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Assurez-vous d'importer Router
import { ComplaintService } from 'src/app/services/complaint.service';
import { Complaint } from 'src/app/models/complaint';

@Component({
  selector: 'app-navbar-back',
  templateUrl: './navbar-back.component.html',
  styleUrls: ['./navbar-back.component.css']
})
export class NavbarBackComponent implements OnInit {
  unreadComplaints: Complaint[] = [];

  // Un seul constructeur pour les deux dépendances
  constructor(
    private complaintService: ComplaintService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUnreadComplaints();

    // Rechargement toutes les 30 secondes pour simuler une "notification instantanée"
    setInterval(() => {
      this.loadUnreadComplaints();
    }, 10000); 
  }

  // Méthode pour charger les plaintes non lues
  loadUnreadComplaints(): void {
    this.complaintService.getUnreadComplaints().subscribe((data) => {
      this.unreadComplaints = data;
    });
  }

  // Méthode appelée lorsqu'un utilisateur clique sur un message// navbar-back.component.ts

  openComplaint(complaint: Complaint): void {
    // Utiliser l'opérateur de non-nullité pour dire à TypeScript que complaintId n'est pas undefined
    this.complaintService.markComplaintAsRead(complaint.complaintId!).subscribe(() => {
      // Après la mise à jour, supprimer la réclamation de la liste des non lues
      this.unreadComplaints = this.unreadComplaints.filter(c => c.complaintId !== complaint.complaintId);
  
      // Rediriger vers la page des réclamations administrateur
      this.router.navigate([`/admin/complaints`]);
    });
  }
  
}
