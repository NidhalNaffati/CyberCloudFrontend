import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-medecin-list',
  templateUrl: './medecin-list.component.html',
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  styleUrls: ['./medecin-list.component.scss']
})
export class MedecinList implements OnInit {
  loading: boolean = false;
  medecins: any[] = [];
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.loadMedecins();
  }

  loadMedecins(): void {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/api/v1/admin/medecins`)
      .subscribe(
        (data) => {
          this.medecins = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading medecins:', error);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load medecins. Please try again later.',
          });
        }
      );
  }

  verifyMedecin(email: string, verified: boolean = true): void {
    Swal.fire({
      title: `${verified ? 'Verify' : 'Unverify'} Medecin`,
      text: `Are you sure you want to ${verified ? 'verify' : 'unverify'} this medecin's documents?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: verified ? '#3085d6' : '#d33',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${verified ? 'verify' : 'unverify'} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.http.post(`${this.apiUrl}/api/v1/admin/verify-medecin/${email}`, {verified},
          {responseType: 'text'})
          .subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Medecin documents ${verified ? 'verified' : 'unverified'} successfully!`,
              });
              this.loadMedecins(); // Reload the list
            },
            (error) => {
              console.error(`Error ${verified ? 'verifying' : 'unverifying'} medecin:`, error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to ${verified ? 'verify' : 'unverify'} medecin documents.`,
              });
              this.loading = false;
            }
          );
      }
    });
  }

  unverifyMedecin(email: string): void {
    this.verifyMedecin(email, false);
  }

  lockUser(email: string): void {
    Swal.fire({
      title: 'Lock User',
      text: 'Are you sure you want to lock this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, lock it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.http.post(`${this.apiUrl}/api/v1/admin/lock-user/${email}`, {},
          {responseType: 'text'})
          .subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User locked successfully!',
              });
              this.loadMedecins(); // Reload the list
            },
            (error) => {
              console.error('Error locking user:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to lock user.',
              });
              this.loading = false;
            }
          );
      }
    });
  }

  unlockUser(email: string): void {
    Swal.fire({
      title: 'Unlock User',
      text: 'Are you sure you want to unlock this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unlock it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.http.post(`${this.apiUrl}/api/v1/admin/unlock-user/${email}`, {},
          {responseType: 'text'})
          .subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User unlocked successfully!',
              });
              this.loadMedecins(); // Reload the list
            },
            (error) => {
              console.error('Error unlocking user:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to unlock user.',
              });
              this.loading = false;
            }
          );
      }
    });
  }

  downloadDocuments(medecinId: number): void {
    this.loading = true;
    this.http.get(`${this.apiUrl}/api/v1/admin/medecin-documents/${medecinId}`, {responseType: 'json'})
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response && response.documentData) {
            // Convert base64 to blob
            const byteCharacters = atob(response.documentData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: response.documentType});

            // Create download link and trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = response.documentName || `document-${medecinId}.${this.getFileExtension(response.documentType)}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Documents',
              text: 'No document found for this medecin.',
            });
          }
        },
        (error) => {
          console.error('Error downloading documents:', error);
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to download documents.',
          });
        }
      );
  }

  private getFileExtension(mimeType: string): string {
    const mimeMap: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'text/plain': 'txt'
    };

    return mimeMap[mimeType] || 'dat';
  }
}
