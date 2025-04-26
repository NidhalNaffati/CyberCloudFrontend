import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from 'src/app/services/activity.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  searchTerm: string = '';
  statistics: any = {};
  locationStats: any[] = [];
  monthlyStats: any[] = [];
  activityMetrics: { [key: number]: { waitlistCount: number, reservationsCount: number } } = {};
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  // Tri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Statistiques
  chartData: any[] = [];
  barChartData: any[] = [];
  // Pie chart for locations
locationChartData: { name: string; value: number }[] = []; // [{ name: 'Jendouba', value: 1 }, ...]

// Bar chart for monthly stats
monthlyChartData: { name: string; value: any }[] = [];

  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;

  constructor(private router: Router, private activityService: ActivityService) {}

  ngOnInit(): void {
    this.getActivities();
    this.loadStatistics();
    this.activityService.getLocationStatistics().subscribe(locStats => {
      this.locationChartData = locStats.map(loc => ({
        name: loc.location || loc[0], // support both {location, count} and [location, count]
        value: loc.count || loc[1]
      }));
    });

    this.activityService.getMonthlyStatistics().subscribe(monthStats => {
      this.monthlyChartData = monthStats.map(month => ({
        name: 'Mois ' + (month.month || month[0]),
        value: month.count || month[1]
      }));
    });
  }

  getActivities(): void {
    this.activityService.getActivities().subscribe(data => {
      this.activities = data;
      this.applyFilter(); // Appliquer filtre après chargement
    });
  }
  loadStatistics(): void {
    this.activityService.getGeneralStatistics().subscribe(data => {
      this.statistics = data;
    });

    this.activityService.getLocationStatistics().subscribe(data => {
      this.locationStats = data;
    });

    this.activityService.getMonthlyStatistics().subscribe(data => {
      this.monthlyStats = data;
    });
  }
  loadActivityMetrics(activityId: number): void {
    this.activityService.getActivityMetrics(activityId).subscribe(data => {
      this.activityMetrics[activityId] = data;
    });
  }
  applyFilter(): void {
    this.filteredActivities = this.searchTerm
      ? this.activities.filter(activity =>
          Object.values(activity).some(value =>
            value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        )
      : [...this.activities];

    this.updatePagination();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilter();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredActivities.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getPaginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredActivities.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredActivities.sort((a, b) => this.compareValues(a[column], b[column]));
    this.currentPage = 1;
  }

  private compareValues(a: any, b: any): number {
    if (a == null) return 1;
    if (b == null) return -1;
    if (a === b) return 0;

    if (a instanceof Date && b instanceof Date) {
      return this.sortDirection === 'asc'
        ? a.getTime() - b.getTime()
        : b.getTime() - a.getTime();
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return this.sortDirection === 'asc' ? a - b : b - a;
    }

    const comparison = a.toString().localeCompare(b.toString());
    return this.sortDirection === 'asc' ? comparison : -comparison;
  }
  navigateToAdd(): void {
    this.router.navigate(['/admin/add-activity']);
  }

  editActivity(id: number): void {
    this.router.navigate(['/admin/edit-activity', id]);
  }


  // ❌ Supprimer une activité
  deleteActivity(activityId: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette activité ?')) {
      this.activityService.deleteActivity(activityId).subscribe(() => {
        this.activities = this.activities.filter(activity => activity.activityId !== activityId);
        this.applyFilter();
      }, error => {
        console.error('Erreur lors de la suppression', error);
      });
    }
  }

  // 📊 Générer les statistiques (Pie & Bar Charts)
  generateStatistics(): void {
    const statsByLocation = new Map<string, number>();
    const statsByPrice = new Map<number, number>();

    this.activities.forEach(activity => {
      const location = activity.location;
      statsByLocation.set(location, (statsByLocation.get(location) || 0) + 1);

      const price = activity.price;
      statsByPrice.set(price, (statsByPrice.get(price) || 0) + 1);
    });

    this.chartData = Array.from(statsByLocation, ([name, value]) => ({ name, value }));
    this.barChartData = Array.from(statsByPrice, ([name, value]) => ({
      name: `${name} TND`,
      value
    }));
  }

  // 📄 Générer le PDF
  generatePDF(): void {
    const data = this.pdfTable.nativeElement;
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save('reservations.pdf');
    });
  }
}
