import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { environment } from './environment/environment';
import { reducers } from './app/core/store/app.state';
import { AuthEffects } from './app/core/store/auth/auth.effects';
import { BuzzEffects } from './app/core/store/buzz/buzz.effects';
import { UserEffects } from './app/core/store/user/user.effects';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';



import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app/app-routing.module';
import { HeaderComponent } from './app/shared/components/header/header.component';
import { FooterComponent } from './app/shared/components/footer/footer.component';
import { BuzzCardComponent } from './app/shared/components/buzz-card/buzz-card.component';
import { CommentCardComponent } from './app/shared/components/comment-card/comment-card.component';
import { AsyncPipe } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MatSnackBarModule,
      MatButtonModule,
      MatCardModule,
      MatToolbarModule,
      MatIconModule,
      MatInputModule,
      MatFormFieldModule,
      MatProgressSpinnerModule,
      MatTabsModule,
      MatMenuModule,
      MatBadgeModule,
      MatChipsModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatDividerModule,
      MatListModule,
      MatSidenavModule
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(reducers),
    provideEffects([AuthEffects, BuzzEffects, UserEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
}).catch(err => console.error(err));