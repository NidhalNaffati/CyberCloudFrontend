// Merged app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// FrontOffice Components
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { ReservationComponent } from './FrontOffice/reservation/reservation.component';

// BackOffice Components
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { AddActivityComponent } from './BackOffice/add-activity/add-activity.component';
import { EditActivityComponent } from './BackOffice/edit-activity/edit-activity.component';
import { ReservationFormComponent } from './BackOffice/reservations/reservation-form/reservation-form.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';

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
      { path: 'confirmation', component: ConfirmationComponent }
    ]
  },
  {
    path: 'admin',
    component: AllTemplateBackComponent,
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeBackComponent },
      { path: 'add-activity', component: AddActivityComponent },
      { path: 'edit-activity/:id', component: EditActivityComponent },
      {
        path: 'reservations',
        loadChildren: () =>
          import('./BackOffice/reservations/reservations-routing.module').then(
            (m) => m.ReservationsRoutingModule
          )
      },
      { path: 'reservation-form/:id', component: ReservationFormComponent }
    ]
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
