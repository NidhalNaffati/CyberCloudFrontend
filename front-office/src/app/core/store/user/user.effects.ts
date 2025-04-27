import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';
import * as AuthActions from '../auth/auth.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  // Get User Profile
  getUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserProfile),
      switchMap(({ username }) => {
        return this.userService.getUserByUsername(username).pipe(
          map((user) => UserActions.getUserProfileSuccess({ user })),
          catchError((error) => of(UserActions.getUserProfileFailure({ error })))
        );
      })
    );
  });

  // Update User Profile
  updateUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUserProfile),
      switchMap(({ userData }) => {
        return this.userService.updateProfile(userData).pipe(
          map((user) => UserActions.updateUserProfileSuccess({ user })),
          catchError((error) => of(UserActions.updateUserProfileFailure({ error })))
        );
      })
    );
  });

  updateUserProfileSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUserProfileSuccess),
      map(({ user }) => {
        this.router.navigate(['/profile', user.username]);
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        
        // Update the current user in auth state
        return AuthActions.getCurrentUserSuccess({ user });
      })
    );
  });

  updateUserProfileFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateUserProfileFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error || 'Failed to update profile. Please try again.',
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

  // Follow User
  followUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.followUser),
      switchMap(({ userId, username }) => {
        return this.userService.followUser(userId).pipe(
          map(() => UserActions.followUserSuccess({ username })),
          catchError((error) => {
            if (error.status === 404) {
              this.snackBar.open('User not found', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
              });
            }
            return of(UserActions.followUserFailure({ error }));
          })
        );
      })
    );
  });

  followUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.followUserSuccess),
      tap(() => {
        this.snackBar.open('User followed successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      })
    );
  }, { dispatch: false });

  followUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.followUserFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error?.error || 'Failed to follow user',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      })
    );
  }, { dispatch: false });

  // Unfollow User
  unfollowUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.unfollowUser),
      switchMap(({ userId, username }) => {
        return this.userService.unfollowUser(userId).pipe(
          map(() => UserActions.unfollowUserSuccess({ username })),
          catchError((error) => {
            // For user not found, update UI state
            if (error.status === 404) {
              return of(UserActions.unfollowUserSuccess({ username }));
            }
            return of(UserActions.unfollowUserFailure({ error }));
          })
        );
      })
    );
  });

  unfollowUserSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.unfollowUserSuccess),
      tap(() => {
        // Don't show a notification for automatic state updates
      })
    );
  }, { dispatch: false });

  unfollowUserFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.unfollowUserFailure),
      tap(({ error }) => {
        this.snackBar.open(
          error.error?.error || 'Failed to unfollow user',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          }
        );
      })
    );
  }, { dispatch: false });

  // Get User Followers
  getUserFollowers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserFollowers),
      switchMap(({ username, page, size }) => {
        return this.userService.getUserFollowers(username, page, size).pipe(
          map((followers) => UserActions.getUserFollowersSuccess({ followers })),
          catchError((error) => of(UserActions.getUserFollowersFailure({ error })))
        );
      })
    );
  });

  // Get User Following
  getUserFollowing$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserFollowing),
      switchMap(({ username, page, size }) => {
        return this.userService.getUserFollowing(username, page, size).pipe(
          map((following) => UserActions.getUserFollowingSuccess({ following })),
          catchError((error) => of(UserActions.getUserFollowingFailure({ error })))
        );
      })
    );
  });

  // Search Users
  searchUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.searchUsers),
      switchMap(({ query, page, size }) => {
        return this.userService.searchUsers(query, page, size).pipe(
          map((users) => UserActions.searchUsersSuccess({ users })),
          catchError((error) => of(UserActions.searchUsersFailure({ error })))
        );
      })
    );
  });

  // Get Suggested Users
  getSuggestedUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getSuggestedUsers),
      switchMap(({ page, size }) => {
        return this.userService.getSuggestedUsers(page, size).pipe(
          map((users) => UserActions.getSuggestedUsersSuccess({ users })),
          catchError((error) => of(UserActions.getSuggestedUsersFailure({ error })))
        );
      })
    );
  });
}
