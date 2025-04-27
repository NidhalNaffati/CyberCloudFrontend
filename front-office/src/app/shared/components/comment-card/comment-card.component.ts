import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Comment } from '../../../core/models/comment.model';
import { User } from '../../../core/models/user.model';
import { AppState } from '../../../core/store/app.state';
import * as BuzzActions from '../../../core/store/buzz/buzz.actions';
import { selectCurrentUser } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    AsyncPipe
  ],
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent {
  @Input() comment!: Comment;
  @Output() deleted = new EventEmitter<string>();
  currentUser$: Observable<User | null>;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  navigateToProfile(event: Event, username: string): void {
    event.stopPropagation();
    this.router.navigate(['/profile', username]);
  }

  likeComment(event: Event): void {
    event.stopPropagation();
    if (this.comment.likedByCurrentUser) {
      this.store.dispatch(BuzzActions.unlikeComment({ commentId: this.comment.id }));
    } else {
      this.store.dispatch(BuzzActions.likeComment({ commentId: this.comment.id }));
    }
  }

  dislikeComment(event: Event): void {
    event.stopPropagation();
    if (this.comment.dislikedByCurrentUser) {
      this.store.dispatch(BuzzActions.unlikeComment({ commentId: this.comment.id }));
    } else {
      this.store.dispatch(BuzzActions.dislikeComment({ commentId: this.comment.id }));
    }
  }

  deleteComment(event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this comment?')) {
      this.store.dispatch(BuzzActions.deleteComment({ commentId: this.comment.id }));
      this.deleted.emit(this.comment.id);
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
