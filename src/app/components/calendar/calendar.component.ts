import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<any[]>('http://localhost:8080/appointments/calendar')
      .subscribe(data => {
        this.calendarOptions.events = data;
      }, error => {
        console.error('Erreur lors du chargement des événements:', error);
        this.showNotification('Erreur lors du chargement des événements', 'error');
      });
  }

  handleEventDrop(eventDropInfo: EventDropArg): void {
    const event = eventDropInfo.event;
    
    const updatedEvent = {
      id: event.id,
      start: event.start,
      end: event.end || event.start,
      title: event.title,
      allDay: event.allDay,
      extendedProps: event.extendedProps
    };

    this.http.put(`http://localhost:8080/appointments/${event.id}`, updatedEvent)
      .subscribe(
        () => {
          this.showNotification('Événement mis à jour avec succès', 'success');
        },
        error => {
          console.error('Erreur lors de la mise à jour:', error);
          eventDropInfo.revert();
          this.showNotification('Erreur lors de la mise à jour de l\'événement', 'error');
        }
      );
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: { 
        event: clickInfo.event,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      
      if (result.result === 'save') {
        this.http.put(`http://localhost:8080/appointments/${result.event.id}`, result.event)
          .subscribe(
            () => {
              this.showNotification('Événement mis à jour avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la mise à jour:', error);
              this.showNotification('Erreur lors de la mise à jour de l\'événement', 'error');
            }
          );
      } else if (result.result === 'delete') {
        this.http.delete(`http://localhost:8080/appointments/${result.event.id}`)
          .subscribe(
            () => {
              this.showNotification('Événement supprimé avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la suppression:', error);
              this.showNotification('Erreur lors de la suppression de l\'événement', 'error');
            }
          );
      }
    });
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '500px',
      data: { 
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      selectInfo.view.calendar.unselect();
      
      if (result && result.result === 'save') {
        this.http.post('http://localhost:8080/appointments', result.event)
          .subscribe(
            () => {
              this.showNotification('Événement créé avec succès', 'success');
              this.loadEvents();
            },
            error => {
              console.error('Erreur lors de la création:', error);
              this.showNotification('Erreur lors de la création de l\'événement', 'error');
            }
          );
      }
    });
  }

  handleEventDidMount(info: any): void {
    // Styliser les événements en fonction de leur statut
    if (info.event.extendedProps?.status === 'confirmed') {
      info.el.style.backgroundColor = '#28a745';
    } else if (info.event.extendedProps?.status === 'pending') {
      info.el.style.backgroundColor = '#ffc107';
    } else if (info.event.extendedProps?.status === 'cancelled') {
      info.el.style.backgroundColor = '#dc3545';
      info.el.style.textDecoration = 'line-through';
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
}