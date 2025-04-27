import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/auth/auth.service';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class SidebarComponent implements OnInit {
  @Output() linkClicked = new EventEmitter<void>();
  
  menuItems: MenuItem[] = [
    { title: 'Dashboard', icon: 'dashboard', route: '/', active: true },
    { title: 'Users', icon: 'people', route: '/users', active: false },
    { title: 'Comments', icon: 'comment', route: '/comments', active: false },
    { title: 'Buzz Posts', icon: 'dynamic_feed', route: '/buzzs', active: false }
  ];
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Set the active menu item based on current route
    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      if (currentUrl === item.route || (item.route !== '/' && currentUrl.startsWith(item.route))) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  navigateTo(item: MenuItem): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    this.router.navigate([item.route]);
    this.linkClicked.emit();
  }

  logout(): void {
    this.authService.logout();
    this.linkClicked.emit();
  }
}
