import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { Buzz } from '../../core/models/buzz.model';
import { AppState } from '../../core/store/app.state';
import * as UserActions from '../../core/store/user/user.actions';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectCurrentProfile, selectUserLoading, selectFollowers, selectFollowing } from '../../core/store/user/user.selectors';
import { selectUserBuzzs, selectBuzzLoading } from '../../core/store/buzz/buzz.selectors';
import { selectCurrentUser } from '../../core/store/auth/auth.selectors';
import { BuzzCardComponent } from '../../shared/components/buzz-card/buzz-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    MatListModule,
    BuzzCardComponent,
    AsyncPipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile$: Observable<User | null>;
  userBuzzs$: Observable<Buzz[]>;
  currentUser$: Observable<User | null>;
  userLoading$: Observable<boolean>;
  buzzLoading$: Observable<boolean>;
  followers$: Observable<User[]>;
  following$: Observable<User[]>;
  
  username!: string;
  isOwnProfile = false;
  currentPage = 0;
  pageSize = 10;
  
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {
    this.profile$ = this.store.select(selectCurrentProfile);
    this.userBuzzs$ = this.store.select(selectUserBuzzs);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.userLoading$ = this.store.select(selectUserLoading);
    this.buzzLoading$ = this.store.select(selectBuzzLoading);
    this.followers$ = this.store.select(selectFollowers);
    this.following$ = this.store.select(selectFollowing);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.username = username;
        this.loadUserProfile();
        this.loadUserBuzzs();
        
        // Check if this is the current user's profile
        this.currentUser$.subscribe(currentUser => {
          if (currentUser) {
            this.isOwnProfile = currentUser.username === username;
          }
        });
      }
    });
  }

  loadUserProfile(): void {
    this.store.dispatch(UserActions.getUserProfile({ username: this.username }));
  }

  loadUserBuzzs(): void {
    this.store.dispatch(BuzzActions.loadUserBuzzs({
      username: this.username,
      page: this.currentPage,
      size: this.pageSize
    }));
  }

  loadMoreBuzzs(): void {
    this.currentPage++;
    this.loadUserBuzzs();
  }

  followUser(): void {
    this.profile$.subscribe(profile => {
      if (profile?.id) {
        this.store.dispatch(UserActions.followUser({ 
          userId: profile.id,
          username: profile.username 
        }));
      }
    }).unsubscribe(); // Unsubscribe immediately after dispatching
  }

  unfollowUser(profile: User): void {
    if (profile?.id) {
      this.store.dispatch(UserActions.unfollowUser({ 
        userId: profile.id,
        username: profile.username 
      }));
    }
  }

  loadFollowers(): void {
    this.store.dispatch(UserActions.getUserFollowers({
      username: this.username,
      page: 0,
      size: 50
    }));
  }

  loadFollowing(): void {
    this.store.dispatch(UserActions.getUserFollowing({
      username: this.username,
      page: 0,
      size: 50
    }));
  }

  trackByBuzzId(index: number, buzz: Buzz): string {
    return buzz.id;
  }

  formatJoinDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
