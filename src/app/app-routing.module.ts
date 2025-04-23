import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { EditAppointmentComponent } from './components/edit-appointment/edit-appointment.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { ConsultationListComponent } from './components/consultations/consultation-list/consultation-list.component';
import { AddConsultationComponent } from './components/consultations/add-consultation/add-consultation.component';
import { EditConsultationComponent } from './components/consultations/edit-consultation/edit-consultation.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { JitsiComponent } from './jitsi/jitsi.component';

const routes: Routes = [
  {
    path: '', component: AllTemplateFrontComponent,
    children: [
      { path: '', component: HomeFrontComponent },
      { path: 'add-appointment', component: AddAppointmentComponent },
    ]
  },

  { path: 'calendar', component: CalendarComponent },
  {path: 'video-call', component: JitsiComponent},

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: AllTemplateFrontComponent,
    children: [
      { path: '', component: HomeFrontComponent },
      // {path:'add-appointment', component: AddAppointmentComponent},
    ]
  },
  {
    path: 'admin', component: AllTemplateBackComponent,
    children: [
      { path: '', component: HomeBackComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'consultations', component: ConsultationListComponent },
      { path: 'consultations/add', component: AddConsultationComponent },
      { path: 'consultations/edit/:id', component: EditConsultationComponent },
      { path: 'appointments/edit/:id', component: EditAppointmentComponent },
    ]
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
