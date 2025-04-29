import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventDrop: this.handleEventDrop.bind(this),
    eventClick: this.handleEventClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDidMount: this.handleEventDidMount.bind(this)
  };

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.appointmentService.getAllAppointments()
      .subscribe(
        appointments => {
          console.log('Rendez-vous reçus:', appointments);
          
          // Convertir les rendez-vous au format FullCalendar
          const events = appointments.map(appointment => {
            // Créer les dates de début et de fin en combinant date et heure
            const startDate = `${appointment.date}T${appointment.startTime}`;
            const endDate = `${appointment.date}T${appointment.endTime}`;
            
            return {
              id: appointment.id?.toString(),
              title: appointment.isAvailable ? 'Disponible' : 'Rendez-vous',
              start: startDate,
              end: endDate,
              allDay: false,
              extendedProps: {
                userId: appointment.userId,
                isAvailable: appointment.isAvailable,
                originalAppointment: appointment // Garder l'objet original pour la mise à jour
              }
            };
          });
          
          console.log('Événements formatés pour FullCalendar:', events);
          
          // Mettre à jour les événements du calendrier
          this.calendarOptions = {
            ...this.calendarOptions,
            events: events
          };
        },
        error => {
          console.error('Erreur lors du chargement des rendez-vous:', error);
          this.showNotification('Erreur lors du chargement des rendez-vous', 'error');
        }
      );
  }

  handleEventDrop(eventDropInfo: EventDropArg): void {
    const event = eventDropInfo.event;
    const originalAppointment = event.extendedProps['originalAppointment'] as Appointment;
    
    // Extraire la nouvelle date et les nouvelles heures après le déplacement
    const newStart = event.start;
    const newEnd = event.end || event.start;
    
    if (!newStart || !newEnd) {
      eventDropInfo.revert();
      this.showNotification('Erreur: dates invalides', 'error');
      return;
    }
    
    // Mettre à jour l'objet rendez-vous avec les nouvelles valeurs
    const updatedAppointment: Appointment = {
      ...originalAppointment,
      date: newStart.toISOString().split('T')[0], // Format YYYY-MM-DD
      startTime: newStart.toISOString().split('T')[1].substring(0, 8), // Format HH:mm:ss
      endTime: newEnd.toISOString().split('T')[1].substring(0, 8), // Format HH:mm:ss
      getStartDateTime: () => newStart,
      getEndDateTime: () => newEnd,
      getDurationMinutes: () => (newEnd.getTime() - newStart.getTime()) / (1000 * 60)
    };
    
    console.log('Mise à jour du rendez-vous:', updatedAppointment);
    
    this.appointmentService.updateAppointment(originalAppointment.id!, updatedAppointment)
      .subscribe(
        () => {
          this.showNotification('Rendez-vous mis à jour avec succès', 'success');
        },
        error => {
          console.error('Erreur lors de la mise à jour:', error);
          eventDropInfo.revert();
          this.showNotification('Erreur lors de la mise à jour du rendez-vous', 'error');
        }
      );
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const event = clickInfo.event;
    const originalAppointment = event.extendedProps['originalAppointment'] as Appointment;
    
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        appointment: originalAppointment,
        isEdit: true
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      
      if (result.action === 'save') {
        const updatedAppointment = result.appointment;
        
        this.appointmentService.updateAppointment(updatedAppointment.id!, updatedAppointment)
          .subscribe(
            () => {
              this.showNotification('Rendez-vous mis à jour avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la mise à jour:', error);
              this.showNotification('Erreur lors de la mise à jour du rendez-vous', 'error');
            }
          );
      } else if (result.action === 'delete') {
        this.appointmentService.deleteAppointment(originalAppointment.id!)
          .subscribe(
            () => {
              this.showNotification('Rendez-vous supprimé avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la suppression:', error);
              this.showNotification('Erreur lors de la suppression du rendez-vous', 'error');
            }
          );
      }
    });
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const selectedDate = selectInfo.start.toISOString().split('T')[0];
    let startTime = selectInfo.startStr.split('T')[1];
    let endTime = selectInfo.endStr.split('T')[1];
    
    // Si l'heure n'est pas définie (sélection de jour entier), utiliser des valeurs par défaut
    if (!startTime) {
      startTime = '09:00:00';
      endTime = '10:00:00';
    } else {
      // Limiter à HH:mm:ss
      startTime = startTime.substring(0, 8);
      endTime = endTime.substring(0, 8);
    }
    
    // Créer un nouveau rendez-vous vide
    const newAppointment: Appointment = {
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      userId: 1, // Remplacer par l'ID de l'utilisateur connecté
      isAvailable: true,
      getStartDateTime: () => new Date(`${selectedDate}T${startTime}`),
      getEndDateTime: () => new Date(`${selectedDate}T${endTime}`),
      getDurationMinutes: () => {
        const start = new Date(`${selectedDate}T${startTime}`);
        const end = new Date(`${selectedDate}T${endTime}`);
        return (end.getTime() - start.getTime()) / (1000 * 60);
      }
    };
    
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: {
        appointment: newAppointment,
        isEdit: false
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      selectInfo.view.calendar.unselect();
      
      if (result && result.action === 'save') {
        this.appointmentService.createAppointment(result.appointment)
          .subscribe(
            () => {
              this.showNotification('Rendez-vous créé avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la création:', error);
              this.showNotification('Erreur lors de la création du rendez-vous', 'error');
            }
          );
      }
    });
  }

  handleEventDidMount(info: any): void {
    // Styliser les événements en fonction de leur disponibilité
    if (info.event.extendedProps.isAvailable) {
      info.el.style.backgroundColor = '#28a745'; // Vert pour disponible
    } else {
      info.el.style.backgroundColor = '#007bff'; // Bleu pour rendez-vous
    }
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
  goToAdminPage(): void {
    this.router.navigate(['/admin']);
  }
}