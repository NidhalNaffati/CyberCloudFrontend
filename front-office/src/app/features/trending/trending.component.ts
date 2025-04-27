import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Buzz, TrendingBuzz } from '../../core/models/buzz.model';
import { AppState } from '../../core/store/app.state';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectTrendingBuzzs, selectPopularBuzzs, selectBuzzLoading } from '../../core/store/buzz/buzz.selectors';
import { BuzzCardComponent } from '../../shared/components/buzz-card/buzz-card.component';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    BuzzCardComponent,
    AsyncPipe
  ],
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss']
})
export class TrendingComponent implements OnInit {
  trendingBuzzs$: Observable<TrendingBuzz[]>;
  popularBuzzs$: Observable<Buzz[]>;
  loading$: Observable<boolean>;
  activeTab = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(private store: Store<AppState>) {
    this.trendingBuzzs$ = this.store.select(selectTrendingBuzzs);
    this.popularBuzzs$ = this.store.select(selectPopularBuzzs);
    this.loading$ = this.store.select(selectBuzzLoading);
  }

  ngOnInit(): void {
    this.loadTrendingBuzzs();
    this.loadPopularBuzzs();
  }

  loadTrendingBuzzs(): void {
    this.store.dispatch(BuzzActions.loadTrendingBuzzs());
  }

  loadPopularBuzzs(): void {
    this.store.dispatch(BuzzActions.loadPopularBuzzs({
      page: this.currentPage,
      size: this.pageSize
    }));
  }

  loadMorePopularBuzzs(): void {
    this.currentPage++;
    this.loadPopularBuzzs();
  }

  trackByBuzzId(index: number, buzz: Buzz): string {
    return buzz.id;
  }

  trackByTrendingBuzzId(index: number, buzz: TrendingBuzz): string {
    return buzz.id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
}
