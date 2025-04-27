import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// FrontOffice Components
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { ReservationComponent } from './FrontOffice/reservation/reservation.component';
import { BlogComponent } from './FrontOffice/blog/blog.component';
import { BlogDetailComponent } from './FrontOffice/blog/blog-detail/blog-detail.component';

// BackOffice Components
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { AddActivityComponent } from './BackOffice/add-activity/add-activity.component';
import { EditActivityComponent } from './BackOffice/edit-activity/edit-activity.component';
import { ReservationFormComponent } from './BackOffice/reservations/reservation-form/reservation-form.component';
import { BlogStatisticsComponent } from './BackOffice/statistics/blog-statistics/blog-statistics.component';

// Shared
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: AllTemplateFrontComponent,
    children: [
      { path: '', component: HomeFrontComponent },
      { path: 'home', component: HomeComponent },
      { path: 'home-front', component: HomeFrontComponent },
      { path: 'reservation/:id', component: ReservationComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog/post/:id', component: BlogDetailComponent }
    ]
  },
  {
    path: 'admin',
    component: AllTemplateBackComponent,
    children: [
      { path: '', component: HomeBackComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-activity', component: AddActivityComponent },
      { path: 'edit-activity/:id', component: EditActivityComponent },
      { path: 'reservation-form/:id', component: ReservationFormComponent },
      { path: 'blogs', loadChildren: () => import('./BackOffice/blog-management/blog-management.module').then(m => m.BlogManagementModule) },
      { path: 'comments', loadChildren: () => import('./BackOffice/comment-management/comment-management.module').then(m => m.CommentManagementModule) },
      { path: 'responses', loadChildren: () => import('./BackOffice/response-management/response-management.module').then(m => m.ResponseManagementModule) },
      { path: 'blog-statistics', component: BlogStatisticsComponent },
      { 
        path: 'reservations',
        loadChildren: () => import('./BackOffice/reservations/reservations-routing.module').then(m => m.ReservationsRoutingModule)
      }
    ]
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
