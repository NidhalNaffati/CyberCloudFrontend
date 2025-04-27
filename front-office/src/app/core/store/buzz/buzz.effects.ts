import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BuzzService } from '../../services/buzz.service';
import { CommentService } from '../../services/comment.service';
import { Buzz } from '../../models/buzz.model';
import * as BuzzActions from './buzz.actions';

@Injectable()
export class BuzzEffects {
  constructor(
    private actions$: Actions,
    private buzzService: BuzzService,
    private commentService: CommentService,
    private snackBar: MatSnackBar
  ) {}

  // Load Feed
  loadFeed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadFeed),
      switchMap(({ page, size }) => {
        return this.buzzService.getFeed(page, size).pipe(
          map((buzzs) => BuzzActions.loadFeedSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.loadFeedFailure({ error })))
        );
      })
    );
  });

  // Load Single Buzz
  loadBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadBuzz),
      switchMap(({ id }) => {
        return this.buzzService.getBuzzById(id).pipe(
          map((buzz) => BuzzActions.loadBuzzSuccess({ buzz })),
          catchError((error) => of(BuzzActions.loadBuzzFailure({ error })))
        );
      })
    );
  });

  // Create Buzz
  createBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.createBuzz),
      switchMap(({ buzz }) => {
        return this.buzzService.createBuzz(buzz).pipe(
          map((createdBuzz) => BuzzActions.createBuzzSuccess({ buzz: createdBuzz })),
          catchError((error) => of(BuzzActions.createBuzzFailure({ error })))
        );
      })
    );
  });

  createBuzzSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.createBuzzSuccess),
      tap(() => {
        this.snackBar.open('Buzz created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  createBuzzFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.createBuzzFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error || 'Failed to create buzz. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      })
    );
  }, { dispatch: false });

  // Delete Buzz
  deleteBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.deleteBuzz),
      switchMap(({ id }) => {
        return this.buzzService.deleteBuzz(id).pipe(
          map(() => BuzzActions.deleteBuzzSuccess({ id })),
          catchError((error) => of(BuzzActions.deleteBuzzFailure({ error })))
        );
      })
    );
  });

  deleteBuzzSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.deleteBuzzSuccess),
      tap(() => {
        this.snackBar.open('Buzz deleted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  // Like Buzz
  likeBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.likeBuzz),
      switchMap(({ id }) => {
        return this.buzzService.likeBuzz(id).pipe(
          map(() => BuzzActions.likeBuzzSuccess({ id })),
          catchError((error) => of(BuzzActions.likeBuzzFailure({ error })))
        );
      })
    );
  });

  // Unlike Buzz
  unlikeBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.unlikeBuzz),
      switchMap(({ id }) => {
        return this.buzzService.unlikeBuzz(id).pipe(
          map(() => BuzzActions.unlikeBuzzSuccess({ id })),
          catchError((error) => of(BuzzActions.unlikeBuzzFailure({ error })))
        );
      })
    );
  });

  // Bookmark Buzz
  bookmarkBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.bookmarkBuzz),
      switchMap(({ id }) => {
        return this.buzzService.bookmarkBuzz(id).pipe(
          map(() => BuzzActions.bookmarkBuzzSuccess({ id })),
          catchError((error) => of(BuzzActions.bookmarkBuzzFailure({ error })))
        );
      })
    );
  });

  // Unbookmark Buzz
  unbookmarkBuzz$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.unbookmarkBuzz),
      switchMap(({ id }) => {
        return this.buzzService.unbookmarkBuzz(id).pipe(
          map(() => BuzzActions.unbookmarkBuzzSuccess({ id })),
          catchError((error) => of(BuzzActions.unbookmarkBuzzFailure({ error })))
        );
      })
    );
  });

  // Load Trending Buzzs
  loadTrendingBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadTrendingBuzzs),
      switchMap(() => {
        return this.buzzService.getTrendingBuzzs().pipe(
          map((trendingBuzzs) => BuzzActions.loadTrendingBuzzsSuccess({ trendingBuzzs })),
          catchError((error) => of(BuzzActions.loadTrendingBuzzsFailure({ error })))
        );
      })
    );
  });

  // Load Popular Buzzs
  loadPopularBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadPopularBuzzs),
      switchMap(({ page, size }) => {
        return this.buzzService.getPopularBuzzs(page, size).pipe(
          map((buzzs) => BuzzActions.loadPopularBuzzsSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.loadPopularBuzzsFailure({ error })))
        );
      })
    );
  });

  // Load Unpopular Buzzs
  loadUnpopularBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadUnpopularBuzzs),
      switchMap(({ page, size }) => {
        return this.buzzService.getUnpopularBuzzs(page, size).pipe(
          map((buzzs: Buzz[]) => BuzzActions.loadUnpopularBuzzsSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.loadUnpopularBuzzsFailure({ error })))
        );
      })
    );
  });

  // Load User Buzzs
  loadUserBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadUserBuzzs),
      switchMap(({ username, page, size }) => {
        return this.buzzService.getUserBuzzs(username, page, size).pipe(
          map((buzzs) => BuzzActions.loadUserBuzzsSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.loadUserBuzzsFailure({ error })))
        );
      })
    );
  });

  // Load Bookmarked Buzzs
  loadBookmarkedBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadBookmarkedBuzzs),
      switchMap(({ page, size }) => {
        return this.buzzService.getBookmarkedBuzzs(page, size).pipe(
          map((buzzs) => BuzzActions.loadBookmarkedBuzzsSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.loadBookmarkedBuzzsFailure({ error })))
        );
      })
    );
  });

  // Search Buzzs
  searchBuzzs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.searchBuzzs),
      switchMap(({ query, page, size }) => {
        return this.buzzService.searchBuzzs(query, page, size).pipe(
          map((buzzs) => BuzzActions.searchBuzzsSuccess({ buzzs })),
          catchError((error) => of(BuzzActions.searchBuzzsFailure({ error })))
        );
      })
    );
  });

  // Load Comments
  loadComments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.loadComments),
      switchMap(({ buzzId, page, size }) => {
        return this.commentService.getComments(buzzId, page, size).pipe(
          map((comments) => BuzzActions.loadCommentsSuccess({ comments })),
          catchError((error) => of(BuzzActions.loadCommentsFailure({ error })))
        );
      })
    );
  });

  // Create Comment
  createComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.createComment),
      switchMap(({ buzzId, comment }) => {
        return this.commentService.createComment(buzzId, comment).pipe(
          map((createdComment) => BuzzActions.createCommentSuccess({ comment: createdComment })),
          catchError((error) => of(BuzzActions.createCommentFailure({ error })))
        );
      })
    );
  });

  createCommentSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.createCommentSuccess),
      tap(() => {
        this.snackBar.open('Comment added successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  // Delete Comment
  deleteComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.deleteComment),
      switchMap(({ commentId }) => {
        return this.commentService.deleteComment(commentId).pipe(
          map(() => BuzzActions.deleteCommentSuccess({ commentId })),
          catchError((error) => of(BuzzActions.deleteCommentFailure({ error })))
        );
      })
    );
  });

  // Like Comment
  likeComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.likeComment),
      switchMap(({ commentId }) => {
        return this.commentService.likeComment(commentId).pipe(
          map(() => BuzzActions.likeCommentSuccess({ commentId })),
          catchError((error) => of(BuzzActions.likeCommentFailure({ error })))
        );
      })
    );
  });

  // Unlike Comment
  unlikeComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.unlikeComment),
      switchMap(({ commentId }) => {
        return this.commentService.unlikeComment(commentId).pipe(
          map(() => BuzzActions.unlikeCommentSuccess({ commentId })),
          catchError((error) => of(BuzzActions.unlikeCommentFailure({ error })))
        );
      })
    );
  });

  // Dislike Comment
  dislikeComment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BuzzActions.dislikeComment),
      switchMap(({ commentId }) => {
        return this.commentService.dislikeComment(commentId).pipe(
          map(() => BuzzActions.dislikeCommentSuccess({ commentId })),
          catchError((error) => of(BuzzActions.dislikeCommentFailure({ error })))
        );
      })
    );
  });
}
