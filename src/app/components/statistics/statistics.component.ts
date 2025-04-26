import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics-service.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  readStatusChart: ChartConfiguration<'doughnut'> | undefined;
  urgencyChart: ChartConfiguration<'bar'> | undefined;
  ratingChart: ChartConfiguration<'line'> | undefined;

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statsService.getReadStatus().subscribe(data => {
      this.readStatusChart = {
        type: 'doughnut',
        data: {
          labels: ['Read', 'Unread'],
          datasets: [{
            data: [data.read, data.unread],
            backgroundColor: ['#4caf50', '#f44336'],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            },
            title: {
              display: true,
              text: 'Read Status'
            }
          }
        }
      };
    });

    this.statsService.getUrgencyStats().subscribe(data => {
      this.urgencyChart = {
        type: 'bar',
        data: {
          labels: ['Normal', 'Urgent'],
          datasets: [{
            label: 'Number of Messages',
            data: [data.normal, data.urgent],
            backgroundColor: ['#2196f3', '#ff9800']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Urgency Level'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Urgency'
              }
            }
          }
        }
      };
    });

    this.statsService.getRatingDistribution().subscribe(data => {
      const ratings = Array.from(Object.entries(data)).map(([rating, count]) => ({
        rating: Number(rating),
        count: Number(count)
      })).sort((a, b) => a.rating - b.rating);

      this.ratingChart = {
        type: 'line',  // Changement ici
        data: {
          labels: ratings.map(r => `★ ${r.rating}`),
          datasets: [{
            label: 'Number of Ratings',
            data: ratings.map(r => r.count),
            borderColor: '#9c27b0',
            backgroundColor: '#e1bee7',
            fill: true,
            tension: 0.4, // rend la courbe plus fluide
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Rating Distribution'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Rating'
              }
            }
          }
        }
      };
    });
  }
}
