import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { LoginComponent } from './BackOffice/login/login.component';
import { RegisterComponent } from './BackOffice/register/register.component';

const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent ,
    children: [
      { path: '', component: HomeFrontComponent },
      { path: 'appointment', component: AppointmentComponent }
      
    ]
  },
  
   { path: 'admin', component:AllTemplateBackComponent ,
    children: [
     { path: 'admin', component: HomeBackComponent },
   ]
   },
 { path: 'admin/login', component: LoginComponent },
 { path: 'admin/register', component: RegisterComponent }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
