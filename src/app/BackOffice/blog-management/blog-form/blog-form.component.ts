import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost, Reaction } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode: boolean = false;
  postId: number | null = null;
  loading: boolean = false;
  error: string | null = null;
  
  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount'
  };

  constructor(
    private fb: FormBuilder,
    private blogService: BlogpostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      userId: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.postId = +id;
        this.loadBlog(this.postId);
      }
    });

  }

  loadBlog(id: number): void {
    this.loading = true;
    this.error = null;
    
    console.log(`Chargement du blog avec ID: ${id}`);
    
    this.blogService.getPostById(id).subscribe({
      next: (blog) => {
        console.log('Blog récupéré avec succès:', blog);
        
        if (!blog) {
          this.error = 'Article non trouvé';
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Article non trouvé',
            confirmButtonText: 'OK',
            didClose: () => {
              document.body.classList.remove('modal-open');
              const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              while (modalBackdrops.length > 0) {
                modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
              }
            }
          });
          return;
        }
        
        // Remplir le formulaire avec les données récupérées
        this.blogForm.patchValue({
          title: blog.title || '',
          content: blog.content || '',
          userId: blog.userId || null
        });
        
        console.log('Formulaire mis à jour:', this.blogForm.value);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'article:', err);
        this.error = 'Échec du chargement de l\'article. Veuillez réessayer plus tard.';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec du chargement de l\'article. Veuillez réessayer plus tard.',
          confirmButtonText: 'OK',
          didClose: () => {
            document.body.classList.remove('modal-open');
            const modalBackdrops = document.getElementsByClassName('modal-backdrop');
            while (modalBackdrops.length > 0) {
              modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
            }
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      // Mettre en évidence les erreurs de validation
      Object.keys(this.blogForm.controls).forEach(key => {
        const control = this.blogForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonText: 'OK',
        didClose: () => {
          document.body.classList.remove('modal-open');
          const modalBackdrops = document.getElementsByClassName('modal-backdrop');
          while (modalBackdrops.length > 0) {
            modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
          }
        }
      });
      
      return;
    }

    this.loading = true;
    this.error = null;
    
    const formValues = this.blogForm.value;
    console.log('Valeurs du formulaire:', formValues);
    
    // Préparer l'objet à envoyer
    const blog: BlogPost = {
      postId: this.isEditMode ? this.postId! : 0,
      title: formValues.title,
      content: formValues.content,
      userId: formValues.userId || 1, // Utiliser l'ID utilisateur connecté si non spécifié
      createdAt: new Date(),
      reaction: Reaction.LIKE, // Réaction par défaut
      user: {
        firstName: 'Admin',
        lastName: 'User',
        id: formValues.userId || 1
      }
    };
    
    console.log('Objet blog à envoyer:', blog);

    // Show loading dialog
    Swal.fire({
      title: 'Traitement en cours...',
      text: 'Veuillez patienter pendant l\'enregistrement',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.isEditMode && this.postId) {
      console.log(`Mise à jour de l'article avec ID: ${this.postId}`);
      this.blogService.updatePost(this.postId, blog).subscribe({
        next: (response) => {
          console.log('Article mis à jour avec succès:', response);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Article mis à jour avec succès.',
            confirmButtonText: 'OK',
            didClose: () => {
              document.body.classList.remove('modal-open');
              const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              while (modalBackdrops.length > 0) {
                modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
              }
              this.router.navigate(['/admin/blogs']);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de l\'article:', err);
          this.error = 'Échec de la mise à jour de l\'article. Veuillez réessayer plus tard.';
          this.loading = false;
          
          // Close loading dialog first
          Swal.close();
          
          // Show error dialog
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Échec de la mise à jour de l\'article. Veuillez réessayer plus tard.',
              confirmButtonText: 'OK',
              didClose: () => {
                document.body.classList.remove('modal-open');
                const modalBackdrops = document.getElementsByClassName('modal-backdrop');
                while (modalBackdrops.length > 0) {
                  modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
                }
              }
            });
          }, 100);
        }
      });
    } else {
      console.log('Création d\'un nouvel article');
      this.blogService.createPost(blog).subscribe({
        next: (response) => {
          console.log('Article créé avec succès:', response);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Article créé avec succès.',
            confirmButtonText: 'OK',
            didClose: () => {
              document.body.classList.remove('modal-open');
              const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              while (modalBackdrops.length > 0) {
                modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
              }
              this.router.navigate(['/admin/blogs']);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la création de l\'article:', err);
          this.error = 'Échec de la création de l\'article. Veuillez réessayer plus tard.';
          this.loading = false;
          
          // Close loading dialog first
          Swal.close();
          
          // Show error dialog
          setTimeout(() => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Échec de la création de l\'article. Veuillez réessayer plus tard.',
              confirmButtonText: 'OK',
              didClose: () => {
                document.body.classList.remove('modal-open');
                const modalBackdrops = document.getElementsByClassName('modal-backdrop');
                while (modalBackdrops.length > 0) {
                  modalBackdrops[0].parentNode?.removeChild(modalBackdrops[0]);
                }
              }
            });
          }, 100);
        }
      });
    }
  }
}