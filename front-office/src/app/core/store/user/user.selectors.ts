import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { User } from '../../models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentProfile = createSelector(
  selectUserState,
  (state) => state.currentProfile
);

export const selectFollowers = createSelector(
  selectUserState,
  (state) => state.followers
);

export const selectFollowing = createSelector(
  selectUserState,
  (state) => state.following
);

export const selectSuggestedUsers = createSelector(
  selectUserState,
  (state) => state.suggestedUsers
);

export const selectUserSearchResults = createSelector(
  selectUserState,
  (state) => state.searchResults
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectIsProfileOwner = createSelector(
  selectCurrentProfile,
  (profile: User | null, props: { username: string }) => {
    return profile?.username === props.username;
  }
);
