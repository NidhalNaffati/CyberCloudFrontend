import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from 'src/app/services/complaint.service';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaint } from 'src/app/models/response-complaint';

@Component({
  selector: 'app-add-responsecomplaint',
  templateUrl: './add-responsecomplaint.component.html',
  styleUrls: ['./add-responsecomplaint.component.css'],
  
})
export class AddResponsecomplaintComponent implements OnInit, OnChanges {
  @Input() complaintId!: number;
  complaint!: Complaint;
  responses: ResponseComplaint[] = [];
  responseForm: FormGroup;
  showResponses: boolean = false;
  showResponseForm: boolean = false;
  editingResponse: boolean = false;
  responseToEdit: ResponseComplaint | null = null;
  visibleResponsesCount: number = 4;  // Limite initiale de réponses visibles
  allResponsesVisible: boolean = false;
  // Ajouter cette ligne pour accéder au formulaire de réponse
  @ViewChild('responseFormSection') responseFormSection!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private responseService: ResponseComplaintService,
    private fb: FormBuilder
  ) {
    this.responseForm = this.fb.group({
      userId: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (this.complaintId) {
      this.getComplaintById(this.complaintId);
    } else if (routeId) {
      this.complaintId = +routeId;
      this.getComplaintById(this.complaintId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['complaintId'] && changes['complaintId'].currentValue) {
      this.getComplaintById(changes['complaintId'].currentValue);
    }
  }

  getComplaintById(id: number): void {
    this.complaintService.getComplaintById(id).subscribe({
      next: (data) => {
        this.complaint = data;
        this.loadResponses();
      },
      error: (error) => {
        alert("Error fetching the complaint.");
        console.error(error);
      }
    });
  }

  loadResponses(): void {
    this.responseService.getResponsesByComplaint(this.complaintId).subscribe({
      next: (data) => {
        this.responses = data;
      },
      error: (error) => {
        alert("Error fetching the responses.");
        console.error(error);
      }
    });
  }
  showAllResponses(): void {
    this.visibleResponsesCount = this.responses.length; // Affiche toutes les réponses
    this.allResponsesVisible = true; // Indique que toutes les réponses sont visibles
  }
  addResponse(): void {
    if (this.responseForm.invalid) {
      alert('Please fill in all fields.');
      return;
    }

    const response: ResponseComplaint = {
      responseId: this.editingResponse ? this.responseToEdit!.responseId : 0,
      userId: this.responseForm.value.userId,
      content: this.responseForm.value.content,
      complaintId: this.complaintId,
      dateRep: new Date().toISOString()
    };

    if (this.editingResponse) {
      this.updateResponse(response);
    } else {
      this.createResponse(response);
    }
  }

  createResponse(response: ResponseComplaint): void {
    this.responseService.addResponse(this.complaintId, response).subscribe({
      next: (newResponse: ResponseComplaint) => {
        alert('Response sent successfully!');
        this.responseForm.reset();
        this.responses.push(newResponse);
        this.showResponseForm = false;
      },
      error: (error) => {
        alert("Error sending the response.");
        console.error(error);
      }
    });
  }

  updateResponse(response: ResponseComplaint): void {
    this.responseService.updateResponse(response.responseId, response).subscribe({
      next: () => {
        alert('Response updated successfully!');
        this.responseForm.reset();
        this.loadResponses();
        this.showResponseForm = false;
        this.editingResponse = false;
        this.responseToEdit = null;
      },
      error: (error) => {
        alert("Error updating the response.");
        console.error(error);
      }
    });
  }

  toggleResponses(): void {
    this.showResponses = !this.showResponses;
  }

  toggleResponseForm(): void {
    this.showResponseForm = !this.showResponseForm;
    if (this.showResponseForm) {
      this.editingResponse = false;
      this.responseForm.reset();
    }
  }

  // Fonction pour faire défiler l'écran vers le formulaire
  scrollToResponseForm(): void {
    if (this.responseFormSection) {
      this.responseFormSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  editResponse(response: ResponseComplaint): void {
    this.responseForm.setValue({
      userId: response.userId,
      content: response.content
    });
    this.editingResponse = true;
    this.responseToEdit = response;
    this.showResponseForm = true;

    // Appel de la méthode pour faire défiler vers le formulaire
    this.scrollToResponseForm();
  }
}
