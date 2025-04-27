import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../core/store/app.state';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login({
        credentials: this.loginForm.value
      }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get usernameOrEmail() {
    return this.loginForm.get('usernameOrEmail');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
