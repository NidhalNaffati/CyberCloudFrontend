import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationDashboardComponent } from './reservation-dashboard/reservation-dashboard.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';

const routes: Routes = [
  { path: '', component: ReservationDashboardComponent },
  { path: 'edit/:id', component: ReservationFormComponent },
  { path: 'create', component: ReservationFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }
