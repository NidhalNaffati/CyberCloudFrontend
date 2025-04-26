import {Component, OnInit} from '@angular/core';
import {AuthService, EditProfileRequest} from "../../auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

declare var bootstrap: any; // For Bootstrap modal

@Component({
  selector: 'app-navbar-back',
  templateUrl: './navbar-back.component.html',
  styleUrls: ['./navbar-back.component.css']
})
export class NavbarBackComponent implements OnInit {
  adminFullName: string = 'Admin User';
  apiUrl = environment.apiUrl;
  editProfileForm: FormGroup;
  isSubmitting = false;
  profileModal: any;
  userProfile: any = {};

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, {validators: this.passwordMatchValidator});
  }

  ngOnInit(): void {
    this.loadAdminFullName();
    this.loadUserProfile();
  }

  loadAdminFullName(): void {
    const userId = this.authService.getUserId() || 1;

    const params = new HttpParams().set('id', userId.toString());

    this.http.get(`${this.apiUrl}/api/v1/admin/fullname`, {
      params,
      responseType: 'text'
    })
      .subscribe({
        next: (response: string) => {
          this.adminFullName = response;
        },
        error: (error) => {
          console.error('Error fetching admin name:', error);
        }
      });
  }

  loadUserProfile(): void {
    this.authService.getUserProfile().then(profile => {
      this.userProfile = profile;

      // Update form with current profile data
      this.editProfileForm.patchValue({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        password: '',
        confirmPassword: ''
      });
    }).catch(error => {
      console.error('Error loading profile:', error);
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    }

    // If password field is empty (indicating user doesn't want to change password),
    // clear any password mismatch errors
    if (!password && !confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  logout(): void {
    this.authService.logout();
    // No need to navigate as the logout method in AuthService already handles navigation
  }

  openEditProfileModal(): void {
    // Load profile data before opening the modal
    this.loadUserProfile();

    // Initialize and show the Bootstrap modal
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      this.profileModal = new bootstrap.Modal(modalElement, {
        keyboard: false,
        backdrop: 'static'
      });
      this.profileModal.show();
    }
  }

  updateProfile(): void {
    if (this.editProfileForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.editProfileForm.controls).forEach(key => {
        this.editProfileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.editProfileForm.value;

    // Only include password fields if user entered a new password
    const profileRequest: EditProfileRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password || '',
      confirmPassword: formValue.confirmPassword || ''
    };

    this.authService.updateProfile(profileRequest)
      .then(response => {
        console.log('Profile updated successfully', response);
        // Close the modal
        if (this.profileModal) {
          this.profileModal.hide();
        }
        // Reload the user's name
        this.loadAdminFullName();

        // Show success message (you might want to use a toast notification library)
        alert('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert(`Error updating profile: ${error.message}`);
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
