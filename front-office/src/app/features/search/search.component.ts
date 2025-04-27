import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../../core/models/user.model';
import { Buzz } from '../../core/models/buzz.model';
import { AppState } from '../../core/store/app.state';
import * as UserActions from '../../core/store/user/user.actions';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectUserSearchResults, selectUserLoading } from '../../core/store/user/user.selectors';
import { selectSearchResults, selectBuzzLoading } from '../../core/store/buzz/buzz.selectors';
import { BuzzCardComponent } from '../../shared/components/buzz-card/buzz-card.component';

@Component({
  selector: 'app-search',
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
    MatProgressSpinnerModule,
    MatTabsModule,
    BuzzCardComponent,
    AsyncPipe
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  userResults$: Observable<User[]>;
  buzzResults$: Observable<Buzz[]>;
  userLoading$: Observable<boolean>;
  buzzLoading$: Observable<boolean>;
  activeTab = 0;
  lastSearchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private store: Store<AppState>
  ) {
    this.userResults$ = this.store.select(selectUserSearchResults);
    this.buzzResults$ = this.store.select(selectSearchResults);
    this.userLoading$ = this.store.select(selectUserLoading);
    this.buzzLoading$ = this.store.select(selectBuzzLoading);
  }

  ngOnInit(): void {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.lastSearchTerm = params['q'];
        this.searchControl.setValue(params['q']);
        this.performSearch(params['q']);
      }
      
      if (params['tab'] === 'buzzs') {
        this.activeTab = 1;
      } else {
        this.activeTab = 0;
      }
    });

    // Set up search input
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query && query.length > 0) {
        this.lastSearchTerm = query;
        this.performSearch(query);
        this.updateQueryParams();
      }
    });
  }
  
  /**
   * Update the URL query parameters to reflect the current search state
   */
  updateQueryParams(): void {
    this.ngZone.run(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          q: this.lastSearchTerm || null,
          tab: this.activeTab === 1 ? 'buzzs' : 'people'
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  /**
   * Perform a search based on the current tab
   */
  searchWithCurrentTab(): void {
    if (this.searchControl.value) {
      this.performSearch(this.searchControl.value);
      this.updateQueryParams();
    }
  }

  /**
   * Perform search based on the given query
   */
  performSearch(query: string | null): void {
    if (!query) return;
    
    // Search for users
    if (this.activeTab === 0) {
      this.store.dispatch(UserActions.searchUsers({
        query,
        page: 0,
        size: 20
      }));
    }

    // Search for buzzs
    if (this.activeTab === 1) {
      this.store.dispatch(BuzzActions.searchBuzzs({
        query,
        page: 0,
        size: 20
      }));
    }
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

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  trackByBuzzId(index: number, buzz: Buzz): string {
    return buzz.id;
  }
}
