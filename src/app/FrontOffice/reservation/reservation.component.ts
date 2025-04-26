import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservationForm: FormGroup;
  activityId: number;
  currentActivity: Activity | null = null;
  submitted = false;
  isSubmitting = false;
  errorMessage: string = '';
  errorDetails: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private activityService: ActivityService,
    private authService: AuthService
  ) {
    this.activityId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.reservationForm = this.fb.group({
      userId: [1, Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      numberOfSeats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadActivity();
    const userId = this.authService.getUserId?.();
  const email = this.authService.getUserEmail?.();

  if (userId) {
    this.reservationForm.patchValue({ userId });
  }

  if (email) {
    this.reservationForm.patchValue({ email });
  }

  }

  loadActivity(): void {
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (activity) => {
        this.currentActivity = activity;
        this.updateSeatsValidator();
      },
      error: (err) => console.error('Error loading activity:', err)
    });
  }

  updateSeatsValidator(): void {
    if (this.currentActivity) {
      const seatsControl = this.reservationForm.get('numberOfSeats');
      seatsControl?.addValidators(Validators.max(this.currentActivity.availableSeats));
      seatsControl?.updateValueAndValidity();
    }
  }

  incrementSeats(): void {
    const seatsControl = this.reservationForm.get('numberOfSeats');
    if (seatsControl && this.canIncrementSeats()) {
      seatsControl.setValue(seatsControl.value + 1);
    }
  }

  decrementSeats(): void {
    const seatsControl = this.reservationForm.get('numberOfSeats');
    if (seatsControl && seatsControl.value > 1) {
      seatsControl.setValue(seatsControl.value - 1);
    }
  }

  canIncrementSeats(): boolean {
    if (!this.currentActivity) return false;
    const seatsControl = this.reservationForm.get('numberOfSeats');
    return seatsControl ? seatsControl.value < this.currentActivity.availableSeats : false;
  }

  goBack(): void {
    this.router.navigate(['']);
  }
 // reservation.component.ts
onSubmit(): void {
  this.submitted = true;
  this.errorMessage = '';
  this.errorDetails = '';

  if (this.reservationForm.invalid || !this.currentActivity) {
    this.errorMessage = 'Please complete all required fields correctly';
    return;
  }

  this.isSubmitting = true;
  const reservationData = this.reservationForm.value;

  this.reservationService.createReservation(this.activityId, reservationData).subscribe({
    next: (reservation) => {
      this.router.navigate(['/confirmation'], {
        state: {
          reservationData: reservation,
          activity: this.currentActivity
        }
      });
    },
    error: (err) => {
      console.error('Reservation error:', err);
      this.isSubmitting = false;
      this.errorMessage = err.message || 'Reservation failed';
      this.errorDetails = err.details || '';

      // Specific handling for common cases
      if (err.status === 500) {
        this.errorDetails = 'Server error. Please contact support if this persists.';
      }
    }
  });
}
private markFormGroupTouched(formGroup: FormGroup) {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}
checkWaitlistStatus(): void {
  const email = this.reservationForm.get('email')?.value;
  if (email) {
    this.activityService.checkWaitlistStatus(this.activityId)
      .subscribe(onWaitlist => {
        if (onWaitlist) {

        }
      });
  }
}
}
