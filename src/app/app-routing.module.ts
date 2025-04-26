import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Importation des composants
import {AllTemplateFrontComponent} from './FrontOffice/all-template-front/all-template-front.component';
import {AllTemplateBackComponent} from './BackOffice/all-template-back/all-template-back.component';
import {HomeFrontComponent} from './FrontOffice/home-front/home-front.component';
import {HomeBackComponent} from './BackOffice/home-back/home-back.component';
import {NotfoundComponent} from "./components/notfound/notfound.component";
import {RealtimeTranscriptionComponent} from "./components/realtime-transcription/realtime-transcription.component";
import {MedecinList} from "./components/medecin-list/medecin-list.component";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: AllTemplateFrontComponent,
    children: [
      {path: '', component: HomeFrontComponent},
      // { path: 'about', component: AboutComponent },
      // { path: 'services', component: ServicesComponent },
      // { path: 'programs', component: ProgramsComponent },
      // { path: 'add-appointment', component: AddAppointmentComponent },
      // { path: 'blog', component: BlogComponent },
      // { path: 'forum', component: ForumComponent },
      // { path: 'complaints', component: ComplaintsComponent },
      // { path: 'contact', component: ContactComponent },
      {path: 'speech-to-text', component: RealtimeTranscriptionComponent}
    ]
  },
  {
    path: 'admin', component: AllTemplateBackComponent,
    children: [
      {path: '', component: HomeBackComponent},
      {path: 'medecins', component: MedecinList}
      //  { path: 'appointments', component: AppointmentListComponent },
      //  { path: 'appointments/edit/:id', component: EditAppointmentComponent },
    ]
  },
  {path: '404', component: NotfoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
