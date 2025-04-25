import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Activity } from 'src/app/models/activity.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  recommendedActivitiesByDay: Activity[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 6;
  waitlistEmails: {[key: number]: string} = {};
  waitlistStatus: {[key: number]: boolean} = {};


  constructor(
    private activityService: ActivityService,
    private router: Router
  ) {}
  interestedActivitiesIds: number[] = [];
  ngOnInit(): void {
    this.loadActivities();
    this.subscribeToActivitiesUpdates();
    this.loadInterestedActivities();
    this.loadRecommendedActivitiesForToday();
   // this.loadWaitlistStatus();
  }
  loadRecommendedActivitiesForToday(): void {
    this.activityService.getActivitiesForToday().subscribe({
      next: (activities) => {
        if (activities && activities.length > 0) {
          this.recommendedActivitiesByDay = activities.map(activity =>
            this.transformActivity(activity)
          );
        } else {
          console.log('No activities found for today');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Impossible de charger les activités du jour';
        this.isLoading = false;
      }
    });
  }
 // Changer loadActivities de private à public
public loadActivities(): void {  // Ajout de public
  this.isLoading = true;
  this.errorMessage = null;
  this.activityService.refreshActivities();
}

  private subscribeToActivitiesUpdates(): void {
    this.activityService.activities$.subscribe({
      next: (activities) => {
        this.activities = activities.map(activity => this.transformActivity(activity));
        this.filteredActivities = [...this.activities];
        this.isLoading = false;
        this.updateWaitlistStatusForAll();
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private transformActivity(activity: any): Activity {
    let imageUrl: string;

    if (activity.imagePath) {
      if (activity.imagePath.startsWith('http')) {
        imageUrl = activity.imagePath;
      } else {

        imageUrl = '/assets/images/default-activity.jpg';
      }
    } else {
      imageUrl = '/assets/images/default-activity.jpg';
    }

    return {
      ...activity,
      image: imageUrl,
      formattedDate: this.formatActivityDate(activity.date)
    };
  }

  private getBaseImageUrl(): string {
    return 'http://localhost:8089/activities/images';
  }

  private formatActivityDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  private handleError(error: any): void {
    console.error('Error loading activities:', error);
    this.errorMessage = 'Impossible de charger les activités. Veuillez réessayer plus tard.';
  }

  reserveActivity(activityId: number): void {
    this.router.navigate(['/reservation', activityId]);
  }

  filterActivities(): void {
    if (!this.searchTerm) {
      this.filteredActivities = [...this.activities];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredActivities = this.activities.filter(activity =>
      activity.name.toLowerCase().includes(term) ||
      activity.details.toLowerCase().includes(term) ||
      activity.location.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  get paginatedActivities(): Activity[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredActivities.slice(start, start + this.itemsPerPage);
  }
  get totalPages(): number {
    return Math.ceil(this.filteredActivities.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  resetSearch(): void {
    this.searchTerm = '';
    this.filteredActivities = [...this.activities];
    this.currentPage = 1;
  }
  loadInterestedActivities(): void {
    const stored = localStorage.getItem('interestedActivities');
    this.interestedActivitiesIds = stored ? JSON.parse(stored) : [];
  }

  toggleInterest(activityId: number): void {
    const index = this.interestedActivitiesIds.indexOf(activityId);
    if (index === -1) {
      this.interestedActivitiesIds.push(activityId);
    } else {
      this.interestedActivitiesIds.splice(index, 1);
    }
    localStorage.setItem('interestedActivities', JSON.stringify(this.interestedActivitiesIds));
    this.sortActivitiesByInterest();
  }

  isInterested(activityId: number): boolean {
    return this.interestedActivitiesIds.includes(activityId);
  }

  private sortActivitiesByInterest(): void {
    this.filteredActivities.sort((a, b) => {
      const aInterested = this.isInterested(a.activityId) ? -1 : 0;
      const bInterested = this.isInterested(b.activityId) ? -1 : 0;
      return aInterested - bInterested;
    });
  }
  joinWaitlist(activityId: number): void {
    this.activityService.joinWaitlist(activityId).subscribe({
      next: () => {
        this.activityService.checkWaitlistStatus(activityId).subscribe({
          next: (isOnWaitlist) => {
            this.waitlistStatus[activityId] = isOnWaitlist;
            alert('Inscription confirmée ! Vous serez notifié si une place se libère.');
          }
        });
      },
      error: (err) => {
        alert('Erreur: ' + (err.error?.message || 'Inscription impossible'));
        console.error('Waitlist error:', err);
      }
    });
  }
  private updateWaitlistStatusForAll(): void {
    this.activities.forEach(activity => {
      this.activityService.checkWaitlistStatus(activity.activityId).subscribe({
        next: (isOnWaitlist) => {
          this.waitlistStatus[activity.activityId] = isOnWaitlist;
        },
        error: () => {
          this.waitlistStatus[activity.activityId] = false;
        }
      });
    });
  }

  isOnWaitlist(activityId: number): boolean {
    return this.waitlistStatus[activityId] === true;
  }
  /*removeFromWaitlist(activityId: number): void {
    this.activityService.removeFromWaitlist(activityId).subscribe({
      next: () => {
        this.waitlistStatus[activityId] = false;
        alert('Vous avez été retiré de la liste d\'attente.');
      },
      error: (err) => {
        alert('Erreur: ' + (err.error?.message || 'Impossible de se retirer'));
        console.error('Error removing from waitlist:', err);
      }
    });
  }*/

}
