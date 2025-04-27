import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { StatsService } from '../../core/services/stats.service';
import { DashboardStats } from '../../core/models/stats.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  stats: DashboardStats | null = null;
  loading = true;
  error = false;

  // User Growth Chart
  public userGrowthChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { drawOnChartArea: false } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: true, position: 'top' } }
  };

  public userGrowthChartType: ChartType = 'line';
  public userGrowthChartData: ChartData<'line'> = { labels: [], datasets: [] };

  // Content Chart
  public contentChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { drawOnChartArea: false } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: true, position: 'top' } }
  };

  public contentChartType: ChartType = 'bar';
  public contentChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Engagement Distribution Chart
  public engagementChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'right' } }
  };

  public engagementChartType: ChartType = 'doughnut';
  public engagementChartData: ChartData<'doughnut'> = {
    labels: ['Likes', 'Comments'],
    datasets: [{ data: [0, 0], backgroundColor: ['#3f51b5', '#ff4081'] }]
  };

  constructor(
    private statsService: StatsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.error = false;

    this.statsService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = this.transformStats(stats);
        this.updateCharts(this.stats);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats', error);
        this.snackBar.open(
          error?.message || 'Error loading dashboard statistics. Please try again later.',
          'Close',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
        this.loading = false;
        this.error = true;
      }
    });
  }

  private transformStats(stats: any): DashboardStats {
    const totalLikes = Object.values(stats.likesOverTime || {}).reduce((sum: number, val: any) => sum + val, 0) || 0;
    const averageCommentsPerBuzz = stats.totalBuzzs ? stats.totalComments / stats.totalBuzzs : 0;

    return {
      userStats: {
        totalUsers: stats.totalUsers || 0,
        bannedUsers: stats.bannedUsers || 0,
        adminUsers: stats.adminUsers || 0,
        regularUsers: stats.regularUsers || 0,
        activeUsers: 0,
        newUsersToday: 0,
        usersTrend: 0
      },
      contentStats: {
        totalBuzzs: stats.totalBuzzs || 0,
        totalComments: stats.totalComments || 0,
        totalReports: stats.totalReports || 0,
        pendingReports: stats.pendingReports || 0,
        newBuzzsToday: 0,
        newCommentsToday: 0,
        contentTrend: 0
      },
      engagementStats: {
        totalLikes,
        averageCommentsPerBuzz,
        totalShares: 0,
        engagementRate: 0,
        engagementTrend: 0
      },
      growthData: {
        labels: [],
        datasets: [],
        usersOverTime: stats.usersOverTime || {},
        buzzsOverTime: stats.buzzsOverTime || {},
        commentsOverTime: stats.commentsOverTime || {},
        likesOverTime: stats.likesOverTime || {},
        reportsOverTime: stats.reportsOverTime || {}
      }
    };
  }

  private updateCharts(stats: DashboardStats): void {
    const allDates = Array.from(
      new Set([
        ...Object.keys(stats.growthData.usersOverTime),
        ...Object.keys(stats.growthData.buzzsOverTime),
        ...Object.keys(stats.growthData.commentsOverTime),
        ...Object.keys(stats.growthData.likesOverTime)
      ])
    ).sort();

    this.userGrowthChartData = {
      labels: allDates,
      datasets: [
        {
          data: allDates.map(date => stats.growthData.usersOverTime[date] || 0),
          label: 'Users',
          borderColor: '#d32f2f',
          backgroundColor: '#d32f2f33',
          pointBackgroundColor: '#d32f2f',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#d32f2f',
          fill: 'origin',
          tension: 0.4
        }
      ]
    };

    this.contentChartData = {
      labels: allDates,
      datasets: [
        {
          data: allDates.map(date => stats.growthData.buzzsOverTime[date] || 0),
          label: 'Buzzs',
          backgroundColor: '#d32f2f'
        },
        {
          data: allDates.map(date => stats.growthData.commentsOverTime[date] || 0),
          label: 'Comments',
          backgroundColor: '#ff4081'
        }
      ]
    };

    this.engagementChartData = {
      labels: ['Likes', 'Comments'],
      datasets: [
        {
          data: [stats.engagementStats.totalLikes, stats.contentStats.totalComments],
          backgroundColor: ['#d32f2f', '#ff4081']
        }
      ]
    };

    if (this.chart) {
      this.chart.update();
    }
  }

  getTrendClass(trend: number): string {
    if (trend > 0) return 'positive';
    if (trend < 0) return 'negative';
    return '';
  }

  getTrendIcon(trend: number): string {
    if (trend > 0) return 'trending_up';
    if (trend < 0) return 'trending_down';
    return 'trending_flat';
  }

  reload(): void {
    this.loadDashboardStats();
  }
}