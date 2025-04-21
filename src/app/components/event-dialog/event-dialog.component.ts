import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Appointment } from 'src/app/models/appointment';


@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css'] // ou .css selon votre configuration
})
export class EventDialogComponent {
  appointmentForm: FormGroup;
  dialogTitle: string;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment, isEdit: boolean }
  ) {
    this.dialogTitle = data.isEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous';
    
    // Initialisation du formulaire
    this.appointmentForm = this.fb.group({
      date: [data.appointment.date, Validators.required],
      startTime: [data.appointment.startTime, Validators.required],
      endTime: [data.appointment.endTime, Validators.required],
      isAvailable: [data.appointment.isAvailable],
      userId: [data.appointment.userId, Validators.required]
    });
  }

  onSave(): void {
    if (this.appointmentForm.valid) {
      const updatedAppointment: Appointment = {
        ...this.data.appointment,
        ...this.appointmentForm.value
      };
      
      this.dialogRef.close({ 
        action: 'save', 
        appointment: updatedAppointment 
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if (this.data.isEdit) {
      this.dialogRef.close({ 
        action: 'delete', 
        appointment: this.data.appointment 
      });
    }
  }
}