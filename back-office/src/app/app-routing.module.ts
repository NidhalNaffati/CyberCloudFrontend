import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(c => c.UsersComponent)
      },
      {
        path: 'users/banned',
        loadComponent: () => import('./pages/users/banned-users/banned-users.component').then(c => c.BannedUsersComponent)
      },
      {
        path: 'users/connections',
        loadComponent: () => import('./pages/users/user-connections/user-connections.component').then(c => c.UserConnectionsComponent)
      },
      {
        path: 'comments',
        loadComponent: () => import('./pages/comments/comments.component').then(c => c.CommentsComponent)
      },
      {
        path: 'buzzs',
        loadComponent: () => import('./pages/buzzs/buzzs.component').then(c => c.BuzzsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
