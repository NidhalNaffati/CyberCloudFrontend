import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint';
import { trigger, transition, style, animate } from '@angular/animations';
import { Chart } from 'chart.js/auto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-list-complaints',
  templateUrl: './list-complaints.component.html',
  styleUrls: ['./list-complaints.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ListComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  paginatedComplaints: Complaint[] = [];
  filterDate: string = '';
  searchSubject: string = '';

  selectedComplaintId: number | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;


  constructor(private complaintService: ComplaintService, private sanitizer: DomSanitizer  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.totalPages = Math.ceil(this.complaints.length / this.itemsPerPage);
        this.updatePaginatedComplaints();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des plaintes:', err);
      }
    });
  }


  getSafeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  
  
  filterComplaints() {
    this.applyFilters();
  }
  
  applyFilters() {
    let filtered = [...this.complaints];
    
    // Apply date filter if present
    if (this.filterDate) {
      const selectedDate = new Date(this.filterDate);
      filtered = filtered.filter(complaint => {
        const complaintDate = new Date(complaint.date);
        return complaintDate.toDateString() === selectedDate.toDateString();
      });
    }
    
    // Apply subject search if present
    if (this.searchSubject && this.searchSubject.trim() !== '') {
      const searchTerm = this.searchSubject.toLowerCase().trim();
      filtered = filtered.filter(complaint => 
        complaint.subject && complaint.subject.toLowerCase().includes(searchTerm)
      );
    }
    
    // Update pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginatedComplaints = filtered.slice(0, this.itemsPerPage);
  }
  
  searchComplaints() {
    this.applyFilters();
  }
  
  clearFilter() {
    this.filterDate = '';
    this.searchSubject = '';
    this.totalPages = Math.ceil(this.complaints.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedComplaints();
  }
  
  updatePaginatedComplaints(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedComplaints = this.complaints.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      // Get filtered complaints based on current filters
      let filtered = [...this.complaints];
      
      // Apply date filter
      if (this.filterDate) {
        const selectedDate = new Date(this.filterDate);
        filtered = filtered.filter(complaint => {
          const complaintDate = new Date(complaint.date);
          return complaintDate.toDateString() === selectedDate.toDateString();
        });
      }
      
      // Apply subject search
      if (this.searchSubject && this.searchSubject.trim() !== '') {
        const searchTerm = this.searchSubject.toLowerCase().trim();
        filtered = filtered.filter(complaint => 
          complaint.subject && complaint.subject.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedComplaints = filtered.slice(start, end);
    }
  }
  

  delete(id: number | undefined): void {
    if (id !== undefined) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(c => c.complaintId !== id);
          this.totalPages = Math.ceil(this.complaints.length / this.itemsPerPage);
          if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          this.updatePaginatedComplaints();
       
        },
        error: (err) => {
          console.error("Erreur lors de la suppression de la plainte:", err);
        }
      });
    }
  }

  openModal(complaintId: number): void {
    this.selectedComplaintId = complaintId;

    this.complaintService.markComplaintAsRead(complaintId).subscribe({
      next: () => {
        const modalElement = document.getElementById('responseModal1');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        } else {
          console.error('Modal non trouvée ou Bootstrap manquant.');
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la plainte:", err);
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('responseModal1');
    if (modalElement && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      this.selectedComplaintId = null;
    }
  }

  
}
