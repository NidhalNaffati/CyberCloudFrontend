import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; // Ajoutez cette importation
import { Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; // Pour la recherche réactive
import { ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-reservation-dashboard',
  templateUrl: './reservation-dashboard.component.html',
  styleUrls: ['./reservation-dashboard.component.css']
})
export class ReservationDashboardComponent implements OnInit {
  reservations: any[] = [];
  filteredReservations: any[] = [];
  searchControl = new FormControl(''); // Créez le FormControl
  chartData: any[] = [];
  barChartData: any[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
currentPage: number = 1;
itemsPerPage: number = 5;
totalPages: number = 1;
pages: number[] = [];
  constructor(
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1; // Reset to first page when search changes
        this.applyFilter();
      });
  }
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (data) => {
        this.reservations = data;
        this.applyFilter();
        this.generateStatistics();
      },
      (error) => {
        console.error('Erreur lors du chargement:', error);
      }
    );
  }
  applyFilter(): void {
    const term = (this.searchControl.value || '').toLowerCase();

    this.filteredReservations = term
      ? this.reservations.filter(reservation =>
          Object.values(reservation).some(value =>
            value?.toString().toLowerCase().includes(term)
          )
        )
      : [...this.reservations];

    this.updatePagination();
  }
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReservations.length / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }
  editReservation(id: number): void {
    this.router.navigate([`/reservation/edit/${id}`]);
  }
  editing: { id: number, field: string } | null = null;

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Edit a field of a reservation
   * @param reservation Reservation to edit
   * @param field Field to edit
   */
/*******  726d018d-a3ba-4363-87cb-cf2d02de525d  *******/  editField(reservation: any, field: string): void {
    this.editing = {
      id: reservation.activityReservationId,
      field
    };
  }

  saveField(reservation: any): void {
    if (!this.editing) return;

    const id = reservation.activityReservationId;

    this.reservationService.updateReservation(id, reservation).subscribe({
      next: () => {
        console.log('Mise à jour réussie');
        this.editing = null;
        this.generateStatistics(); // Recalculer les stats si besoin
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe(
        () => {
          this.reservations = this.reservations.filter(res => res.activityReservationId !== id);
          this.generateStatistics(); // Mettre à jour les stats après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;



  async generatePDF() {
    const element = this.pdfContent.nativeElement;

    const options = {
      margin: 10,
      filename: 'reservations.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    try {
      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Handle error (show user message, etc.)
    }
  }

  generateStatistics(): void {
    const statsByActivity = new Map<string, number>();
    const statsBySeats = new Map<number, number>();

    this.reservations.forEach(reservation => {
      const activityName = reservation.activity?.name || 'Inconnue';
      statsByActivity.set(activityName, (statsByActivity.get(activityName) || 0) + 1);

      const seats = reservation.numberOfSeats;
      statsBySeats.set(seats, (statsBySeats.get(seats) || 0) + 1);
    });

    this.chartData = Array.from(statsByActivity, ([name, value]) => ({ name, value }));
    this.barChartData = Array.from(statsBySeats, ([name, value]) => ({
      name: `${name} place${name > 1 ? 's' : ''}`,
      value
    }));
  }
  getPaginatedReservations(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReservations.slice(startIndex, endIndex);
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

    this.filteredReservations.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null) return 1;
      if (valueB == null) return -1;
      if (valueA === valueB) return 0;

      const comparison = valueA > valueB ? 1 : -1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.currentPage = 1;
    this.updatePagination();
  }
  sendReminder(id: number): void {
    this.reservationService.sendReminderEmail(id).subscribe({
      next: (response) => alert(response),
      error: (err) => alert('Erreur lors de l’envoi : ' + err.error)
    });
  }
}
