import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintService } from 'src/app/services/complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { ResponseComplaint } from 'src/app/models/response-complaint';
import { AuthService, EditProfileRequest } from "../../auth/auth.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any; // For Bootstrap modal

@Component({
  selector: 'app-navbar-back',
  templateUrl: './navbar-back.component.html',
  styleUrls: ['./navbar-back.component.css']
})
export class NavbarBackComponent implements OnInit {
  // Complaint and Response properties
  unreadComplaints: Complaint[] = [];
  unreadResponses: ResponseComplaint[] = [];
  selectComplaintId: number | null = null;
  selectResponseId: number | null = null;

  // Admin Profile properties
  adminFullName: string = 'Admin User';
  apiUrl = environment.apiUrl;
  editProfileForm: FormGroup;
  isSubmitting = false;
  profileModal: any;
  userProfile: any = {};

  constructor(
    private complaintService: ComplaintService,
    private responseComplaintService: ResponseComplaintService,
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
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Initialize complaint/response functionality
    this.loadUnreadComplaints();
    this.loadUnreadResponses();
    setInterval(() => {
      this.loadUnreadComplaints();
      this.loadUnreadResponses();
    }, 10000);

    // Initialize profile functionality
    this.loadAdminFullName();
    this.loadUserProfile();
  }

  // Complaint and Response methods
  loadUnreadComplaints(): void {
    this.complaintService.getUnreadComplaints().subscribe((data) => {
      this.unreadComplaints = data;
    });
  }

  loadUnreadResponses(): void {
    this.responseComplaintService.getUnreadResponses().subscribe((data) => {
      // Filtrer uniquement les réponses des utilisateurs avec le rôle ROLE_USER
      this.unreadResponses = data.filter(response => {
        return response.user && response.user.role === 'ROLE_USER';
      });
      console.log('Filtered user responses:', this.unreadResponses);
    });
  }

  openModal(complaintId: number): void {
    this.selectComplaintId = complaintId;
    this.complaintService.markComplaintAsRead(complaintId).subscribe({
      next: () => {
        const modalElement = document.getElementById('responseModal2');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      }
    });
  }

  openResponseModal(responseId: number, complaintId: number): void {
    this.selectComplaintId = complaintId;
    this.selectResponseId = responseId;

    this.responseComplaintService.markResponseAsRead(responseId).subscribe({
      next: () => {
        const modalElement = document.getElementById('responseModal3');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la réponse:", err);
      }
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('responseModal2');
    if (modalElement && (window as any).bootstrap?.Modal) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      this.selectComplaintId = null;
    }
  }

  // Admin Profile methods
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
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (!password && !confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  logout(): void {
    this.authService.logout();
  }

  openEditProfileModal(): void {
    this.loadUserProfile();
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
      Object.keys(this.editProfileForm.controls).forEach(key => {
        this.editProfileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.editProfileForm.value;

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
        if (this.profileModal) {
          this.profileModal.hide();
        }
        this.loadAdminFullName();
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
