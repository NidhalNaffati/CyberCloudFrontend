import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css']
})
export class EditActivityComponent implements OnInit {
  activityForm!: FormGroup;
  activityId!: number;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  regions: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Bizerte', 'Beja', 'Jendouba',
    'Zaghouan', 'Siliana', 'Le Kef', 'Sousse', 'Monastir', 'Mahdia', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activityId = +this.route.snapshot.paramMap.get('id')!;
    this.loadActivity(this.activityId);

    // Initialisation du formulaire avec validations
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ ]+$')]],
      details: ['', [Validators.required, Validators.pattern('.*[A-Za-zÀ-ÖØ-öø-ÿ]+.*')]],
      location: ['', Validators.required],
      availableSeats: ['', [Validators.required, Validators.min(1)]],
      date: ['', [Validators.required,this.futureDateValidator]],
      price: ['', [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  // Charger les données existantes
  loadActivity(id: number): void {
    this.activityService.getActivityById(id).subscribe(activity => {
      this.activityForm.patchValue({
        name: activity.name,
        details: activity.details,
        location: activity.location,
        availableSeats: activity.availableSeats,
        date: activity.date,
        price: activity.price
      });
      this.imagePreview = activity.image ? activity.image : null;
    });
  }

  // Validation pour la date future
  futureDateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Pour ignorer l'heure
    const selectedDate = new Date(control.value);
    return selectedDate && selectedDate < today ? { 'invalidDate': true } : null;
  }

  // Mettre à jour l'activité
  updateActivity(): void {
    if (this.activityForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.activityForm.controls).forEach(key => {
      const value = this.activityForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    this.activityService.updateActivity(this.activityId, formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);

      }
    });
  }

  onImageChanged(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.activityForm.patchValue({ image: file });
      this.activityForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.activityForm.patchValue({ image: null });
    // Réinitialiser le champ input file
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.activityForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  cancel(): void {
    if (this.activityForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler? Les modifications non enregistrées seront perdues.')) {
        this.router.navigate(['/admin/dashboard']);
      }
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
