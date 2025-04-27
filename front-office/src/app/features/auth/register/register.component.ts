import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../core/store/app.state';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  hidePassword = true;
  maxDate = new Date(); // Cannot select future dates

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    
    // Set max birth date to 13 years ago (common minimum age for social platforms)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 13);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9_]+$')
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      birthDate: ['', [Validators.required]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8)
      ]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Format date to YYYY-MM-DD as expected by API
      const formValue = { ...this.registerForm.value };
      if (formValue.birthDate instanceof Date) {
        const date = formValue.birthDate;
        formValue.birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      this.store.dispatch(AuthActions.register({
        userData: formValue
      }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get birthDate() {
    return this.registerForm.get('birthDate');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
