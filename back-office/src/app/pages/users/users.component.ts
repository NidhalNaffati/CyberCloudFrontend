import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ]
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['avatarUrl', 'username', 'email', 'fullName', 'followersCount', 'followingsCount', 'buzzCount', 'isBanned', 'createdAt', 'actions'];
  
  loading = false;
  totalUsers = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  
  searchControl = new FormControl('');
  selectedUsername = '';
  selectedEmail = '';
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.searchUsers(value);
        } else if (!value) {
          this.loadUsers();
        }
      });
  }

  loadUsers(page: number = 0, size: number = this.pageSize): void {
    this.loading = true;
    
    this.userService.getUsers(page, size)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.content;
          this.totalUsers = data.totalElements;
          this.loading = false;
          
          // Set up sorting and pagination after data is loaded
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        },
        error: (error) => {
          console.error('Error loading users', error);
          this.snackBar.open('Failed to load users', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  searchUsers(query: string): void {
    this.loading = true;
    
    this.userService.searchUsers(query)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching users', error);
          this.snackBar.open('Failed to search users', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }

  onPageChange(event: any): void {
    this.loadUsers(event.pageIndex, event.pageSize);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.loadUsers();
  }

  viewFollowers(user: User): void {
    this.selectedUsername = user.username;
    this.selectedEmail = user.email;
    this.router.navigate(['/users/connections'], { 
      queryParams: { 
        type: 'followers',
        username: user.username,
        id: user.id
      } 
    });
  }

  viewFollowings(user: User): void {
    this.selectedUsername = user.username;
    this.selectedEmail = user.email;
    this.router.navigate(['/users/connections'], { 
      queryParams: { 
        type: 'followings',
        username: user.username,
        id: user.id
      } 
    });
  }

  /**
   * Bans a user by username
   * Uses the API endpoint: POST /api/admin/dashboard/ban/user/by-username/{username}
   * @param user The user to ban
   */
  banUser(user: User): void {
    const dialogData: ConfirmDialogData = {
      title: 'Ban User',
      message: `Are you sure you want to ban ${user.username}? This will prevent them from accessing the platform.`,
      confirmButtonText: 'Ban User',
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
        this.userService.banUserByUsername(user.username)
          .subscribe({
            next: () => {
              this.snackBar.open(`${user.username} has been banned`, 'Close', {
                duration: 3000
              });
              // Update user data in the table
              user.isBanned = true;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error banning user', error);
              this.snackBar.open(error?.message || 'Failed to ban user', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              this.loading = false;
            }
          });
      }
    });
  }

  /**
   * Unbans a user by username
   * Uses the API endpoint: POST /api/admin/dashboard/unban/user/by-username/{username}
   * @param user The user to unban
   */
  unbanUser(user: User): void {
    const dialogData: ConfirmDialogData = {
      title: 'Unban User',
      message: `Are you sure you want to unban ${user.username}? This will restore their access to the platform.`,
      confirmButtonText: 'Unban User',
      cancelButtonText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // Call API endpoint according to documentation
        this.userService.unbanUserByUsername(user.username)
          .subscribe({
            next: () => {
              this.snackBar.open(`${user.username} has been unbanned`, 'Close', {
                duration: 3000
              });
              // Update user data in the table
              user.isBanned = false;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error unbanning user', error);
              this.snackBar.open(error?.message || 'Failed to unban user', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              this.loading = false;
            }
          });
      }
    });
  }

  viewBannedUsers(): void {
    this.router.navigate(['/users/banned']);
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
