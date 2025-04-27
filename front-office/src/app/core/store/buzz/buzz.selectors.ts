import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BuzzState } from './buzz.reducer';

export const selectBuzzState = createFeatureSelector<BuzzState>('buzz');

export const selectFeed = createSelector(
  selectBuzzState,
  (state) => state.feed
);

export const selectCurrentBuzz = createSelector(
  selectBuzzState,
  (state) => state.currentBuzz
);

export const selectTrendingBuzzs = createSelector(
  selectBuzzState,
  (state) => state.trendingBuzzs
);

export const selectPopularBuzzs = createSelector(
  selectBuzzState,
  (state) => state.popularBuzzs
);

export const selectUnpopularBuzzs = createSelector(
  selectBuzzState,
  (state) => state.unpopularBuzzs
);

export const selectUserBuzzs = createSelector(
  selectBuzzState,
  (state) => state.userBuzzs
);

export const selectBookmarkedBuzzs = createSelector(
  selectBuzzState,
  (state) => state.bookmarkedBuzzs
);

export const selectSearchResults = createSelector(
  selectBuzzState,
  (state) => state.searchResults
);

export const selectComments = createSelector(
  selectBuzzState,
  (state) => state.comments
);

export const selectBuzzLoading = createSelector(
  selectBuzzState,
  (state) => state.loading
);

export const selectBuzzError = createSelector(
  selectBuzzState,
  (state) => state.error
);
