// confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  reservation: any;
  activity: any;
  qrCodeUrl: SafeUrl = '';
  currentDate = new Date();

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.reservation = navigation.extras.state['reservationData'];
      this.activity = navigation.extras.state['activity'];
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.generateQRCode();
  }

  generateQRCode(): void {
    const qrData = `
      Réservation #${this.reservation.activityReservationId}
      Nom: ${this.reservation.fullName}
      Activité: ${this.activity.name}
      Date: ${this.activity.date}
      Places: ${this.reservation.numberOfSeats}
      Contact: ${this.reservation.email} | ${this.reservation.phoneNumber}
    `;

    QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      }
    });
  }

  printTicket(): void {
    window.print();
  }
}
