import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComplaintService } from 'src/app/services/complaint.service';
import { ResponseComplaintService } from 'src/app/services/response-complaint.service';
import { Complaint } from 'src/app/models/complaint';
import { ResponseComplaint } from 'src/app/models/response-complaint';
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-add-responsecomplaint',
  templateUrl: './add-responsecomplaint.component.html',
  styleUrls: ['./add-responsecomplaint.component.css'],
  
})
export class AddResponsecomplaintComponent implements OnInit, OnChanges {
  @Input() complaintId!: number;
  @Input() responseId?: number; // 👈 Ajoutez cette ligne
  responseComplaint?: Complaint; //
  complaint!: Complaint;
  selectedResponse?: ResponseComplaint; // 👈 Ajoutez cette ligne
  responses: ResponseComplaint[] = [];
  responseForm: FormGroup;
  showResponses: boolean = false;
  showResponseForm: boolean = false;
  editingResponse: boolean = false;
  responseToEdit: ResponseComplaint | null = null;
  visibleResponsesCount: number = 4;  // Limite initiale de réponses visibles
  allResponsesVisible: boolean = false;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right']
  ];
  // Ajouter cette ligne pour accéder au formulaire de réponse
  @ViewChild('responseFormSection') responseFormSection!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private responseService: ResponseComplaintService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public authService: AuthService

  ) {
    this.responseForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
      inputRules: true
    });
    const routeId = this.route.snapshot.paramMap.get('id');
    if (this.complaintId) {
      this.getComplaintById(this.complaintId);
    } else if (routeId) {
      this.complaintId = +routeId;
      this.getComplaintById(this.complaintId);
    }
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['complaintId'] && changes['complaintId'].currentValue) {
      this.getComplaintById(changes['complaintId'].currentValue);
    }
    if (changes['responseId'] && changes['responseId'].currentValue) {
      this.loadResponse(changes['responseId'].currentValue);
    }
  }
  loadResponse(responseId: number): void {
    this.responseService.getResponseById(responseId).subscribe({
      next: (response) => {
        this.selectedResponse = response;
        // Charger la plainte associée à la réponse
        this.loadComplaintForResponse(responseId);
        
        // Si les réponses sont déjà visibles, recharger celles de cette plainte
        if (this.showResponses) {
          this.responseService.getComplaintByResponseId(responseId).subscribe(complaint => {
            this.loadResponsesForComplaint(complaint.complaintId);
          });
        }
      },
      error: (error) => {
        console.error('Error loading response:', error);
      }
    });
  }
  loadComplaintForResponse(responseId: number): void {
    this.responseService.getComplaintByResponseId(responseId).subscribe({
      next: (complaint) => {
        this.responseComplaint = complaint;
      },
      error: (error) => {
        console.error('Error loading complaint for response:', error);
      }
    });
  }
  getSafeHtml(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
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
  scrollToLatestResponse(): void {
    setTimeout(() => {
      const container = document.querySelector('.timeline-scroll-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
  loadResponses(): void {
    this.responseService.getResponsesByComplaint(this.complaintId).subscribe({
      next: (data) => {
        this.responses = data.sort((a, b) => 
          new Date(a.dateRep).getTime() - new Date(b.dateRep).getTime()
        );
        this.scrollToLatestResponse();
      },
      error: (error) => {
        alert("Error fetching the responses.");
        console.error(error);
      }
    });
  }
  
  showAllResponses(): void {
    // Affiche toutes les réponses en partant du début (les plus anciennes)
    this.visibleResponsesCount = this.responses.length;
    this.allResponsesVisible = true;
  }
  addResponse(): void {
    if (this.responseForm.invalid) {
      alert('Please fill in the content.');
      return;
    }
  
    const responseContent = this.responseForm.value.content;
    const currentComplaintId = this.responseComplaint?.complaintId || this.complaintId;
    const userId = this.authService.getUserId(); // Récupérer l'ID utilisateur connecté
  
    if (!userId) {
      alert('You must be logged in to submit a response.');
      return;
    }
  
    // Vérification des mots inappropriés...
  
    const response: ResponseComplaint = {
      responseId: this.editingResponse ? this.responseToEdit!.responseId : 0,
      userId: userId, // Utiliser l'ID utilisateur connecté
      content: responseContent,
      complaintId: currentComplaintId,
      dateRep: new Date().toISOString(),
      isReadRep: false
    };
  
    if (this.editingResponse) {
      this.updateResponse(response);
    } else {
      this.createResponse(response);
    }
  }
  createResponse(response: ResponseComplaint): void {
    this.responseService.addResponse(response.complaintId, response).subscribe({
      next: (newResponse: ResponseComplaint) => {
        this.responseForm.reset();
        this.showResponses = true;

        // Ajouter la nouvelle réponse à la liste
        this.responses.push(newResponse);
        this.showResponseForm = false;
        
        // Afficher un message de confirmation avec information sur l'envoi d'email si c'est un admin
        if (this.authService.isAdmin()) {
          // Si c'est un admin qui répond, on peut supposer que l'email a été envoyé
          // car le backend envoie automatiquement un email à l'utilisateur qui a créé la plainte
          alert("Response added successfully! An email notification has been sent to the user.");
        } else {
          alert("Response added successfully!");
        }
        
        // Recharger les réponses pour s'assurer d'avoir les dernières données
        this.loadResponsesForComplaint(response.complaintId);
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
        this.responseForm.reset();
        
        // Recharger les réponses
        this.loadResponsesForComplaint(response.complaintId);
        
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
  
  shouldShowEditButton(response: ResponseComplaint): boolean {
    const currentUserId = this.authService.getUserId();
  
    // Vérifie si la réponse est la dernière de la liste
    const isLastResponse = this.responses.length > 0 && this.responses[this.responses.length - 1].responseId === response.responseId;
  
    // Afficher les boutons seulement si c'est la dernière réponse
    if (!isLastResponse) {
      return false;
    }
  
    // Si l'utilisateur est admin ou l'auteur de la réponse
    return this.authService.isAdmin() || currentUserId === response.userId;
  }
  toggleResponses(): void {
    this.showResponses = !this.showResponses;
    
    if (this.showResponses) {
      // Si on affiche une réponse spécifique, charger les réponses de responseComplaint
      if (this.selectedResponse && this.responseComplaint) {
        this.loadResponsesForComplaint(this.responseComplaint.complaintId);
      } 
      // Sinon charger les réponses de la plainte principale
      else if (this.complaint) {
        this.loadResponsesForComplaint(this.complaint.complaintId);
      }
    }
  }
  loadResponsesForComplaint(complaintId: number): void {
    this.responseService.getResponsesByComplaint(complaintId).subscribe({
      next: (data) => {
        this.responses = data.sort((a, b) => 
          new Date(a.dateRep).getTime() - new Date(b.dateRep).getTime()
        );
        this.scrollToLatestResponse();
      },
      error: (error) => {
        alert("Error fetching the responses.");
        console.error(error);
      }
    });
  }

  toggleResponseForm(): void {
    this.showResponseForm = !this.showResponseForm;
    
    if (this.showResponseForm) {
      this.editingResponse = false;
      this.responseForm.reset({
        content: ''
      });
      
      // Faire défiler vers le formulaire
      this.scrollToResponseForm();
    }
  }

  // Fonction pour faire défiler l'écran vers le formulaire
  scrollToResponseForm(): void {
    if (this.responseFormSection) {
      this.responseFormSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  editResponse(response: ResponseComplaint): void {
    // Vérifier le contenu avant d'ouvrir le formulaire d'édition
  
        // Si le contenu est acceptable, permettre l'édition
        this.responseForm.setValue({
          content: response.content
        });
        this.editingResponse = true;
        this.responseToEdit = response;
        this.showResponseForm = true;
        this.scrollToResponseForm();
      }

  // Méthode pour confirmer la suppression
confirmDelete(response: ResponseComplaint): void {
  if (confirm('Are you sure you want to delete this response?')) {
    this.deleteResponse(response.responseId);
  }
}

// Méthode pour supprimer effectivement la réponse
deleteResponse(responseId: number): void {
  this.responseService.deleteResponse(responseId).subscribe({
    next: () => {
      alert('Response deleted successfully!');
      this.loadResponses(); // Recharger les réponses après suppression
    },
    error: (error) => {
      alert("Error deleting the response.");
      console.error(error);
    }
  });
}
}
