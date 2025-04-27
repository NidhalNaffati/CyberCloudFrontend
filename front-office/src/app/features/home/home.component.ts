import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Buzz } from '../../core/models/buzz.model';
import { User } from '../../core/models/user.model';
import { AppState } from '../../core/store/app.state';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import * as UserActions from '../../core/store/user/user.actions';
import { 
  selectFeed, 
  selectPopularBuzzs, 
  selectUnpopularBuzzs,
  selectBuzzLoading 
} from '../../core/store/buzz/buzz.selectors';
import { selectCurrentUser } from '../../core/store/auth/auth.selectors';
import { selectSuggestedUsers } from '../../core/store/user/user.selectors';
import { BuzzCardComponent } from '../../shared/components/buzz-card/buzz-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    BuzzCardComponent,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  feed$: Observable<Buzz[]>;
  popularBuzzs$: Observable<Buzz[]>;
  unpopularBuzzs$: Observable<Buzz[]>;
  loading$: Observable<boolean>;
  currentUser$: Observable<User | null>;
  suggestedUsers$: Observable<User[]>;
  
  // Keep separate pagination for each feed type
  activeTab = 0;
  followingPage = 0;
  popularPage = 0;
  unpopularPage = 0;
  pageSize = 10;

  constructor(private store: Store<AppState>) {
    this.feed$ = this.store.select(selectFeed).pipe(
      map(buzzes => buzzes.filter(buzz => buzz.user && (buzz.user.fullName || buzz.user.username)))
    );
    this.popularBuzzs$ = this.store.select(selectPopularBuzzs).pipe(
      map(buzzes => buzzes.filter(buzz => buzz.user && (buzz.user.fullName || buzz.user.username)))
    );
    this.unpopularBuzzs$ = this.store.select(selectUnpopularBuzzs).pipe(
      map(buzzes => buzzes.filter(buzz => buzz.user && (buzz.user.fullName || buzz.user.username)))
    );
    this.loading$ = this.store.select(selectBuzzLoading);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.suggestedUsers$ = this.store.select(selectSuggestedUsers);
  }

  ngOnInit(): void {
    this.loadAllFeeds();
    this.loadSuggestedUsers();
    // Log buzzes to debug null fullName
    this.feed$.subscribe(buzzes => {
      console.log('Following feed buzzes (filtered):', buzzes);
    });
    this.popularBuzzs$.subscribe(buzzes => {
      console.log('Popular buzzes (filtered):', buzzes);
    });
    this.unpopularBuzzs$.subscribe(buzzes => {
      console.log('Unpopular buzzes (filtered):', buzzes);
    });

    
    
  }

  // Load initial data for all feed types
  loadAllFeeds(): void {
    this.loadFollowingFeed();
    this.loadPopularFeed();
    this.loadUnpopularFeed();
  }

  // Following feed (users you follow)
  loadFollowingFeed(): void {
    this.store.dispatch(BuzzActions.loadFeed({
      page: this.followingPage,
      size: this.pageSize
    }));
  }

  loadMoreFollowingBuzzs(): void {
    this.followingPage++;
    this.loadFollowingFeed();
  }

  // Popular feed
  loadPopularFeed(): void {
    this.store.dispatch(BuzzActions.loadPopularBuzzs({
      page: this.popularPage,
      size: this.pageSize
    }));
  }

  loadMorePopularBuzzs(): void {
    this.popularPage++;
    this.loadPopularFeed();
  }

  // Unpopular feed
  loadUnpopularFeed(): void {
    this.store.dispatch(BuzzActions.loadUnpopularBuzzs({
      page: this.unpopularPage,
      size: this.pageSize
    }));
  }

  loadMoreUnpopularBuzzs(): void {
    this.unpopularPage++;
    this.loadUnpopularFeed();
  }

  // Tab change handler
  onTabChange(tabIndex: number): void {
    this.activeTab = tabIndex;
  }

  // Get appropriate load more method based on active tab
  loadMoreBuzzs(): void {
    switch (this.activeTab) {
      case 0:
        this.loadMoreFollowingBuzzs();
        break;
      case 1:
        this.loadMorePopularBuzzs();
        break;
      case 2:
        this.loadMoreUnpopularBuzzs();
        break;
    }
  }

  loadSuggestedUsers(): void {
    this.store.dispatch(UserActions.getSuggestedUsers({
      page: 0,
      size: 5
    }));
  }

  followUser(user: User): void {
    this.store.dispatch(UserActions.followUser({ 
      userId: user.id,
      username: user.username 
    }));
  }

  unfollowUser(user: User): void {
    this.store.dispatch(UserActions.unfollowUser({ 
      userId: user.id,
      username: user.username 
    }));
  }

  trackByBuzzId(index: number, buzz: Buzz): string {
    return buzz.id;
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}