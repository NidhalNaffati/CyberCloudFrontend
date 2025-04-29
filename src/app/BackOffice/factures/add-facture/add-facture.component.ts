import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Facture } from 'src/app/models/facture';
import { FactureServiceService } from 'src/app/services/facture/facture-service.service';
 @Component({
  selector: 'app-add-facture',
  standalone: false,
  templateUrl: './add-facture.component.html',
})
export class AddFactureComponent {
  //protected readonly routes = routes;

  facture: Partial<Facture> = {
    montant: 0,
  };
  selectedDoctorId!: number;
  selectedPatientId!: number;

  doctors :any[]=[];
  patients:any[]= [];

  constructor(
    private router: Router,
    private factureService: FactureServiceService,
   ) {}

  ngOnInit(): void {
    console.log('Im hzere ');
    this.factureService.getAllDoctors().subscribe((data) => {
      this.doctors = data;
    });

    this.factureService.getAllPatients().subscribe((data) => {
      this.patients = data;
    });
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const newFacture: Facture = {
        ...this.facture,
        // You can include doctorId and patientId in the facture model if needed
      } as Facture;

      this.factureService
        .addFacture(newFacture, this.selectedDoctorId, this.selectedPatientId)
        .subscribe({
          next: () => this.router.navigate(['/admin/factures']),
          error: (error) => console.error('Error adding facture:', error),
        });
    } else {
      form.control.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/factures']);
  }
}
