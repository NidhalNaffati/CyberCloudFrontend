import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { ResponseComplaintService } from '../../services/response-complaint.service';
import { ComplaintService } from '../../services/complaint.service';
import { ResponseComplaint } from '../../models/response-complaint';
import { Complaint } from '../../models/complaint';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService, Notification } from '../../services/notification.service';
import { Router } from '@angular/router';

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
  id_user=localStorage.getItem('user_id');
  // Propriétés pour les notifications de blog
  blogNotifications: Notification[] = [];
  unreadBlogNotificationsCount: number = 0;

  constructor(
    private authService: AuthService,
    private responseService: ResponseComplaintService,
    private complaintService: ComplaintService,
    private notificationService: NotificationService,
    private router: Router
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

    // S'abonner aux notifications de blog
    this.notificationService.getNotifications().subscribe(notifications => {
      this.blogNotifications = notifications
        .filter(notification => notification.iduser !== parseInt(this.id_user!))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) 
        .slice(0, 10); 
      
    });
    
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadBlogNotificationsCount = this.blogNotifications.filter(notification => !notification.read).length;
    });

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

  // Méthodes pour gérer les notifications de blog
  viewBlogPost(notification: Notification): void {
    // Marquer la notification comme lue
    this.notificationService.markAsRead(notification.id);
    
    // Naviguer vers le blog post
    this.router.navigate(['/blog'], { queryParams: { postId: notification.postId } });
  }
  
  markAllBlogNotificationsAsRead(): void {
    this.notificationService.markAllAsRead();
  }
  
  // Formater la date pour l'affichage
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? 'Hier' : `Il y a ${days} jours`;
    } else if (hours > 0) {
      return `Il y a ${hours} h`;
    } else if (minutes > 0) {
      return `Il y a ${minutes} min`;
    } else {
      return 'À l\'instant';
    }
  }
}