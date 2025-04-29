import { Component, OnInit } from '@angular/core';
import { BlogPost } from '../../../interfaces/BlogPost';
import { BlogpostService } from '../../../services/blogpost.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: BlogPost[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private blogService: BlogpostService) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = null;
    
    this.blogService.getAllPosts().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.error = 'Failed to load blogs. Please try again later.';
        this.loading = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les articles. Veuillez réessayer plus tard.',
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
        // Show loading
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
            this.blogs = this.blogs.filter(blog => blog.postId !== postId);
            
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