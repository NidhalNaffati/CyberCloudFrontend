import { createAction, props } from '@ngrx/store';
import { Buzz, CreateBuzzRequest, TrendingBuzz } from '../../models/buzz.model';
import { Comment, CreateCommentRequest } from '../../models/comment.model';

// Load Feed
export const loadFeed = createAction(
  '[Buzz] Load Feed',
  props<{ page: number; size: number }>()
);
export const loadFeedSuccess = createAction(
  '[Buzz] Load Feed Success',
  props<{ buzzs: Buzz[] }>()
);
export const loadFeedFailure = createAction(
  '[Buzz] Load Feed Failure',
  props<{ error: any }>()
);

// Load Single Buzz
export const loadBuzz = createAction(
  '[Buzz] Load Buzz',
  props<{ id: string }>()
);
export const loadBuzzSuccess = createAction(
  '[Buzz] Load Buzz Success',
  props<{ buzz: Buzz }>()
);
export const loadBuzzFailure = createAction(
  '[Buzz] Load Buzz Failure',
  props<{ error: any }>()
);

// Create Buzz
export const createBuzz = createAction(
  '[Buzz] Create Buzz',
  props<{ buzz: CreateBuzzRequest }>()
);
export const createBuzzSuccess = createAction(
  '[Buzz] Create Buzz Success',
  props<{ buzz: Buzz }>()
);
export const createBuzzFailure = createAction(
  '[Buzz] Create Buzz Failure',
  props<{ error: any }>()
);

// Delete Buzz
export const deleteBuzz = createAction(
  '[Buzz] Delete Buzz',
  props<{ id: string }>()
);
export const deleteBuzzSuccess = createAction(
  '[Buzz] Delete Buzz Success',
  props<{ id: string }>()
);
export const deleteBuzzFailure = createAction(
  '[Buzz] Delete Buzz Failure',
  props<{ error: any }>()
);

// Like Buzz
export const likeBuzz = createAction(
  '[Buzz] Like Buzz',
  props<{ id: string }>()
);
export const likeBuzzSuccess = createAction(
  '[Buzz] Like Buzz Success',
  props<{ id: string }>()
);
export const likeBuzzFailure = createAction(
  '[Buzz] Like Buzz Failure',
  props<{ error: any }>()
);

// Unlike Buzz
export const unlikeBuzz = createAction(
  '[Buzz] Unlike Buzz',
  props<{ id: string }>()
);
export const unlikeBuzzSuccess = createAction(
  '[Buzz] Unlike Buzz Success',
  props<{ id: string }>()
);
export const unlikeBuzzFailure = createAction(
  '[Buzz] Unlike Buzz Failure',
  props<{ error: any }>()
);

// Bookmark Buzz
export const bookmarkBuzz = createAction(
  '[Buzz] Bookmark Buzz',
  props<{ id: string }>()
);
export const bookmarkBuzzSuccess = createAction(
  '[Buzz] Bookmark Buzz Success',
  props<{ id: string }>()
);
export const bookmarkBuzzFailure = createAction(
  '[Buzz] Bookmark Buzz Failure',
  props<{ error: any }>()
);

// Unbookmark Buzz
export const unbookmarkBuzz = createAction(
  '[Buzz] Unbookmark Buzz',
  props<{ id: string }>()
);
export const unbookmarkBuzzSuccess = createAction(
  '[Buzz] Unbookmark Buzz Success',
  props<{ id: string }>()
);
export const unbookmarkBuzzFailure = createAction(
  '[Buzz] Unbookmark Buzz Failure',
  props<{ error: any }>()
);

// Load Trending Buzzs
export const loadTrendingBuzzs = createAction('[Buzz] Load Trending Buzzs');
export const loadTrendingBuzzsSuccess = createAction(
  '[Buzz] Load Trending Buzzs Success',
  props<{ trendingBuzzs: TrendingBuzz[] }>()
);
export const loadTrendingBuzzsFailure = createAction(
  '[Buzz] Load Trending Buzzs Failure',
  props<{ error: any }>()
);

// Load Popular Buzzs
export const loadPopularBuzzs = createAction(
  '[Buzz] Load Popular Buzzs',
  props<{ page: number; size: number }>()
);
export const loadPopularBuzzsSuccess = createAction(
  '[Buzz] Load Popular Buzzs Success',
  props<{ buzzs: Buzz[] }>()
);
export const loadPopularBuzzsFailure = createAction(
  '[Buzz] Load Popular Buzzs Failure',
  props<{ error: any }>()
);

// Load Unpopular Buzzs
export const loadUnpopularBuzzs = createAction(
  '[Buzz] Load Unpopular Buzzs',
  props<{ page: number; size: number }>()
);
export const loadUnpopularBuzzsSuccess = createAction(
  '[Buzz] Load Unpopular Buzzs Success',
  props<{ buzzs: Buzz[] }>()
);
export const loadUnpopularBuzzsFailure = createAction(
  '[Buzz] Load Unpopular Buzzs Failure',
  props<{ error: any }>()
);

// Load User Buzzs
export const loadUserBuzzs = createAction(
  '[Buzz] Load User Buzzs',
  props<{ username: string; page: number; size: number }>()
);
export const loadUserBuzzsSuccess = createAction(
  '[Buzz] Load User Buzzs Success',
  props<{ buzzs: Buzz[] }>()
);
export const loadUserBuzzsFailure = createAction(
  '[Buzz] Load User Buzzs Failure',
  props<{ error: any }>()
);

// Load Bookmarked Buzzs
export const loadBookmarkedBuzzs = createAction(
  '[Buzz] Load Bookmarked Buzzs',
  props<{ page: number; size: number }>()
);
export const loadBookmarkedBuzzsSuccess = createAction(
  '[Buzz] Load Bookmarked Buzzs Success',
  props<{ buzzs: Buzz[] }>()
);
export const loadBookmarkedBuzzsFailure = createAction(
  '[Buzz] Load Bookmarked Buzzs Failure',
  props<{ error: any }>()
);

// Search Buzzs
export const searchBuzzs = createAction(
  '[Buzz] Search Buzzs',
  props<{ query: string; page: number; size: number }>()
);
export const searchBuzzsSuccess = createAction(
  '[Buzz] Search Buzzs Success',
  props<{ buzzs: Buzz[] }>()
);
export const searchBuzzsFailure = createAction(
  '[Buzz] Search Buzzs Failure',
  props<{ error: any }>()
);

// Load Comments
export const loadComments = createAction(
  '[Buzz] Load Comments',
  props<{ buzzId: string; page: number; size: number }>()
);
export const loadCommentsSuccess = createAction(
  '[Buzz] Load Comments Success',
  props<{ comments: Comment[] }>()
);
export const loadCommentsFailure = createAction(
  '[Buzz] Load Comments Failure',
  props<{ error: any }>()
);

// Create Comment
export const createComment = createAction(
  '[Buzz] Create Comment',
  props<{ buzzId: string; comment: CreateCommentRequest }>()
);
export const createCommentSuccess = createAction(
  '[Buzz] Create Comment Success',
  props<{ comment: Comment }>()
);
export const createCommentFailure = createAction(
  '[Buzz] Create Comment Failure',
  props<{ error: any }>()
);

// Delete Comment
export const deleteComment = createAction(
  '[Buzz] Delete Comment',
  props<{ commentId: string }>()
);
export const deleteCommentSuccess = createAction(
  '[Buzz] Delete Comment Success',
  props<{ commentId: string }>()
);
export const deleteCommentFailure = createAction(
  '[Buzz] Delete Comment Failure',
  props<{ error: any }>()
);

// Like Comment
export const likeComment = createAction(
  '[Buzz] Like Comment',
  props<{ commentId: string }>()
);
export const likeCommentSuccess = createAction(
  '[Buzz] Like Comment Success',
  props<{ commentId: string }>()
);
export const likeCommentFailure = createAction(
  '[Buzz] Like Comment Failure',
  props<{ error: any }>()
);

// Unlike Comment
export const unlikeComment = createAction(
  '[Buzz] Unlike Comment',
  props<{ commentId: string }>()
);
export const unlikeCommentSuccess = createAction(
  '[Buzz] Unlike Comment Success',
  props<{ commentId: string }>()
);
export const unlikeCommentFailure = createAction(
  '[Buzz] Unlike Comment Failure',
  props<{ error: any }>()
);

// Dislike Comment
export const dislikeComment = createAction(
  '[Buzz] Dislike Comment',
  props<{ commentId: string }>()
);
export const dislikeCommentSuccess = createAction(
  '[Buzz] Dislike Comment Success',
  props<{ commentId: string }>()
);
export const dislikeCommentFailure = createAction(
  '[Buzz] Dislike Comment Failure',
  props<{ error: any }>()
);
