import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { AppState } from '../../../core/store/app.state';
import * as UserActions from '../../../core/store/user/user.actions';
import { selectCurrentUser } from '../../../core/store/auth/auth.selectors';
import { selectUserLoading, selectUserError } from '../../../core/store/user/user.selectors';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  maxDate = new Date(); // Cannot select future dates

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);
    
    // Set max birth date to 13 years ago (common minimum age for social platforms)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 13);
  }

  ngOnInit(): void {
    this.initForm();
    
    this.currentUser$.subscribe(user => {
      if (user) {
        this.updateFormWithUserData(user);
      }
    });
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      bio: ['', [Validators.maxLength(160)]],
      birthDate: ['', [Validators.required]],
      avatarUrl: [''],
      bannerUrl: [''],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      twitter: ['', [Validators.maxLength(100)]],
      instagram: ['', [Validators.maxLength(100)]],
      facebook: ['', [Validators.maxLength(100)]],
      linkedin: ['', [Validators.maxLength(100)]]
    });
  }

  updateFormWithUserData(user: User): void {
    // Convert ISO date string to Date object for the date picker
    let birthDate: any = user.birthDate;
    if (typeof birthDate === 'string') {
      birthDate = new Date(birthDate);
    }
    
    this.profileForm.patchValue({
      fullName: user.fullName,
      bio: user.bio,
      birthDate: birthDate,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      website: user.website,
      twitter: user.twitter,
      instagram: user.instagram,
      facebook: user.facebook,
      linkedin: user.linkedin
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Format date to YYYY-MM-DD as expected by API
      const formValue = { ...this.profileForm.value };
      if (formValue.birthDate instanceof Date) {
        const date = formValue.birthDate;
        formValue.birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      this.store.dispatch(UserActions.updateUserProfile({
        userData: formValue
      }));
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  get fullName() {
    return this.profileForm.get('fullName');
  }

  get bio() {
    return this.profileForm.get('bio');
  }

  get birthDate() {
    return this.profileForm.get('birthDate');
  }

  get website() {
    return this.profileForm.get('website');
  }

  get twitter() {
    return this.profileForm.get('twitter');
  }

  get instagram() {
    return this.profileForm.get('instagram');
  }

  get facebook() {
    return this.profileForm.get('facebook');
  }

  get linkedin() {
    return this.profileForm.get('linkedin');
  }
}
