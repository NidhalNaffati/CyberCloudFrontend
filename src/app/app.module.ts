import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FrontOfficeModule } from './front-office/front-office.module';
import { BackOfficeModule } from './back-office/back-office.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
AppComponent,
ConfirmationComponent
  ],
  imports: [
    BrowserModule, // Ensure this is only imported in the root module
    HttpClientModule,
    AppRoutingModule,
    FrontOfficeModule,
    BackOfficeModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
