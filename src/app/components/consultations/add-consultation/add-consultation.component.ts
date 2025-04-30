import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { GroqService } from 'src/app/services/groq.service';
import { Consultation } from 'src/app/models/consultation.model';
import { Appointment } from 'src/app/models/appointment';
import * as bootstrap from 'bootstrap'; // Import Bootstrap for modal control

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.css']
})
export class AddConsultationComponent implements OnInit {
  consultationForm!: FormGroup;
  appointments: Appointment[] = [];
  isLoading: boolean = false;
  enhanceError: boolean = false;
  enhancedDescription: string = ''; // Store the enhanced description for modal
  private modal: bootstrap.Modal | null = null; // Reference to Bootstrap modal

  constructor(
    private fb: FormBuilder,
    private consultationService: ConsultationService,
    private appointmentService: AppointmentService,
    private groqService: GroqService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAppointments();
  }

  ngAfterViewInit(): void {
    // Initialize the modal after the view is rendered
    const modalElement = document.getElementById('descriptionModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement, {});
    }
  }

  initForm() {
    this.consultationForm = this.fb.group({
      details: ['', Validators.required],
      description: ['', Validators.required],
      actualDuration: ['', [Validators.required, this.timeFormatValidator]],
      appointment: [null, Validators.required]
    });
  }

  loadAppointments() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        if (error.status === 401) {
          this.handleAuthError();
        }
      }
    });
  }

  addConsultation() {
    if (this.consultationForm.invalid) {
      return;
    }

    const consultation = new Consultation();
    consultation.details = this.consultationForm.value.details;
    consultation.description = this.consultationForm.value.description;
    consultation.actualDuration = this.consultationForm.value.actualDuration;
    consultation.appointment = this.consultationForm.value.appointment;

    this.consultationService.createConsultation(consultation).subscribe({
      next: () => {
        alert('Consultation added successfully ✅');
        this.consultationForm.reset();
      },
      error: (error) => {
        console.error('Error adding consultation', error);
        if (error.status === 401) {
          this.handleAuthError();
        } else {
          alert('Error adding consultation ❌');
        }
      }
    });
  }

  enhanceDescription() {
    if (this.consultationForm.get('description')?.invalid) {
      return;
    }

    this.isLoading = true;
    this.enhanceError = false;
    const description = this.consultationForm.get('description')?.value;

    this.groqService.complete(description).subscribe({
      next: (completion: string) => {
        this.isLoading = false;
        this.enhancedDescription = completion;
        this.showModal(); // Show the modal with the corrected description
      },
      error: (error) => {
        console.error('Error during Groq generation', error);
        this.isLoading = false;
        this.enhanceError = true;
        alert('Error correcting description ❌');
      }
    });
  }

  retryEnhance() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const description = this.consultationForm.get('description')?.value;

    this.groqService.complete(description).subscribe({
      next: (completion: string) => {
        this.isLoading = false;
        this.enhancedDescription = completion; // Update the modal content
      },
      error: (error) => {
        console.error('Error during Groq retry', error);
        this.isLoading = false;
        alert('Error retrying correction ❌');
      }
    });
  }

  acceptEnhancedDescription() {
    this.consultationForm.get('description')?.setValue(this.enhancedDescription);
    this.hideModal();
    alert('Description corrected successfully ✅');
  }

  showModal() {
    if (this.modal) {
      this.modal.show();
    }
  }

  hideModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  timeFormatValidator(control: AbstractControl) {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    if (control.value && !timePattern.test(control.value)) {
      return { invalidTime: true };
    }
    return null;
  }

  private handleAuthError() {
    localStorage.removeItem('token');
    alert('Your session has expired. Please log in again.');
    this.router.navigate(['/login']);
  }
}
