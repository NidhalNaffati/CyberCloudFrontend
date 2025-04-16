import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { FooterFrontComponent } from './FrontOffice/footer-front/footer-front.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { HeaderBackComponent } from './BackOffice/header-back/header-back.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { AddComplaintsComponent } from './Components/add-complaints/add-complaints.component';
import { ListComplaintsComponent } from './Components/list-complaints/list-complaints.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddResponsecomplaintComponent } from './Components/add-responsecomplaint/add-responsecomplaint.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms'; 
import { NgPipesModule } from 'ngx-pipes'; // Importer NgPipesModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderFrontComponent,
    FooterFrontComponent,
    AllTemplateFrontComponent,
    NavbarBackComponent,
    SidebarBackComponent,
    FooterBackComponent,
    AllTemplateBackComponent,
    HomeFrontComponent,
    HeaderBackComponent,
    HomeBackComponent,
    AddComplaintsComponent,
    ListComplaintsComponent,
    AddResponsecomplaintComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    NgPipesModule,
    BrowserAnimationsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
