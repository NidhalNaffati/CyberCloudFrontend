import { Component, OnInit } from '@angular/core';
 import { ActivatedRoute } from '@angular/router';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemboursementServiceService } from 'src/app/services/remboursement/remboursement-service.service';
import { GeminiService } from 'src/app/services/gemini/gemini.service';
import { Remboursement } from 'src/app/models/remboursement';
 
@Component({
  selector: 'app-remboursement',
  templateUrl: './remboursement.component.html',
  styleUrls: ['./remboursement.component.css'],
})
export class RemboursementComponent implements OnInit {
  hasRemoursement: boolean = false;
  remboursementForm!: FormGroup;
  factureId = 0;

  constructor(
    private roumbresemntService: RemboursementServiceService,
    private route: ActivatedRoute,
    private geminiService: GeminiService,
    private fb: FormBuilder
  ) {}
  remboursement: Remboursement | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('factureId');
      this.factureId = Number(id);

      this.roumbresemntService
        .getRemoursementByFactureId(Number(id))
        .subscribe((d) => (this.remboursement = d));
    });

    this.remboursementForm = this.fb.group({
      raison: ['', Validators.required],
    });
  }
  submit(): void {
    if (this.remboursementForm.valid) {
      const remboursementData: Remboursement = {
        raison: this.remboursementForm.value.raison,
      };
      if (this.factureId != 0)
        this.roumbresemntService
          .addRemboursement(remboursementData, this.factureId)
          .subscribe((res) => {
            this.remboursement = res;
          });
    }
  }
  wordCount(text: any): number {
    if (!text || typeof text !== 'string') return 0;

    // Remove extra whitespace and split by space
    const words = text.trim().split(/\s+/);

    const count = words.filter((word) => word.length > 0).length;
    console.log(count);
    return count;
  }
  IAhelper() {
    const text = this.remboursementForm.get('raison')?.value;
    if (text && typeof text === 'string') {
      this.geminiService.correctReasonText(text).subscribe((response) => {
        this.remboursementForm.setValue({ raison: response });
      });
    }
  }
}
