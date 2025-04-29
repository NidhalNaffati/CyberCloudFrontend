import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.appointmentService.getAppointmentById(this.id).subscribe((data) => {
      this.appointmentForm = this.fb.group({
        date: [data.date],
        startTime: [data.startTime],
        endTime: [data.endTime],
        userId: [data.userId],
        isAvailable: [data.isAvailable],
      });
    });
  }

  // Mise à jour du rendez-vous et redirection vers la liste
  onSubmit(): void {
    this.appointmentService.updateAppointment(this.id, this.appointmentForm.value).subscribe(() => {
      // Après la mise à jour, on redirige vers la liste des rendez-vous
      this.router.navigate(['/admin/appointments']);
    });
  }
}
