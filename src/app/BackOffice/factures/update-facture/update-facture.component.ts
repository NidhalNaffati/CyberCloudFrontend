import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Facture } from 'src/app/models/facture';
import { FactureServiceService } from 'src/app/services/facture/facture-service.service';
 
@Component({
  selector: 'app-update-facture',
  standalone: false,
  templateUrl: './update-facture.component.html',
})
export class UpdateFactureComponent {
  facture!: Facture;
  factureId: number | undefined;

  doctors: any[] = [];
  patients: any[] = [];

  selectedDoctorId: number | undefined;
  selectedPatientId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private factureService: FactureServiceService,
   ) {}

  ngOnInit(): void {
    this.factureId = +this.route.snapshot.paramMap.get('id')!;
    if (this.factureId) {
      this.loadFacture(this.factureId);
      this.loadDoctors();
      this.loadPatients();
    } else {
      console.error('No facture ID provided');
    }
  }

  loadFacture(id: number): void {
    this.factureService.getFactureById(id).subscribe({
      next: (facture: Facture) => {
        this.facture = { ...facture };
        this.selectedDoctorId = facture.doctor?.id;
        this.selectedPatientId = facture.patient?.id;
      },
      error: (error) => {
        console.error('Error loading facture:', error);
      },
    });
  }

  loadDoctors(): void {
    this.factureService.getAllDoctors().subscribe({
      next: (docs) => (this.doctors = docs),
      error: (err) => console.error('Error loading doctors:', err),
    });
  }

  loadPatients(): void {
    this.factureService.getAllPatients().subscribe({
      next: (pats) => (this.patients = pats),
      error: (err) => console.error('Error loading patients:', err),
    });
  }

  onSubmit(form: any): void {
    if (form.valid && this.factureId) {
      const updatedFacture: Facture = {
        id: this.factureId,
        montant: this.facture.montant,
        doctorId: this.selectedDoctorId,
        patientId: this.selectedPatientId,
      };
      this.factureService
        .updateFacture(updatedFacture.id, updatedFacture)
        .subscribe({
          next: (response) => {
            console.log('Facture updated successfully:', response);
            this.router.navigate(['/admin/factures']);
          },
          error: (error) => {
            console.error('Error updating facture:', error);
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/factures']);
  }
}
