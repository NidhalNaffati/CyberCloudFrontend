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
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FullCalendarModule} from '@fullcalendar/angular';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
