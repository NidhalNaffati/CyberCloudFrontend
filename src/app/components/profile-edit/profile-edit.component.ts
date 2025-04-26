import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, EditProfileRequest } from '../../auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().then(
      (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load profile data. Please try again.';
        console.error('Error fetching profile:', error);
      }
    );
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && (!confirmPassword || password !== confirmPassword)) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formData: EditProfileRequest = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,
        password: this.profileForm.value.password || '',
        confirmPassword: this.profileForm.value.confirmPassword || ''
      };

      const response = await this.authService.updateProfile(formData);

      this.successMessage = response || 'Profile updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to update profile. Please try again.';
      console.error('Update profile error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
