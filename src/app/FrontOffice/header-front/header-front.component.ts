import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { ResponseComplaint } from 'src/app/models/response-complaint';
import { Complaint } from 'src/app/models/complaint';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent implements OnInit {
  isAuthenticated = false;
  isAdmin = false;
  adminResponses: ResponseComplaint[] = [];
  unreadResponsesCount: number = 0;
  currentUser: any = null;
  private jwtHelper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private responseService: ResponseComplaintService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.loadUserData();
        this.isAdmin = this.authService.isAdmin();
        this.loadAdminResponses();
      } else {
        this.currentUser = null;
      }
    });

    // Charger initialement l'état d'authentification
    this.isAuthenticated = this.authService.hasValidToken();
    if (this.isAuthenticated) {
      this.loadUserData();
      this.isAdmin = this.authService.isAdmin();
      this.loadAdminResponses();
    }

    // Actualiser périodiquement les notifications
    setInterval(() => {
      if (this.isAuthenticated) {
        this.loadAdminResponses();
      }
    }, 10000);
  }

  private loadUserData(): void {
    const token = this.authService.getAccessToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.currentUser = {
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
        role: decodedToken.role
      };
    }
  }

  logout(): void {
    this.authService.logout();
    // Redirection ou autres actions après déconnexion
  }
  loadAdminResponses(): void {
    if (!this.isAuthenticated) return;

    this.responseService.getUnreadResponses().subscribe({
      next: (responses: ResponseComplaint[]) => {
        const filteredResponses: ResponseComplaint[] = [];
        
        responses.forEach(response => {
          this.responseService.getComplaintByResponseId(response.responseId).subscribe({
            next: (complaint: Complaint) => {
              if (response.userId !== complaint.userId) {
                filteredResponses.push(response);
              }
              
              if (responses.indexOf(response) === responses.length - 1) {
                this.adminResponses = filteredResponses;
                this.unreadResponsesCount = this.adminResponses.filter(r => !r.isReadRep).length;
              }
            },
            error: (err) => console.error('Error loading complaint:', err)
          });
        });
      },
      error: (err) => console.error('Error loading responses:', err)
    });
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  viewComplaint(response: ResponseComplaint): void {
    if (!response.isReadRep) {
      this.responseService.markResponseAsRead(response.responseId).subscribe({
        next: () => {
          response.isReadRep = true;
          this.unreadResponsesCount--;
        },
        error: (err) => console.error('Error marking response as read:', err)
      });
    }

    this.responseService.getComplaintByResponseId(response.responseId).subscribe({
      next: (complaint: Complaint) => {
        localStorage.setItem('selectedComplaint', JSON.stringify(complaint));
        window.location.href = '/add-complaint';
      },
      error: (err) => console.error('Error loading complaint:', err)
    });
  }
}