import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/user.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-connections',
  templateUrl: './user-connections.component.html',
  styleUrls: ['./user-connections.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ]
})
export class UserConnectionsComponent implements OnInit {
  type: 'followers' | 'followings' = 'followers';
  username: string = '';
  userId: string = '';
  email: string = '';
  
  connections: UserProfile[] = [];
  loading = false;
  error = false;
  
  displayedColumns: string[] = ['avatarUrl', 'username', 'email', 'fullName', 'followersCount', 'followingsCount', 'isBanned', 'joinedAt', 'actions'];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] || 'followers';
      this.username = params['username'] || '';
      this.userId = params['id'] || '';
      this.email = params['email'] || '';
      
      if (this.username || this.userId || this.email) {
        this.loadConnections();
      } else {
        this.snackBar.open('User information is missing. Please go back and try again.', 'Close', {
          duration: 5000
        });
        this.error = true;
      }
    });
  }

  loadConnections(): void {
    this.loading = true;
    this.error = false;
    
    // Determine which method to call based on available identifiers
    if (this.userId) {
      // If we have a user ID, use that
      if (this.type === 'followers') {
        this.userService.getUserFollowers(this.userId)
          .subscribe(this.handleConnectionsResponse.bind(this));
      } else {
        this.userService.getUserFollowings(this.userId)
          .subscribe(this.handleConnectionsResponse.bind(this));
      }
    } else if (this.username) {
      // If we have a username but no ID
      if (this.type === 'followers') {
        this.userService.getUserFollowersByUsername(this.username)
          .subscribe(this.handleConnectionsResponse.bind(this));
      } else {
        this.userService.getUserFollowingsByUsername(this.username)
          .subscribe(this.handleConnectionsResponse.bind(this));
      }
    } else if (this.email) {
      // If we only have an email
      if (this.type === 'followers') {
        this.userService.getUserFollowersByEmail(this.email)
          .subscribe(this.handleConnectionsResponse.bind(this));
      } else {
        this.userService.getUserFollowingsByEmail(this.email)
          .subscribe(this.handleConnectionsResponse.bind(this));
      }
    } else {
      this.loading = false;
      this.error = true;
    }
  }
  
  handleConnectionsResponse(connections: UserProfile[]): void {
    this.connections = connections;
    this.loading = false;
  }
  
  banUser(user: UserProfile): void {
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
        this.userService.banUserByUsername(user.username)
          .pipe(
            switchMap(() => {
              // Reload connections to reflect the banned status
              return this.type === 'followers' 
                ? this.userId ? this.userService.getUserFollowers(this.userId) : of([])
                : this.userId ? this.userService.getUserFollowings(this.userId) : of([]);
            })
          )
          .subscribe({
            next: (updatedConnections) => {
              if (updatedConnections.length > 0) {
                this.connections = updatedConnections;
              } else {
                // Just update the banned status in the current list
                const index = this.connections.findIndex(c => c.username === user.username);
                if (index !== -1) {
                  this.connections[index].isBanned = true;
                }
              }
              
              this.snackBar.open(`${user.username} has been banned`, 'Close', {
                duration: 3000
              });
              this.loading = false;
            },
            error: (error) => {
              console.error('Error banning user', error);
              this.snackBar.open('Failed to ban user', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
              this.loading = false;
            }
          });
      }
    });
  }

  unbanUser(user: UserProfile): void {
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
          .pipe(
            switchMap(() => {
              // Reload connections to reflect the unbanned status
              return this.type === 'followers' 
                ? this.userId ? this.userService.getUserFollowers(this.userId) : of([])
                : this.userId ? this.userService.getUserFollowings(this.userId) : of([]);
            })
          )
          .subscribe({
            next: (updatedConnections) => {
              if (updatedConnections.length > 0) {
                this.connections = updatedConnections;
              } else {
                // Just update the banned status in the current list
                const index = this.connections.findIndex(c => c.username === user.username);
                if (index !== -1) {
                  this.connections[index].isBanned = false;
                }
              }
              
              this.snackBar.open(`${user.username} has been unbanned`, 'Close', {
                duration: 3000
              });
              this.loading = false;
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

  viewFollowers(user: UserProfile): void {
    this.router.navigate(['/users/connections'], { 
      queryParams: { 
        type: 'followers',
        username: user.username,
        id: user.id
      } 
    });
  }

  viewFollowings(user: UserProfile): void {
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

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  reload(): void {
    this.loadConnections();
  }
}
