import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Buzz } from '../../core/models/buzz.model';
import { BuzzService } from '../../core/services/buzz.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-buzzs',
  templateUrl: './buzzs.component.html',
  styleUrls: ['./buzzs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCardModule,
    
  ]
})
export class BuzzsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<Buzz>([]);
  displayedColumns: string[] = ['author', 'content', 'media', 'engagement', 'createdAt', 'actions'];
  
  loading = false;
  searchControl = new FormControl('');
  
  constructor(
    private buzzService: BuzzService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBuzzs();
    
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.searchBuzzs(value);
        } else if (!value) {
          this.loadBuzzs();
        }
      });
  }

  loadBuzzs(): void {
    this.loading = true;
    
    this.buzzService.getBuzzs()
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.content;
          this.loading = false;
          
          // Set up sorting and pagination after data is loaded
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        },
        error: (error) => {
          console.error('Error loading buzzs', error);
          this.snackBar.open('Failed to load buzz posts', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  searchBuzzs(query: string): void {
    this.loading = true;
    
    this.buzzService.searchBuzzs(query)
      .subscribe({
        next: (buzzs) => {
          this.dataSource.data = buzzs;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching buzzs', error);
          this.snackBar.open('Failed to search buzz posts', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  /**
   * Deletes a buzz post
   * Uses the API endpoint: DELETE /api/admin/dashboard/buzzs/{id}
   * This will also delete all comments associated with this buzz post
   * @param buzz The buzz post to delete
   */
  deleteBuzz(buzz: Buzz): void {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Buzz Post',
      message: 'Are you sure you want to delete this buzz post? This action cannot be undone and will also remove all comments associated with this post.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      isDanger: true
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // Call API endpoint according to documentation
        this.buzzService.deleteBuzz(buzz.id)
          .subscribe({
            next: () => {
              // Remove the buzz from the data source
              this.dataSource.data = this.dataSource.data.filter(b => b.id !== buzz.id);
              
              this.snackBar.open('Buzz post deleted successfully', 'Close', {
                duration: 3000
              });
              this.loading = false;
            },
            error: (error) => {
              console.error('Error deleting buzz post', error);
              this.snackBar.open('Failed to delete buzz post', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              this.loading = false;
            }
          });
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadBuzzs();
  }

  reload(): void {
    this.loadBuzzs();
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  truncateContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }
  
  hasMedia(buzz: Buzz): boolean {
    return !!buzz.mediaUrl;
  }
  
  getMediaType(buzz: Buzz): string {
    if (!buzz.mediaUrl) return 'none';
    
    // Determine media type based on URL extension or content type
    const url = buzz.mediaUrl.toLowerCase();
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') || 
        url.includes('/image/') || url.includes('picsum.photos')) {
      return 'image';
    }
    
    if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || 
        url.includes('/video/') || url.includes('example.com/video')) {
      return 'video';
    }
    
    return 'image'; // Default to image for unknown media types
  }
}
