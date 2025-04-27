import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule, DOCUMENT } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Buzz } from '../../../core/models/buzz.model';
import { User } from '../../../core/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/store/app.state';
import * as BuzzActions from '../../../core/store/buzz/buzz.actions';
import { selectCurrentUser } from '../../../core/store/auth/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-buzz-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    AsyncPipe
  ],
  templateUrl: './buzz-card.component.html',
  styleUrls: ['./buzz-card.component.scss']
})
export class BuzzCardComponent {
  @Input() buzz!: Buzz;
  @Output() deleted = new EventEmitter<string>();
  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;
  @ViewChild('reportDialog') reportDialog!: TemplateRef<any>;
  
  currentUser$: Observable<User | null>;
  selectedReportReason: string = '';
  reportReasons: string[] = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam or misleading',
    'Violence or threats',
    'Hate speech or symbols',
    'Intellectual property violation',
    'Other'
  ];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  navigateToBuzz(): void {
    this.router.navigate(['/buzz', this.buzz.id]);
  }

  navigateToProfile(event: Event, username: string): void {
    event.stopPropagation();
    this.router.navigate(['/profile', username]);
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    if (this.buzz.likedByCurrentUser) {
      this.store.dispatch(BuzzActions.unlikeBuzz({ id: this.buzz.id }));
    } else {
      this.store.dispatch(BuzzActions.likeBuzz({ id: this.buzz.id }));
    }
  }

  toggleBookmark(event: Event): void {
    event.stopPropagation();
    if (this.buzz.bookmarkedByCurrentUser) {
      this.store.dispatch(BuzzActions.unbookmarkBuzz({ id: this.buzz.id }));
    } else {
      this.store.dispatch(BuzzActions.bookmarkBuzz({ id: this.buzz.id }));
    }
  }

  deleteBuzz(event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this buzz?')) {
      this.store.dispatch(BuzzActions.deleteBuzz({ id: this.buzz.id }));
      this.deleted.emit(this.buzz.id);
    }
  }
  
  shareBuzz(event: Event): void {
    event.stopPropagation();
    this.dialog.open(this.shareDialog);
    this.incrementShareCount();
  }
  
  reportBuzz(event: Event): void {
    event.stopPropagation();
    this.selectedReportReason = '';
    this.dialog.open(this.reportDialog);
  }
  
  getShareLink(): string {
    return `${this.document.location.origin}/buzz/${this.buzz.id}`;
  }
  
  copyShareLink(input: HTMLInputElement): void {
    input.select();
    this.document.execCommand('copy');
    this.snackBar.open('Link copied to clipboard', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['share-success-snackbar']
    });
  }
  
  shareVia(platform: string): void {
    const url = encodeURIComponent(this.getShareLink());
    const text = encodeURIComponent(`Check out this buzz: ${this.buzz.title}`);
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text} ${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${text}&body=${text} ${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      this.incrementShareCount();
      this.dialog.closeAll();
    }
  }
  
  incrementShareCount(): void {
    // In a real application, this would be an API call
    // Here we'll just update the local state for demo purposes
    this.buzz.shareCount++;
  }
  
  submitReport(): void {
    if (this.selectedReportReason) {
      // In a real app, this would be an API call to report the content
      console.log(`Reporting buzz ${this.buzz.id} for reason: ${this.selectedReportReason}`);
      
      this.snackBar.open('Thank you for your report', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      
      this.dialog.closeAll();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return `${diffSecs}s`;
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
