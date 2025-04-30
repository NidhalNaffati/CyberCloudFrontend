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

// Shared Components
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

// Complaints Components
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { AddComplaintsComponent } from './components/add-complaints/add-complaints.component';
import { AddResponsecomplaintComponent } from './components/add-responsecomplaint/add-responsecomplaint.component';

// Appointment and Consultation Components
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { EditAppointmentComponent } from './components/edit-appointment/edit-appointment.component';
import { ConsultationListComponent } from './components/consultations/consultation-list/consultation-list.component';
import { AddConsultationComponent } from './components/consultations/add-consultation/add-consultation.component';
import { EditConsultationComponent } from './components/consultations/edit-consultation/edit-consultation.component';
import { CalendarComponent } from './components/calendar/calendar.component';

// Additional Components
import { RealtimeTranscriptionComponent } from './components/realtime-transcription/realtime-transcription.component';
import { MedecinList } from './components/medecin-list/medecin-list.component';
import { MyFactureComponent } from './FrontOffice/my-facture/my-facture.component';
import { ListFactureComponent } from './BackOffice/factures/list-facture/list-facture.component';
import { AddFactureComponent } from './BackOffice/factures/add-facture/add-facture.component';
import { UpdateFactureComponent } from './BackOffice/factures/update-facture/update-facture.component';
import { RemboursementComponent } from './FrontOffice/remboursement/remboursement.component';
import { ListRemboursementComponent } from './BackOffice/list-remboursement/list-remboursement.component';
import { JitsiComponent } from './jitsi/jitsi.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: AllTemplateFrontComponent,
    children: [
      { path: '', component: HomeFrontComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'home-front', component: HomeFrontComponent },
      { path: 'reservation/:id', component: ReservationComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog/post/:id', component: BlogDetailComponent },
      { path: 'add-complaint', component: AddComplaintsComponent },
      { path: 'edit/:id', component: AddComplaintsComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: 'speech-to-text', component: RealtimeTranscriptionComponent },
      { path: 'myfactures', component: MyFactureComponent },
      { path: 'remboursement/:factureId', component: RemboursementComponent },
      { path: 'add-appointment', component: AddAppointmentComponent }
    ]
  },
  { path: 'calendar', component: CalendarComponent },
  { path: 'video-call', component: JitsiComponent },
  {
    path: 'admin',
    component: AllTemplateBackComponent,
    children: [
      { path: '', component: HomeBackComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeBackComponent },
      { path: 'add-activity', component: AddActivityComponent },
      { path: 'edit-activity/:id', component: EditActivityComponent },
      { path: 'reservation-form/:id', component: ReservationFormComponent },
      { path: 'blogs', loadChildren: () => import('./BackOffice/blog-management/blog-management.module').then(m => m.BlogManagementModule) },
      { path: 'comments', loadChildren: () => import('./BackOffice/comment-management/comment-management.module').then(m => m.CommentManagementModule) },
      { path: 'responses', loadChildren: () => import('./BackOffice/response-management/response-management.module').then(m => m.ResponseManagementModule) },
      { path: 'blog-statistics', component: BlogStatisticsComponent },
      {
        path: 'factures',
        children: [
          { path: '', component: ListFactureComponent },
          { path: 'add-facture', component: AddFactureComponent },
          { path: 'update/:id', component: UpdateFactureComponent },
        ],
      },
      {
        path: 'remboursement',
        children: [{ path: '', component: ListRemboursementComponent }],
      },


      {
        path: 'reservations',
        loadChildren: () =>
          import('./BackOffice/reservations/reservations-routing.module').then(
            (m) => m.ReservationsRoutingModule
          )
      },
      { path: 'complaints', component: ListComplaintsComponent },
      { path: 'responsecomplaint/:id', component: AddResponsecomplaintComponent },
      { path: 'medecins', component: MedecinList },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'appointments/edit/:id', component: EditAppointmentComponent },
      { path: 'consultations', component: ConsultationListComponent },
      { path: 'consultations/add', component: AddConsultationComponent },
      { path: 'consultations/edit/:id', component: EditConsultationComponent }
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
