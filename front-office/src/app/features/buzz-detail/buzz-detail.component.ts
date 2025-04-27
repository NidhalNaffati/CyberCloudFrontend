import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Buzz } from '../../core/models/buzz.model';
import { Comment } from '../../core/models/comment.model';
import { User } from '../../core/models/user.model';
import { AppState } from '../../core/store/app.state';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectCurrentBuzz, selectComments, selectBuzzLoading } from '../../core/store/buzz/buzz.selectors';
import { selectCurrentUser } from '../../core/store/auth/auth.selectors';
import { CommentCardComponent } from '../../shared/components/comment-card/comment-card.component';

@Component({
  selector: 'app-buzz-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    CommentCardComponent,
    AsyncPipe
  ],
  templateUrl: './buzz-detail.component.html',
  styleUrls: ['./buzz-detail.component.scss']
})
export class BuzzDetailComponent implements OnInit, OnDestroy {
  buzz$: Observable<Buzz | null>;
  comments$: Observable<Comment[]>;
  loading$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  commentForm: FormGroup;
  buzzId!: string;
  private routeSub!: Subscription;
  currentPage = 0;
  pageSize = 20;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.buzz$ = this.store.select(selectCurrentBuzz);
    this.comments$ = this.store.select(selectComments);
    this.loading$ = this.store.select(selectBuzzLoading);
    this.currentUser$ = this.store.select(selectCurrentUser);
    
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.buzzId = id;
        this.loadBuzz();
        this.loadComments();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadBuzz(): void {
    this.store.dispatch(BuzzActions.loadBuzz({ id: this.buzzId }));
  }

  loadComments(): void {
    this.store.dispatch(BuzzActions.loadComments({
      buzzId: this.buzzId,
      page: this.currentPage,
      size: this.pageSize
    }));
  }

  loadMoreComments(): void {
    this.currentPage++;
    this.loadComments();
  }

  toggleLike(buzz: Buzz): void {
    if (buzz.likedByCurrentUser) {
      this.store.dispatch(BuzzActions.unlikeBuzz({ id: buzz.id }));
    } else {
      this.store.dispatch(BuzzActions.likeBuzz({ id: buzz.id }));
    }
  }

  toggleBookmark(buzz: Buzz): void {
    if (buzz.bookmarkedByCurrentUser) {
      this.store.dispatch(BuzzActions.unbookmarkBuzz({ id: buzz.id }));
    } else {
      this.store.dispatch(BuzzActions.bookmarkBuzz({ id: buzz.id }));
    }
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      this.store.dispatch(BuzzActions.createComment({
        buzzId: this.buzzId,
        comment: this.commentForm.value
      }));
      this.commentForm.reset();
    }
  }

  deleteBuzz(buzz: Buzz): void {
    if (confirm('Are you sure you want to delete this buzz?')) {
      this.store.dispatch(BuzzActions.deleteBuzz({ id: buzz.id }));
      this.router.navigate(['/']);
    }
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment.id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
