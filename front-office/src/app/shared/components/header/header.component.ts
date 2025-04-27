import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { AppState } from '../../../core/store/app.state';
import { User } from '../../../core/models/user.model';
import { selectCurrentUser, selectIsAuthenticated } from '../../../core/store/auth/auth.selectors';
import * as AuthActions from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  searchControl = new FormControl('');

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.user$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  ngOnInit(): void {
    this.setupSearch();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query && query.length > 0) {
        this.router.navigate(['/search'], { queryParams: { q: query } });
      }
    });
  }

  submitSearch(): void {
    const query = this.searchControl.value;
    if (query && query.length > 0) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchControl.setValue(''); // Clear the search input
    }
  }
}
