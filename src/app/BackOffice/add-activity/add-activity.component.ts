
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivityService } from 'src/app/services/activity.service';
import { Router } from '@angular/router';
import { AiService } from 'src/app/services/ai.service';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent implements OnInit {
  activityForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  wordCount: number = 0;
  isGeneratingDescription = false;
  regions: string[] = [
    'Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Monastir', 'Kairouan',
    'Bizerte', 'Ariana', 'Ben Arous', 'Kasserine', 'Gafsa',
    'Sidi Bouzid', 'Gabès', 'Mednine', 'Tozeur', 'Jendouba',
    'Zaghouan', 'Siliana', 'Kebili'
  ];

  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private router: Router,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.activityForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      details: ['', [
        Validators.required,
        this.minWordsValidator(4)
      ]],
      location: ['', Validators.required],
      availableSeats: ['', [
        Validators.required,
        Validators.min(1)
      ]],
      date: ['', [
        Validators.required,,
        this.futureDateValidator
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0.01)
      ]],
      image: [null]
    });
  }

  onContentChanged(content: any) {
    const text = content.html.replace(/<[^>]*>/g, ' ');
    this.wordCount = text.trim().split(/\s+/).filter((word: string | any[]) => word.length > 0).length;
    this.activityForm.get('details')?.updateValueAndValidity();
  }

  minWordsValidator(minWords: number) {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      const text = control.value.replace(/<[^>]*>/g, ' ');
      const words = text.trim().split(/\s+/).filter((word: string | any[]) => word.length > 0).length;

      return words >= minWords ? null : { minWords: true };
    };
  }

  futureDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? null : { pastDate: true };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.activityForm.patchValue({ image: this.selectedFile });
      this.activityForm.get('image')?.updateValueAndValidity();

      // Générer l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.activityForm.patchValue({ image: null });
    // Réinitialiser le champ input file
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addActivity(): void {
    if (this.activityForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.activityForm.controls).forEach(key => {
      if (key === 'image' && this.selectedFile) {
        formData.append(key, this.selectedFile, this.selectedFile.name);
      } else {
        formData.append(key, this.activityForm.get(key)?.value);
      }
    });

    this.activityService.addActivity(formData).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout', err);
        alert('Une erreur est survenue');
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.activityForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  generateDescription() {
    const title = this.activityForm.get('name')?.value;
    if (!title) {
      alert('Veuillez d\'abord saisir le nom de l\'activité.');
      return;
    }
    this.isGeneratingDescription = true;
    this.aiService.generateDescription(title).subscribe({
      next: (desc: string) => {
        this.activityForm.get('details')?.setValue(desc);
        this.isGeneratingDescription = false;
      },
      error: () => {
        alert('Erreur lors de la génération de la description.');
        this.isGeneratingDescription = false;
      }
    });
  }
}
