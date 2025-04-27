import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-banned-users',
  templateUrl: './banned-users.component.html',
  styleUrls: ['./banned-users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCardModule,
    LoadingSpinnerComponent
  ]
})
export class BannedUsersComponent implements OnInit {
  bannedUsers: User[] = [];
  loading = false;
  error = false;
  searchTerm = '';

  displayedColumns: string[] = ['avatarUrl', 'username', 'email', 'fullName', 'followersCount', 'followingsCount', 'createdAt', 'actions'];
  
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBannedUsers();
  }

  loadBannedUsers(): void {
    this.loading = true;
    this.error = false;
    
    this.userService.getBannedUsers()
      .subscribe({
        next: (users) => {
          this.bannedUsers = users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading banned users', error);
          this.snackBar.open('Failed to load banned users', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
          this.error = true;
        }
      });
  }

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
        this.userService.unbanUserByUsername(user.username)
          .subscribe({
            next: () => {
              this.snackBar.open(`${user.username} has been unbanned`, 'Close', {
                duration: 3000
              });
              // Reload banned users list
              this.loadBannedUsers();
            },
            error: (error) => {
              console.error('Error unbanning user', error);
              this.snackBar.open('Failed to unban user', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              this.loading = false;
            }
          });
      }
    });
  }

  viewFollowers(user: User): void {
    this.router.navigate(['/users/connections'], { 
      queryParams: { 
        type: 'followers',
        username: user.username,
        id: user.id
      } 
    });
  }

  viewFollowings(user: User): void {
    this.router.navigate(['/users/connections'], { 
      queryParams: { 
        type: 'followings',
        username: user.username,
        id: user.id
      } 
    });
  }

  backToUsers(): void {
    this.router.navigate(['/users']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  applyFilter(): void {
    if (!this.searchTerm) return;
    
    const lowerCaseSearch = this.searchTerm.toLowerCase();
    this.bannedUsers = this.bannedUsers.filter(user => 
      user.username.toLowerCase().includes(lowerCaseSearch) || 
      user.email.toLowerCase().includes(lowerCaseSearch) || 
      (user.fullName && user.fullName.toLowerCase().includes(lowerCaseSearch))
    );
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.loadBannedUsers();
  }

  reload(): void {
    this.loadBannedUsers();
  }
}
