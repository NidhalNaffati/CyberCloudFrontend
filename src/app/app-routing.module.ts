import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Importation des composants
import {AllTemplateFrontComponent} from './FrontOffice/all-template-front/all-template-front.component';
import {AllTemplateBackComponent} from './BackOffice/all-template-back/all-template-back.component';
import {HomeFrontComponent} from './FrontOffice/home-front/home-front.component';
import {HomeBackComponent} from './BackOffice/home-back/home-back.component';
import {NotfoundComponent} from "./components/notfound/notfound.component";

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '', component: AllTemplateFrontComponent,
    children: [
      {path: '', component: HomeFrontComponent},
      // {path:'add-appointment', component: AddAppointmentComponent},
    ]
  },
  {
    path: 'admin', component: AllTemplateBackComponent,
    children: [
      {path: '', component: HomeBackComponent},
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
