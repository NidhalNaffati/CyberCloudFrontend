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
import { Comment } from '../../core/models/comment.model';
import { CommentService } from '../../core/services/comment.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
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
    LoadingSpinnerComponent
  ]
})
export class CommentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<Comment>([]);
  displayedColumns: string[] = ['author', 'content', 'buzzId', 'buzzContent', 'createdAt', 'actions'];
  
  loading = false;
  searchControl = new FormControl('');
  
  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadComments();
    
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.searchComments(value);
        } else if (!value) {
          this.loadComments();
        }
      });
  }

  loadComments(): void {
    this.loading = true;
    
    this.commentService.getComments()
      .subscribe({
        next: (comments) => {
          this.dataSource.data = comments;
          this.loading = false;
          
          // Set up sorting and pagination after data is loaded
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        },
        error: (error) => {
          console.error('Error loading comments', error);
          this.snackBar.open('Failed to load comments', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  searchComments(query: string): void {
    this.loading = true;
    
    this.commentService.searchComments(query)
      .subscribe({
        next: (comments) => {
          this.dataSource.data = comments;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching comments', error);
          this.snackBar.open('Failed to search comments', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  /**
   * Deletes a comment
   * Uses the API endpoint: DELETE /api/admin/dashboard/comments/{id}
   * This will permanently remove the comment from the database
   * @param comment The comment to delete
   */
  deleteComment(comment: Comment): void {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Comment',
      message: `Are you sure you want to delete this comment by ${comment.user.username}? This action cannot be undone.`,
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
        this.commentService.deleteComment(comment.id)
          .subscribe({
            next: () => {
              // Remove the comment from the data source
              this.dataSource.data = this.dataSource.data.filter(c => c.id !== comment.id);
              
              this.snackBar.open('Comment deleted successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
              this.loading = false;
            },
            error: (error) => {
              console.error('Error deleting comment', error);
              
              // Provide a more detailed error message based on the response
              let errorMessage = 'Failed to delete comment';
              
              if (error.status === 404) {
                errorMessage = 'Comment not found or already deleted';
              } else if (error.status === 403) {
                errorMessage = 'You do not have permission to delete this comment';
              } else if (error.error && error.error.message) {
                errorMessage = error.error.message;
              }
              
              this.snackBar.open(errorMessage, 'Close', {
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
    this.loadComments();
  }

  reload(): void {
    this.loadComments();
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }
}
