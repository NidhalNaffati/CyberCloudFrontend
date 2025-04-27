import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics-service.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // Chart data
  readUnreadData: any[] = [];
  urgencyData: any[] = [];
  ratingsData: any[] = [];
  
  // Chart options
  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Rating';
  yAxisLabel = 'Count';
  timeline = true;
  autoScale = true;
  
  // Color scheme
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#FFA500', '#4682B4']
  };

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Load read/unread stats for pie chart
    this.statisticsService.getComplaintStatus().subscribe(data => {
      this.readUnreadData = [
        { name: 'Read', value: data.read },
        { name: 'Unread', value: data.unread }
      ];
    });

    // Load urgency stats for bar chart
    this.statisticsService.getComplaintUrgency().subscribe(data => {
      this.urgencyData = [
        { name: 'Urgent', value: data.urgent },
        { name: 'Normal', value: data.normal }
      ];
    });

    // Load ratings for line chart
   // In statistics.component.ts
this.statisticsService.getComplaintRatings().subscribe((ratingsObj: {[key: number]: number}) => {
  // Convert object to array format for ngx-charts
  const ratingsArray = Object.entries(ratingsObj)
    .map(([rating, count]) => ({
      name: rating.toString(),
      value: count
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  
  this.ratingsData = [{
    name: 'Ratings Distribution',
    series: ratingsArray
  }];
});
}
}