import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AppState } from './core/store/app.state';
import * as AuthActions from './core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Speekly Connect';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Check if there's a token in localStorage and try to authenticate the user
    const token = localStorage.getItem('access_token');
    if (token) {
      this.store.dispatch(AuthActions.checkAuthStatus());
    }
  }
}
