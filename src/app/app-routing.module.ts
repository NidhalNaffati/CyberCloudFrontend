import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateFrontComponent } from './layouts/FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './layouts/BackOffice/all-template-back/all-template-back.component';
import { HomeComponent } from './front-office/home/home.component';
import { ReservationComponent } from './front-office/reservation/reservation.component';
import { DashboardComponent } from './back-office/dashboard/dashboard.component';
import { AddActivityComponent } from './back-office/add-activity/add-activity.component';
import { EditActivityComponent } from './back-office/edit-activity/edit-activity.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ReservationFormComponent } from './back-office/reservations/reservation-form/reservation-form.component';

const routes: Routes = [
  {
    path: '',
    component: AllTemplateFrontComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'reservation/:id', component: ReservationComponent },
      { path: 'confirmation', component: ConfirmationComponent }
    ]
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-activity', component: AddActivityComponent },
  { path: 'edit-activity/:id', component: EditActivityComponent },
  { path: 'reservations', loadChildren: () => import('./back-office/reservations/reservations.module').then(m => m.ReservationsModule) },
  { path: 'reservation-form/:id', component: ReservationFormComponent },
  {
    path: 'admin',
    component: AllTemplateBackComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-activity', component: AddActivityComponent },
      { path: 'edit-activity/:id', component: EditActivityComponent },
      { path: 'reservations', loadChildren: () => import('./back-office/reservations/reservations.module').then(m => m.ReservationsModule) },
      { path: 'reservation-form/:id', component: ReservationFormComponent }
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
