import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Get User Profile
export const getUserProfile = createAction(
  '[User] Get User Profile',
  props<{ username: string }>()
);
export const getUserProfileSuccess = createAction(
  '[User] Get User Profile Success',
  props<{ user: User }>()
);
export const getUserProfileFailure = createAction(
  '[User] Get User Profile Failure',
  props<{ error: any }>()
);

// Update User Profile
export const updateUserProfile = createAction(
  '[User] Update User Profile',
  props<{ userData: Partial<User> }>()
);
export const updateUserProfileSuccess = createAction(
  '[User] Update User Profile Success',
  props<{ user: User }>()
);
export const updateUserProfileFailure = createAction(
  '[User] Update User Profile Failure',
  props<{ error: any }>()
);

// Follow User
export const followUser = createAction(
  '[User] Follow User',
  props<{ userId: string; username: string }>()
);
export const followUserSuccess = createAction(
  '[User] Follow User Success',
  props<{ username: string }>()
);
export const followUserFailure = createAction(
  '[User] Follow User Failure',
  props<{ error: any }>()
);

// Unfollow User
export const unfollowUser = createAction(
  '[User] Unfollow User',
  props<{ userId: string; username: string }>()
);
export const unfollowUserSuccess = createAction(
  '[User] Unfollow User Success',
  props<{ username: string }>()
);
export const unfollowUserFailure = createAction(
  '[User] Unfollow User Failure',
  props<{ error: any }>()
);

// Get User Followers
export const getUserFollowers = createAction(
  '[User] Get User Followers',
  props<{ username: string; page: number; size: number }>()
);
export const getUserFollowersSuccess = createAction(
  '[User] Get User Followers Success',
  props<{ followers: User[] }>()
);
export const getUserFollowersFailure = createAction(
  '[User] Get User Followers Failure',
  props<{ error: any }>()
);

// Get User Following
export const getUserFollowing = createAction(
  '[User] Get User Following',
  props<{ username: string; page: number; size: number }>()
);
export const getUserFollowingSuccess = createAction(
  '[User] Get User Following Success',
  props<{ following: User[] }>()
);
export const getUserFollowingFailure = createAction(
  '[User] Get User Following Failure',
  props<{ error: any }>()
);

// Search Users
export const searchUsers = createAction(
  '[User] Search Users',
  props<{ query: string; page: number; size: number }>()
);
export const searchUsersSuccess = createAction(
  '[User] Search Users Success',
  props<{ users: User[] }>()
);
export const searchUsersFailure = createAction(
  '[User] Search Users Failure',
  props<{ error: any }>()
);

// Get Suggested Users
export const getSuggestedUsers = createAction(
  '[User] Get Suggested Users',
  props<{ page: number; size: number }>()
);
export const getSuggestedUsersSuccess = createAction(
  '[User] Get Suggested Users Success',
  props<{ users: User[] }>()
);
export const getSuggestedUsersFailure = createAction(
  '[User] Get Suggested Users Failure',
  props<{ error: any }>()
);
