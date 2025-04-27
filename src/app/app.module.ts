
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgPipesModule } from 'ngx-pipes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxEditorModule } from 'ngx-editor';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// FrontOffice Components
import { HeaderFrontComponent } from './FrontOffice/header-front/header-front.component';
import { FooterFrontComponent } from './FrontOffice/footer-front/footer-front.component';
import { AllTemplateFrontComponent } from './FrontOffice/all-template-front/all-template-front.component';
import { HomeFrontComponent } from './FrontOffice/home-front/home-front.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { ReservationComponent } from './FrontOffice/reservation/reservation.component';
import { BlogModule } from './FrontOffice/blog/blog.module';

// BackOffice Components
import { NavbarBackComponent } from './BackOffice/navbar-back/navbar-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { AllTemplateBackComponent } from './BackOffice/all-template-back/all-template-back.component';
import { HeaderBackComponent } from './BackOffice/header-back/header-back.component';
import { HomeBackComponent } from './BackOffice/home-back/home-back.component';
import { AddActivityComponent } from './BackOffice/add-activity/add-activity.component';
import { EditActivityComponent } from './BackOffice/edit-activity/edit-activity.component';
import { DashboardComponent } from './BackOffice/dashboard/dashboard.component';
import { ReservationFormComponent } from './BackOffice/reservations/reservation-form/reservation-form.component';
import { ReservationDashboardComponent } from './BackOffice/reservations/reservation-dashboard/reservation-dashboard.component';

// Complaints Components
import { AddComplaintsComponent } from './components/add-complaints/add-complaints.component';
import { ListComplaintsComponent } from './components/list-complaints/list-complaints.component';
import { AddResponsecomplaintComponent } from './components/add-responsecomplaint/add-responsecomplaint.component';

// Shared
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RangePipe } from './shared/pipes/range.pipe';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

// Statistics
import { StatisticsComponent } from './components/statistics/statistics.component';

import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    // FrontOffice
    HeaderFrontComponent,
    FooterFrontComponent,
    AllTemplateFrontComponent,
    HomeFrontComponent,
    HomeComponent,
    ReservationComponent,
    // BackOffice
    NavbarBackComponent,
    SidebarBackComponent,
    FooterBackComponent,
    AllTemplateBackComponent,
    HeaderBackComponent,
    HomeBackComponent,
    AddActivityComponent,
    EditActivityComponent,
    DashboardComponent,
    ReservationFormComponent,
    ReservationDashboardComponent,
    // Complaints
    AddComplaintsComponent,
    ListComplaintsComponent,
    AddResponsecomplaintComponent,
    // Shared
    NavbarComponent,
    FooterComponent,
    RangePipe,
    ConfirmationComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotfoundComponent,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule,
    CommonModule,
    NgChartsModule,
    NgxChartsModule,

    NgxPaginationModule,
    NgPipesModule,
    NotfoundComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    BlogModule,
    EditorModule,
    FullCalendarModule,
    NgxEditorModule
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
