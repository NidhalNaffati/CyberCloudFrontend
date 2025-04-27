import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Buzz } from '../../core/models/buzz.model';
import { AppState } from '../../core/store/app.state';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectBookmarkedBuzzs, selectBuzzLoading } from '../../core/store/buzz/buzz.selectors';
import { BuzzCardComponent } from '../../shared/components/buzz-card/buzz-card.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BuzzCardComponent,
    AsyncPipe
  ],
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {
  bookmarkedBuzzs$: Observable<Buzz[]>;
  loading$: Observable<boolean>;
  currentPage = 0;
  pageSize = 10;

  constructor(private store: Store<AppState>) {
    this.bookmarkedBuzzs$ = this.store.select(selectBookmarkedBuzzs);
    this.loading$ = this.store.select(selectBuzzLoading);
  }

  ngOnInit(): void {
    this.loadBookmarkedBuzzs();
  }

  loadBookmarkedBuzzs(): void {
    this.store.dispatch(BuzzActions.loadBookmarkedBuzzs({
      page: this.currentPage,
      size: this.pageSize
    }));
  }

  loadMoreBuzzs(): void {
    this.currentPage++;
    this.loadBookmarkedBuzzs();
  }

  onBuzzDeleted(id: string): void {
    // This is handled by the store reducer
  }

  trackByBuzzId(index: number, buzz: Buzz): string {
    return buzz.id;
  }
}
