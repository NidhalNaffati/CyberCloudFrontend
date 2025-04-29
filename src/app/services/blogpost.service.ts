import { Injectable } from '@angular/core';
import { BlogPost, BlogComment, Reaction, Image } from '../interfaces/BlogPost';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BadWordsFilterService } from './bad-words-filter.service';
import { ImageService } from './image.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogpostService {

  private apiUrl = `${environment.apiUrl}/blogposts`
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private badWordsFilter: BadWordsFilterService,
    private imageService: ImageService
  ) {}
   id_user = this.authService.getUserId();
 
  getAllPosts(): Observable<BlogPost[]> {
   const  token = localStorage.getItem('access_token');

   const  headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
    return this.http.get<BlogPost[]>(`${this.apiUrl}/all`, { headers });
  }

  getPostById(id: number): Observable<BlogPost> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<BlogPost>(`${this.apiUrl}/get/${id}`, { headers });
  }

  createPost(post: BlogPost): Observable<BlogPost> {
    if (!this.badWordsFilter.validateContent(post.title) || !this.badWordsFilter.validateContent(post.content)) {
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    
    const imagesToUpload = post.images || [];
    const postWithoutImages = { ...post };
    delete postWithoutImages.images;
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    return this.http.post<BlogPost>(`${this.apiUrl}/add/${this.id_user}`, postWithoutImages,{ headers }).pipe(
      switchMap(createdPost => {
        if (imagesToUpload.length === 0) {
          return new Observable<BlogPost>(observer => observer.next(createdPost));
        }
        
        const imageUploads = imagesToUpload.map((image: any, index: number) => {
          if (image.file instanceof File) {
            return this.imageService.uploadImage(
              createdPost.postId,
              image.file,
              image.description || '',
              index
            );
          } else if (image.url && image.url.startsWith('data:')) {
            const byteString = atob(image.url.split(',')[1]);
            const mimeString = image.url.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], `image-${index}.${mimeString.split('/')[1]}`, { type: mimeString });
            
            return this.imageService.uploadImage(
              createdPost.postId,
              file,
              image.description || '',
              index
            );
          }
          return new Observable<Image>(observer => observer.next(image as Image));
        });
        
        return forkJoin(imageUploads).pipe(
          map(uploadedImages => {
            createdPost.images = uploadedImages;
            return createdPost;
          })
        );
      })
    );
  }

  updatePost(id: number, post: BlogPost): Observable<BlogPost> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    if (!this.badWordsFilter.validateContent(post.title) || !this.badWordsFilter.validateContent(post.content)) {
      return new Observable(observer => {
        observer.error(new Error('Contenu inapproprié détecté'));
      });
    }
    
    const imagesToUpload = post.images || [];
    const postWithoutImages = { ...post };
    delete postWithoutImages.images;
    
    return this.http.put<BlogPost>(`${this.apiUrl}/update/${id}`, postWithoutImages,{headers}).pipe(
      switchMap(updatedPost => {
        return this.imageService.deleteImagesByPostId(updatedPost.postId).pipe(
          switchMap(() => {
            if (imagesToUpload.length === 0) {
              return new Observable<BlogPost>(observer => observer.next(updatedPost));
            }
            
            const imageUploads = imagesToUpload.map((image: any, index: number) => {
              if (image.file instanceof File) {
                return this.imageService.uploadImage(
                  updatedPost.postId,
                  image.file,
                  image.description || '',
                  index
                );
              } else if (image.url && image.url.startsWith('data:')) {
                const byteString = atob(image.url.split(',')[1]);
                const mimeString = image.url.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const file = new File([blob], `image-${index}.${mimeString.split('/')[1]}`, { type: mimeString });
                
                return this.imageService.uploadImage(
                  updatedPost.postId,
                  file,
                  image.description || '',
                  index
                );
              }
              return new Observable<Image>(observer => observer.next(image as Image));
            });
            
            return forkJoin(imageUploads).pipe(
              map(uploadedImages => {
                updatedPost.images = uploadedImages;
                return updatedPost;
              })
            );
          })
        );
      })
    );
  }

  deletePost(id: number): Observable<void> {
    const  token = localStorage.getItem('access_token');

    const  headers = new HttpHeaders({
     'Authorization': `Bearer ${token}`
   });
    return this.imageService.deleteImagesByPostId(id).pipe(
      switchMap(() => {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`,{headers});
      })
    );
  }
  
  getCommentsCount(postId: number): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.apiUrl}/${postId}/comments/count`);
  }

  
  reactToPost(postId: number, reaction: Reaction | null): Observable<BlogPost> {
    const reactionValue = reaction ? reaction.toString() : null;
    return this.http.put<BlogPost>(`${this.apiUrl}/${postId}/reaction`, { reaction: reactionValue });
  }

  updateReaction(postId: number, oldReaction: Reaction, newReaction: Reaction | null): Observable<BlogPost> {
    const oldReactionValue = oldReaction ? oldReaction.toString() : null;
    const newReactionValue = newReaction ? newReaction.toString() : null;
    return this.http.put<BlogPost>(`${this.apiUrl}/${postId}/update-reaction`, { oldReaction: oldReactionValue, newReaction: newReactionValue });
  }
}
