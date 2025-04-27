import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from 'src/app/services/complaint.service';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaint } from 'src/app/models/response-complaint';
import { Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-complaints',
  templateUrl: './add-complaints.component.html',
  styleUrls: ['./add-complaints.component.css']
})
export class AddComplaintsComponent implements OnInit, OnDestroy {
  complaintForm!: FormGroup;
  responseForm!: FormGroup;
  complaints: Complaint[] = [];
  responses: ResponseComplaint[] = [];
  allResponsesVisible: boolean = false;
  visibleResponsesCount: number = 4;
  isLoading: boolean = false;

  isEditMode = false;
  selectedComplaintId: number | null = null;
  p: number = 1;
  selectedComplaint: Complaint | null = null;
  isEditingResponse = false;
  currentResponseId: number | null = null;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right']
  ];

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private responseComplaintService: ResponseComplaintService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
      inputRules: true
    });
    
    this.complaintForm = this.fb.group({
      subject: ['', Validators.required],
      content: ['', Validators.required],
      starRatingConsultation: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      isUrgent: [false],
      isRead: [false]
    });

    this.responseForm = this.fb.group({
      responseContent: ['', Validators.required]
    });

    this.loadComplaints();

    const storedComplaint = localStorage.getItem('selectedComplaint');
    if (storedComplaint) {
      const complaint: Complaint = JSON.parse(storedComplaint);
      this.getComplaint(complaint);
      localStorage.removeItem('selectedComplaint');
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  refreshComplaints(): void {
    this.isLoading = true;
    this.complaints = [];
    
    this.complaintService.getComplaints().subscribe({
      next: (data: Complaint[]) => {
        this.complaints = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
        this.isLoading = false;
      }
    });
  }

  clearSidebar(): void {
    this.complaints = [];
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.getComplaints().subscribe({
      next: (data: Complaint[]) => {
        this.complaints = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
        this.isLoading = false;
      }
    });
  }

  getSafeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getComplaint(complaint: Complaint): void {
    this.isEditMode = false;
    this.selectedComplaintId = complaint.complaintId;
    this.selectedComplaint = complaint;
    this.complaintForm.patchValue(complaint);
    this.loadResponses(complaint.complaintId);
  }

  showAllResponses(): void {
    this.allResponsesVisible = true;
  }

  hoverRating: number | null = null;

  getSortedComplaints(): Complaint[] {
    return this.complaints.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  getRatingText(rating: number): string {
    const ratingTexts = {
      0: 'Not rated',
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || 'Rate the service';
  }

  enableEditMode(): void {
    this.isEditMode = true;
    
    if (this.selectedComplaint) {
      this.complaintForm.patchValue({
        subject: this.selectedComplaint.subject,
        content: this.selectedComplaint.content,
        starRatingConsultation: this.selectedComplaint.starRatingConsultation,
        isUrgent: this.selectedComplaint.isUrgent
      });
    }
  }

  setRating(rating: number): void {
    this.complaintForm.patchValue({ starRatingConsultation: rating });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    if (!this.selectedComplaintId) {
      this.complaintForm.reset();
    }
  }

  loadResponses(complaintId: number): void {
    this.responseComplaintService.getResponsesByComplaint(complaintId).subscribe({
      next: (data: ResponseComplaint[]) => {
        this.responses = data.sort((a, b) => 
          new Date(a.dateRep).getTime() - new Date(b.dateRep).getTime()
        );
        this.allResponsesVisible = false;
      },
      error: (err) => console.error('Error loading responses:', err)
    });
  }

  onSubmitResponse(): void {
    if (this.responseForm.invalid || !this.selectedComplaintId) {
      return;
    }
  
    const responseContent = this.responseForm.value.responseContent;
    const currentUserId = this.authService.getUserId();
  
    if (!currentUserId) {
      alert('You must be logged in to submit a response');
      return;
    }
  
    
  
        const responseObj: ResponseComplaint = {
          responseId: 0,
          complaintId: this.selectedComplaintId!,
          userId: currentUserId,
          content: responseContent,
          dateRep: new Date().toISOString(),
          isReadRep: false
        };
  
        this.responseComplaintService.addResponse(this.selectedComplaintId!, responseObj).subscribe({
          next: () => {
            this.responseForm.reset();
            this.loadResponses(this.selectedComplaintId!);
            this.refreshComplaints();
            this.isEditingResponse = false;
          },
          error: (err) => console.error('Error adding response:', err)
        });
      }



  editResponse(response: ResponseComplaint): void {
    
    if (this.selectedComplaint && response.userId === this.selectedComplaint.userId) {
      this.isEditingResponse = true;
      this.currentResponseId = response.responseId;
      this.responseForm.patchValue({
        responseContent: response.content
      });
    }
  }

  onUpdateResponse(): void {
    if (this.responseForm.invalid || !this.currentResponseId || !this.selectedComplaintId || 
        !this.selectedComplaint) {
      return;
    }

    const responseContent = this.responseForm.value.responseContent;

   

        const responseToUpdate = this.responses.find(r => r.responseId === this.currentResponseId);
        if (!responseToUpdate || responseToUpdate.userId !== this.selectedComplaint!.userId) {
          return;
        }

        const updatedResponse: ResponseComplaint = {
          responseId: this.currentResponseId!,
          complaintId: this.selectedComplaintId!,
          userId: this.selectedComplaint!.userId,
          content: responseContent,
          dateRep: new Date().toISOString(),
          isReadRep: false
        };

        this.responseComplaintService.updateResponse(this.currentResponseId!, updatedResponse).subscribe({
          next: () => {
            this.responseForm.reset();
            this.loadResponses(this.selectedComplaintId!);
            this.refreshComplaints(); // Rafraîchir le sidebar après mise à jour
            this.isEditingResponse = false;
            this.currentResponseId = null;
          },
          error: (err) => console.error('Error updating response:', err)
        });
      }
  cancelEditResponse(): void {
    this.isEditingResponse = false;
    this.currentResponseId = null;
    this.responseForm.reset();
  }

  deleteResponse(responseId: number): void {
    const currentUserId = this.authService.getUserId();
    if (!currentUserId || !confirm('Do you really want to delete this response?')) {
      return;
    }

    this.responseComplaintService.deleteResponse(responseId).subscribe({
      next: () => {
        this.loadResponses(this.selectedComplaintId!);
        this.refreshComplaints();
      },
      error: (err) => {
        console.error('Error during deletion:', err);
        alert('Error during deletion.');
      }
    });
  }

  onSubmit(): void {
    if (this.complaintForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
  
    const currentUserId = this.authService.getUserId();
    if (!currentUserId) {
      alert('You must be logged in to submit a complaint');
      return;
    }
  
    const complaint: Complaint = {
      ...this.complaintForm.value,
      userId: currentUserId
    };
  
        if (this.isEditMode && this.selectedComplaintId !== null) {
          this.complaintService.updateComplaint(this.selectedComplaintId, complaint).subscribe({
            next: () => {
              alert('Complaint updated.');
              this.refreshComplaints();
              this.resetForm();
            },
            error: () => alert('Error updating complaint.')
          });
        } else {
          this.complaintService.addComplaint(complaint, currentUserId).subscribe({
            next: () => {
              alert('Complaint added!');
              this.refreshComplaints();
              this.resetForm();
            },
            error: () => alert('Error adding complaint.')
          });
        }
      
  }

  startAddingNewComplaint(): void {
    this.isEditMode = false;
    this.selectedComplaintId = null;
    this.complaintForm.reset({
      subject: '',
      content: '',
      starRatingConsultation: 0,
      isUrgent: false,
      isRead: false
    });
  }

  resetForm(): void {
    this.complaintForm.reset({
      subject: '',
      content: '',
      starRatingConsultation: 0,
      isUrgent: false,
      isRead: false
    });
    this.isEditMode = false;
    this.selectedComplaintId = null;
  }

  getVisibleResponses(): ResponseComplaint[] {
    if (this.allResponsesVisible) {
      return this.responses;
    } else {
      const startIndex = Math.max(0, this.responses.length - 4);
      return this.responses.slice(startIndex);
    }
  }
} 
