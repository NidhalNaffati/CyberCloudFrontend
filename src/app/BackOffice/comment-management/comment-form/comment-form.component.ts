import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../../interfaces/Comment';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnInit {
  commentForm: FormGroup;
  isEditMode: boolean = false;
  commentId: number | null = null;
  postId: number | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      userId: [1], // Valeur par défaut pour l'admin connecté
      userName: ['Admin'], // Valeur par défaut pour l'admin connecté
      postId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.commentId = +id;
        this.loadComment(+id);
      } else {
        // Get postId from query params if available (for new comment creation)
      this.route.queryParamMap.subscribe(queryParams => {
        const postId = queryParams.get('postId');
        if (postId) {
          this.postId = +postId;
          this.commentForm.patchValue({ postId: this.postId });
        }
      });
      }
    });
  }

  loadComment(id: number): void {
    this.loading = true;
    this.commentService.getCommentById(id).subscribe({
      next: (comment) => {
        if (comment) {
          // Extract IDs from nested objects if they exist
          const postId = comment.blogPost?.postId || comment.postId || null;
          const userId = comment.user?.id || comment.userId;
          
          this.commentForm.patchValue({
            content: comment.content,
            userId: userId,
            userName: comment.userName || (comment.user?.firstName ? (comment.user.firstName + ' ' + comment.user.lastName) : 'Admin'),
            postId: postId
          });
          this.postId = postId;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comment:', err);
        this.error = 'Failed to load comment. Please try again later.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.loading = true;
    const formValues = this.commentForm.value;

    if (this.isEditMode && this.commentId) {
      const content = formValues.content;
      
      // Débogage
      console.log(`[COMPONENT] Tentative de mise à jour du commentaire ID=${this.commentId}`, content);
      
      // Utiliser la méthode directe
      this.commentService.updateCommentDirect(this.commentId, content).subscribe({
        next: (response) => {
          console.log('[COMPONENT] Mise à jour réussie!', response);
          this.router.navigate(['/admin/comments']);
        },
        error: (err) => {
          console.error('[COMPONENT] Erreur lors de la mise à jour:', err);
          this.error = 'Échec de la mise à jour. Veuillez réessayer. Erreur: ' + (err.message || err);
          this.loading = false;
        }
      });
    } else {
      // Mode création
      const newComment = {
        content: formValues.content,
        createdAt: new Date(),
        userId: 1,
        userName: 'Admin',
        postId: formValues.postId || this.postId
      };
      
      // Vérifier que nous avons un postId valide
      if (!newComment.postId) {
        this.error = 'ID d\'article manquant. Impossible de créer le commentaire.';
        this.loading = false;
        return;
      }
      
      console.log('Création d\'un nouveau commentaire:', newComment);
      
      this.commentService.createComment(newComment.postId, newComment as Comment).subscribe({
        next: () => {
          this.router.navigate(['/admin/comments']);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.error = 'Échec de la création. Veuillez réessayer.';
          this.loading = false;
        }
      });
    }
  }
}