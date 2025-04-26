import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderFrontComponent} from './FrontOffice/header-front/header-front.component';
import {FooterFrontComponent} from './FrontOffice/footer-front/footer-front.component';
import {AllTemplateFrontComponent} from './FrontOffice/all-template-front/all-template-front.component';
import {NavbarBackComponent} from './BackOffice/navbar-back/navbar-back.component';
import {SidebarBackComponent} from './BackOffice/sidebar-back/sidebar-back.component';
import {FooterBackComponent} from './BackOffice/footer-back/footer-back.component';
import {AllTemplateBackComponent} from './BackOffice/all-template-back/all-template-back.component';
import {HomeFrontComponent} from './FrontOffice/home-front/home-front.component';
import {HomeBackComponent} from './BackOffice/home-back/home-back.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FullCalendarModule} from '@fullcalendar/angular';
import {AuthInterceptor} from "./auth/auth.interceptor";
import { AddComplaintsComponent } from './components/add-complaints/add-complaints.component';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { AddResponsecomplaintComponent } from './components/add-responsecomplaint/add-responsecomplaint.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes'; // Importer NgPipesModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEditorModule } from 'ngx-editor';
import { NgChartsModule } from 'ng2-charts';
import { StatisticsComponent } from './components/statistics/statistics.component';
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
    HomeBackComponent,
    AddComplaintsComponent,
    ListComplaintsComponent,
    AddResponsecomplaintComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    NgxPaginationModule,
    NgPipesModule,
    BrowserAnimationsModule ,
    NgxEditorModule  ,
    NgChartsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
