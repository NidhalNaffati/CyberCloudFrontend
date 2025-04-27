import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as UserActions from './user.actions';

export interface UserState {
  currentProfile: User | null;
  followers: User[];
  following: User[];
  suggestedUsers: User[];
  searchResults: User[];
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  currentProfile: null,
  followers: [],
  following: [],
  suggestedUsers: [],
  searchResults: [],
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  // Get User Profile
  on(UserActions.getUserProfile, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.getUserProfileSuccess, (state, { user }) => ({
    ...state,
    currentProfile: user,
    loading: false,
    error: null
  })),
  on(UserActions.getUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update User Profile
  on(UserActions.updateUserProfile, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.updateUserProfileSuccess, (state, { user }) => ({
    ...state,
    currentProfile: user,
    loading: false,
    error: null
  })),
  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Follow User
  on(UserActions.followUser, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.followUserSuccess, (state, { username }) => {
    // Update current profile if it's the user that was followed
    let updatedProfile = state.currentProfile;
    if (state.currentProfile && state.currentProfile.username === username) {
      updatedProfile = {
        ...state.currentProfile,
        isFollowed: true,
        followersCount: state.currentProfile.followersCount + 1
      };
    }
    
    // Update in search results
    const updatedSearchResults = state.searchResults.map(user => {
      if (user.username === username) {
        return {
          ...user,
          isFollowed: true,
          followersCount: user.followersCount + 1
        };
      }
      return user;
    });
    
    // Update in suggested users
    const updatedSuggestedUsers = state.suggestedUsers.map(user => {
      if (user.username === username) {
        return {
          ...user,
          isFollowed: true,
          followersCount: user.followersCount + 1
        };
      }
      return user;
    });
    
    return {
      ...state,
      currentProfile: updatedProfile,
      searchResults: updatedSearchResults,
      suggestedUsers: updatedSuggestedUsers,
      loading: false,
      error: null
    };
  }),
  on(UserActions.followUserFailure, (state, { error }) => {
    // Revert any optimistic updates if needed
    const revertedSearchResults = state.searchResults.map(user => {
      if (user.isFollowed === true && error.error?.username === user.username) {
        return { ...user, isFollowed: false };
      }
      return user;
    });

    const revertedSuggestedUsers = state.suggestedUsers.map(user => {
      if (user.isFollowed === true && error.error?.username === user.username) {
        return { ...user, isFollowed: false };
      }
      return user;
    });

    return {
      ...state,
      searchResults: revertedSearchResults,
      suggestedUsers: revertedSuggestedUsers,
      loading: false,
      error
    };
  }),
  
  // Unfollow User
  on(UserActions.unfollowUser, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.unfollowUserSuccess, (state, { username }) => {
    // Update current profile if it's the user that was unfollowed
    let updatedProfile = state.currentProfile;
    if (state.currentProfile && state.currentProfile.username === username) {
      updatedProfile = {
        ...state.currentProfile,
        isFollowed: false,
        followersCount: Math.max(0, state.currentProfile.followersCount - 1)
      };
    }
    
    // Update in search results
    const updatedSearchResults = state.searchResults.map(user => {
      if (user.username === username) {
        return {
          ...user,
          isFollowed: false,
          followersCount: Math.max(0, user.followersCount - 1)
        };
      }
      return user;
    });
    
    // Update in suggested users
    const updatedSuggestedUsers = state.suggestedUsers.map(user => {
      if (user.username === username) {
        return {
          ...user,
          isFollowed: false,
          followersCount: Math.max(0, user.followersCount - 1)
        };
      }
      return user;
    });
    
    return {
      ...state,
      currentProfile: updatedProfile,
      searchResults: updatedSearchResults,
      suggestedUsers: updatedSuggestedUsers,
      loading: false,
      error: null
    };
  }),
  on(UserActions.unfollowUserFailure, (state, { error }) => {
    // Revert any optimistic updates if needed
    const revertedSearchResults = state.searchResults.map(user => {
      if (user.isFollowed === false && error.error?.username === user.username) {
        return { ...user, isFollowed: true };
      }
      return user;
    });

    const revertedSuggestedUsers = state.suggestedUsers.map(user => {
      if (user.isFollowed === false && error.error?.username === user.username) {
        return { ...user, isFollowed: true };
      }
      return user;
    });

    return {
      ...state,
      searchResults: revertedSearchResults,
      suggestedUsers: revertedSuggestedUsers,
      loading: false,
      error
    };
  }),
  
  // Get User Followers
  on(UserActions.getUserFollowers, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.getUserFollowersSuccess, (state, { followers }) => ({
    ...state,
    followers,
    loading: false,
    error: null
  })),
  on(UserActions.getUserFollowersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get User Following
  on(UserActions.getUserFollowing, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.getUserFollowingSuccess, (state, { following }) => ({
    ...state,
    following,
    loading: false,
    error: null
  })),
  on(UserActions.getUserFollowingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Search Users
  on(UserActions.searchUsers, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.searchUsersSuccess, (state, { users }) => ({
    ...state,
    searchResults: users,
    loading: false,
    error: null
  })),
  on(UserActions.searchUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Get Suggested Users
  on(UserActions.getSuggestedUsers, (state) => ({
    ...state,
    loading: true
  })),
  on(UserActions.getSuggestedUsersSuccess, (state, { users }) => ({
    ...state,
    suggestedUsers: users,
    loading: false,
    error: null
  })),
  on(UserActions.getSuggestedUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
