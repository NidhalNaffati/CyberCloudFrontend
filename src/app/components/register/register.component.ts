import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../../auth/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  showFileUpload = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Monitor role changes to show/hide file upload based on role
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.showFileUpload = role === 'ROLE_MEDECIN';
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return {'passwordMismatch': true};
    }

    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    const role = this.registerForm.value.role;

    // Check if document is required but not provided
    if (role === 'ROLE_MEDECIN' && !this.selectedFile) {
      this.errorMessage = 'Please upload your medical document or certification';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const registerData = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        role: role
      };

      const response = await this.authService.register(registerData, this.selectedFile || undefined);

      this.successMessage = response || 'Registration successful. Check your email for verification code.';

      // For medical professionals, inform about document verification
      if (role === 'ROLE_MEDECIN') {
        this.successMessage = 'Registration successful. Your documents will be verified by an administrator.';
      }

      // Redirect to verification page after a short delay
      setTimeout(() => {
        this.router.navigate(['auth/verify-account'], {
          queryParams: {email: registerData.email}
        });
      }, 2000);

    } catch (error: any) {
      // Now we can directly use the error message from our service
      this.errorMessage = error.message || 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
