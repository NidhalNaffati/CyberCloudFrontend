// event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.css']
})
export class EventDialogComponent {
  eventForm: FormGroup;
  dialogTitle: string;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogTitle = data.isEdit ? 'Modifier l\'événement' : 'Nouvel événement';
    
    // Initialisation du formulaire
    this.eventForm = this.fb.group({
      title: [data.event ? data.event.title : '', Validators.required],
      description: [data.event ? data.event.extendedProps?.description : ''],
      startDate: [data.event ? data.event.start : data.start, Validators.required],
      endDate: [data.event ? data.event.end : data.end],
      allDay: [data.event ? data.event.allDay : data.allDay],
      status: [data.event ? data.event.extendedProps?.status || 'pending' : 'pending']
    });
  }

  onSave(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close({
        result: 'save',
        event: {
          ...this.data.event,
          title: this.eventForm.value.title,
          start: this.eventForm.value.startDate,
          end: this.eventForm.value.endDate,
          allDay: this.eventForm.value.allDay,
          extendedProps: {
            description: this.eventForm.value.description,
            status: this.eventForm.value.status
          }
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ result: 'cancel' });
  }

  onDelete(): void {
    if (this.data.isEdit) {
      this.dialogRef.close({ result: 'delete', event: this.data.event });
    }
  }
}
