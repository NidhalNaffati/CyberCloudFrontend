import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogCommentResponse } from '../../../interfaces/BlogCommentResponse';
import { BlogCommentResponseService } from '../../../services/blog-comment-response.service';

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html',
  styleUrls: ['./response-form.component.css']
})
export class ResponseFormComponent implements OnInit {
  responseForm: FormGroup;
  isEditMode: boolean = false;
  responseId: number | null = null;
  commentId: number | null = null;
  loading: boolean = false;
  error: string | null = null;
  userId: number = parseInt(localStorage.getItem('user_id') || '1'); // Récupérer l'ID utilisateur connecté

  constructor(
    private fb: FormBuilder,
    private responseService: BlogCommentResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Simplifier le formulaire pour ne contenir que le contenu et l'ID du commentaire
    this.responseForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      commentId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.responseId = +id;
        this.loadResponse(this.responseId);
      }
      
      // Récupérer l'ID du commentaire si disponible dans les query params
      this.route.queryParamMap.subscribe(queryParams => {
        const commentId = queryParams.get('commentId');
        if (commentId) {
          this.commentId = +commentId;
          this.responseForm.patchValue({ commentId: this.commentId });
        }
      });
    });
  }

  loadResponse(id: number): void {
    this.loading = true;
    this.responseService.getResponseById(id).subscribe({
      next: (response) => {
        // Ne charger que les champs nécessaires
        this.responseForm.patchValue({
          content: response.content,
          commentId: response.commentId
        });
        this.commentId = response.commentId;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la réponse:', err);
        this.error = 'Impossible de charger la réponse. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.responseForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.responseForm.controls).forEach(key => {
        const control = this.responseForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    
    // Créer l'objet de réponse en y ajoutant l'ID utilisateur du token
    const formValues = this.responseForm.value;
    const response: BlogCommentResponse = {
      content: formValues.content,
      commentId: formValues.commentId,
      userId: this.userId,
      createdAt: new Date()
    };

    console.log('Envoi de la réponse avec les données:', response);

    if (this.isEditMode && this.responseId) {
      // Mettre à jour une réponse existante
      this.responseService.updateResponse(this.responseId, response).subscribe({
        next: () => {
          this.router.navigate(['/admin/responses']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          this.error = 'Impossible de mettre à jour la réponse. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
    } else {
      // Créer une nouvelle réponse
      this.responseService.createResponse(response.commentId, response).subscribe({
        next: () => {
          this.router.navigate(['/admin/responses']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.error = 'Impossible de créer la réponse. Veuillez réessayer plus tard.';
          this.loading = false;
        }
      });
    }
  }
}