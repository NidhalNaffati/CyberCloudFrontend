import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: BlogPost | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private blogService: BlogpostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBlog(+id);
      }
    });
  }

  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getPostById(id).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blog:', err);
        this.error = 'Failed to load blog. Please try again later.';
        this.loading = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger l\'article. Veuillez réessayer plus tard.',
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

  deleteBlog(postId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cet article ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading indicator
        Swal.fire({
          title: 'Suppression...',
          text: 'Suppression de l\'article en cours',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        this.blogService.deletePost(postId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Article supprimé avec succès.',
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
            console.error('Error deleting blog:', err);
            this.error = 'Failed to delete blog. Please try again later.';
            
            // Close loading dialog
            Swal.close();
            
            // Show error dialog
            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de supprimer l\'article. Veuillez réessayer plus tard.',
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
    });
  }
}