import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importation des composants
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { ListComplaintsComponent } from './Components/list-complaints/list-complaints.component'; 
import { AddComplaintsComponent } from './Components/add-complaints/add-complaints.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { AddResponsecomplaintComponent } from './Components/add-responsecomplaint/add-responsecomplaint.component';
const routes: Routes = [
  { path: '', component: AllTemplateFrontComponent ,
    children: [
      { path: '', component: HomeFrontComponent , pathMatch: 'full'},
       { path: 'add-complaint', component: AddComplaintsComponent },
       { path: 'edit/:id', component: AddComplaintsComponent },

    ]
  },
  { path: 'admin', component: AllTemplateBackComponent,
    children: [
      { path: '', component: HomeBackComponent }, 
      { path: 'complaints', component: ListComplaintsComponent },
      { path: 'responsecomplaint/:id', component: AddResponsecomplaintComponent }
    ]
  
   },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
