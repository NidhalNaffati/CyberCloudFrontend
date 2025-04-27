import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { switchMap } from 'rxjs/operators';
import { ActivityService } from 'src/app/services/activity.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  isEditMode = false;
  reservationId: number | null = null;
  activities: any[] = [];
  currentActivity: any;
  showDebug = false; // Propriété pour contrôler l'affichage du debug

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private reservationService: ReservationService,
    private activityService: ActivityService
  ) {
    this.reservationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      numberOfSeats: ['', [Validators.required, Validators.min(1)]],
      activityId: [{value: null, disabled: false}]
    });
  }

  ngOnInit(): void {
    // Chargez d'abord les activités
    this.activityService.getActivities().subscribe(activities => {
      this.activities = activities;

      // Ensuite chargez les données de réservation si en mode édition
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.reservationId = +id;
            return this.reservationService.getReservationById(this.reservationId);
          }
          return of(null);
        })
      ).subscribe(reservation => {
        if (reservation) {
          this.currentActivity = reservation.activity;
          this.reservationForm.patchValue({
            fullName: reservation.fullName,
            email: reservation.email,
            phoneNumber: reservation.phoneNumber,
            numberOfSeats: reservation.numberOfSeats,
            activityId: reservation.activity?.activityId
          });

          // Désactive le champ activité en mode édition
          this.reservationForm.get('activityId')?.disable();
        } else {
          // Mode création - sélectionne la première activité par défaut
          if (this.activities.length > 0) {
            this.reservationForm.patchValue({
              activityId: this.activities[0].activityId
            });
          }
        }
      });
    });
  }

  toggleDebug(): void {
    this.showDebug = !this.showDebug;
  }

  onCancel(): void {
    this.router.navigate(['/admin/reservations']);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formData = this.reservationForm.getRawValue();

      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        numberOfSeats: formData.numberOfSeats,
        // Include activityId only in create mode
        ...(!this.isEditMode && { activityId: formData.activityId })
      };

      const operation = this.isEditMode && this.reservationId
        ? this.reservationService.updateReservation(this.reservationId, reservationData)
        : this.reservationService.createReservation(this.reservationForm.value.activityId, reservationData);

      operation.subscribe({
        next: () => this.router.navigate(['/admin/reservations']),
        error: (err) => {
          console.error('Detailed error:', err);
          if (err.status === 0) {
            alert('Connection error - please check if backend is running');
          } else {
            alert('Error saving reservation: ' + err.message);
          }
        }
      });
    }
  }
  
}
