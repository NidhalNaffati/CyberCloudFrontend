import { createReducer, on } from '@ngrx/store';
import { Buzz, TrendingBuzz } from '../../models/buzz.model';
import { Comment } from '../../models/comment.model';
import * as BuzzActions from './buzz.actions';

export interface BuzzState {
  feed: Buzz[];
  currentBuzz: Buzz | null;
  trendingBuzzs: TrendingBuzz[];
  popularBuzzs: Buzz[];
  unpopularBuzzs: Buzz[];
  userBuzzs: Buzz[];
  bookmarkedBuzzs: Buzz[];
  searchResults: Buzz[];
  comments: Comment[];
  loading: boolean;
  error: any;
}

export const initialState: BuzzState = {
  feed: [],
  currentBuzz: null,
  trendingBuzzs: [],
  popularBuzzs: [],
  unpopularBuzzs: [],
  userBuzzs: [],
  bookmarkedBuzzs: [],
  searchResults: [],
  comments: [],
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  // Load Feed
  on(BuzzActions.loadFeed, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadFeedSuccess, (state, { buzzs }) => ({
    ...state,
    feed: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadFeedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Single Buzz
  on(BuzzActions.loadBuzz, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadBuzzSuccess, (state, { buzz }) => ({
    ...state,
    currentBuzz: buzz,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadBuzzFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Buzz
  on(BuzzActions.createBuzz, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.createBuzzSuccess, (state, { buzz }) => ({
    ...state,
    feed: [buzz, ...state.feed],
    loading: false,
    error: null
  })),
  on(BuzzActions.createBuzzFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Buzz
  on(BuzzActions.deleteBuzz, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.deleteBuzzSuccess, (state, { id }) => ({
    ...state,
    feed: state.feed.filter(buzz => buzz.id !== id),
    userBuzzs: state.userBuzzs.filter(buzz => buzz.id !== id),
    bookmarkedBuzzs: state.bookmarkedBuzzs.filter(buzz => buzz.id !== id),
    loading: false,
    error: null
  })),
  on(BuzzActions.deleteBuzzFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Like Buzz
  on(BuzzActions.likeBuzzSuccess, (state, { id }) => {
    // Update feed
    const updatedFeed = state.feed.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount : buzz.likeCount + 1,
          likedByCurrentUser: true 
        };
      }
      return buzz;
    });
    
    // Update current buzz if it matches
    let updatedCurrentBuzz = state.currentBuzz;
    if (state.currentBuzz && state.currentBuzz.id === id) {
      updatedCurrentBuzz = { 
        ...state.currentBuzz, 
        likeCount: state.currentBuzz.likedByCurrentUser ? state.currentBuzz.likeCount : state.currentBuzz.likeCount + 1,
        likedByCurrentUser: true 
      };
    }
    
    // Update other lists
    const updatedUserBuzzs = state.userBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount : buzz.likeCount + 1,
          likedByCurrentUser: true 
        };
      }
      return buzz;
    });
    
    const updatedBookmarkedBuzzs = state.bookmarkedBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount : buzz.likeCount + 1,
          likedByCurrentUser: true 
        };
      }
      return buzz;
    });
    
    return {
      ...state,
      feed: updatedFeed,
      currentBuzz: updatedCurrentBuzz,
      userBuzzs: updatedUserBuzzs,
      bookmarkedBuzzs: updatedBookmarkedBuzzs
    };
  }),
  
  // Unlike Buzz
  on(BuzzActions.unlikeBuzzSuccess, (state, { id }) => {
    // Update feed
    const updatedFeed = state.feed.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount - 1 : buzz.likeCount,
          likedByCurrentUser: false 
        };
      }
      return buzz;
    });
    
    // Update current buzz if it matches
    let updatedCurrentBuzz = state.currentBuzz;
    if (state.currentBuzz && state.currentBuzz.id === id) {
      updatedCurrentBuzz = { 
        ...state.currentBuzz, 
        likeCount: state.currentBuzz.likedByCurrentUser ? state.currentBuzz.likeCount - 1 : state.currentBuzz.likeCount,
        likedByCurrentUser: false 
      };
    }
    
    // Update other lists
    const updatedUserBuzzs = state.userBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount - 1 : buzz.likeCount,
          likedByCurrentUser: false 
        };
      }
      return buzz;
    });
    
    const updatedBookmarkedBuzzs = state.bookmarkedBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { 
          ...buzz, 
          likeCount: buzz.likedByCurrentUser ? buzz.likeCount - 1 : buzz.likeCount,
          likedByCurrentUser: false 
        };
      }
      return buzz;
    });
    
    return {
      ...state,
      feed: updatedFeed,
      currentBuzz: updatedCurrentBuzz,
      userBuzzs: updatedUserBuzzs,
      bookmarkedBuzzs: updatedBookmarkedBuzzs
    };
  }),
  
  // Bookmark Buzz
  on(BuzzActions.bookmarkBuzzSuccess, (state, { id }) => {
    // Update feed
    const updatedFeed = state.feed.map(buzz => {
      if (buzz.id === id) {
        return { ...buzz, bookmarkedByCurrentUser: true };
      }
      return buzz;
    });
    
    // Update current buzz if it matches
    let updatedCurrentBuzz = state.currentBuzz;
    if (state.currentBuzz && state.currentBuzz.id === id) {
      updatedCurrentBuzz = { ...state.currentBuzz, bookmarkedByCurrentUser: true };
    }
    
    // Update userBuzzs
    const updatedUserBuzzs = state.userBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { ...buzz, bookmarkedByCurrentUser: true };
      }
      return buzz;
    });
    
    // Add to bookmarked if not already there
    let updatedBookmarkedBuzzs = [...state.bookmarkedBuzzs];
    if (state.currentBuzz && state.currentBuzz.id === id && !state.bookmarkedBuzzs.some(b => b.id === id)) {
      updatedBookmarkedBuzzs = [{ ...state.currentBuzz, bookmarkedByCurrentUser: true }, ...state.bookmarkedBuzzs];
    }
    
    return {
      ...state,
      feed: updatedFeed,
      currentBuzz: updatedCurrentBuzz,
      userBuzzs: updatedUserBuzzs,
      bookmarkedBuzzs: updatedBookmarkedBuzzs
    };
  }),
  
  // Unbookmark Buzz
  on(BuzzActions.unbookmarkBuzzSuccess, (state, { id }) => {
    // Update feed
    const updatedFeed = state.feed.map(buzz => {
      if (buzz.id === id) {
        return { ...buzz, bookmarkedByCurrentUser: false };
      }
      return buzz;
    });
    
    // Update current buzz if it matches
    let updatedCurrentBuzz = state.currentBuzz;
    if (state.currentBuzz && state.currentBuzz.id === id) {
      updatedCurrentBuzz = { ...state.currentBuzz, bookmarkedByCurrentUser: false };
    }
    
    // Update userBuzzs
    const updatedUserBuzzs = state.userBuzzs.map(buzz => {
      if (buzz.id === id) {
        return { ...buzz, bookmarkedByCurrentUser: false };
      }
      return buzz;
    });
    
    // Remove from bookmarked
    const updatedBookmarkedBuzzs = state.bookmarkedBuzzs.filter(buzz => buzz.id !== id);
    
    return {
      ...state,
      feed: updatedFeed,
      currentBuzz: updatedCurrentBuzz,
      userBuzzs: updatedUserBuzzs,
      bookmarkedBuzzs: updatedBookmarkedBuzzs
    };
  }),
  
  // Load Trending Buzzs
  on(BuzzActions.loadTrendingBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadTrendingBuzzsSuccess, (state, { trendingBuzzs }) => ({
    ...state,
    trendingBuzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadTrendingBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Popular Buzzs
  on(BuzzActions.loadPopularBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadPopularBuzzsSuccess, (state, { buzzs }) => ({
    ...state,
    popularBuzzs: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadPopularBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Unpopular Buzzs
  on(BuzzActions.loadUnpopularBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadUnpopularBuzzsSuccess, (state, { buzzs }) => ({
    ...state,
    unpopularBuzzs: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadUnpopularBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load User Buzzs
  on(BuzzActions.loadUserBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadUserBuzzsSuccess, (state, { buzzs }) => ({
    ...state,
    userBuzzs: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadUserBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Bookmarked Buzzs
  on(BuzzActions.loadBookmarkedBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadBookmarkedBuzzsSuccess, (state, { buzzs }) => ({
    ...state,
    bookmarkedBuzzs: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadBookmarkedBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Search Buzzs
  on(BuzzActions.searchBuzzs, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.searchBuzzsSuccess, (state, { buzzs }) => ({
    ...state,
    searchResults: buzzs,
    loading: false,
    error: null
  })),
  on(BuzzActions.searchBuzzsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Comments
  on(BuzzActions.loadComments, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.loadCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    loading: false,
    error: null
  })),
  on(BuzzActions.loadCommentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Comment
  on(BuzzActions.createComment, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.createCommentSuccess, (state, { comment }) => ({
    ...state,
    comments: [comment, ...state.comments],
    loading: false,
    error: null,
    // Update comment count in current buzz if it exists
    currentBuzz: state.currentBuzz 
      ? { ...state.currentBuzz, commentCount: state.currentBuzz.commentCount + 1 } 
      : null
  })),
  on(BuzzActions.createCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Comment
  on(BuzzActions.deleteComment, (state) => ({
    ...state,
    loading: true
  })),
  on(BuzzActions.deleteCommentSuccess, (state, { commentId }) => ({
    ...state,
    comments: state.comments.filter(comment => comment.id !== commentId),
    loading: false,
    error: null,
    // Update comment count in current buzz if it exists
    currentBuzz: state.currentBuzz 
      ? { ...state.currentBuzz, commentCount: state.currentBuzz.commentCount - 1 } 
      : null
  })),
  on(BuzzActions.deleteCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Like Comment
  on(BuzzActions.likeCommentSuccess, (state, { commentId }) => {
    const updatedComments = state.comments.map(comment => {
      if (comment.id === commentId) {
        const likeCount = comment.likedByCurrentUser ? comment.likeCount : comment.likeCount + 1;
        const dislikeCount = comment.dislikedByCurrentUser ? comment.dislikeCount - 1 : comment.dislikeCount;
        
        return { 
          ...comment, 
          likeCount,
          dislikeCount,
          likedByCurrentUser: true,
          dislikedByCurrentUser: false 
        };
      }
      return comment;
    });
    
    return {
      ...state,
      comments: updatedComments
    };
  }),
  
  // Unlike Comment
  on(BuzzActions.unlikeCommentSuccess, (state, { commentId }) => {
    const updatedComments = state.comments.map(comment => {
      if (comment.id === commentId) {
        return { 
          ...comment, 
          likeCount: comment.likedByCurrentUser ? comment.likeCount - 1 : comment.likeCount,
          likedByCurrentUser: false 
        };
      }
      return comment;
    });
    
    return {
      ...state,
      comments: updatedComments
    };
  }),
  
  // Dislike Comment
  on(BuzzActions.dislikeCommentSuccess, (state, { commentId }) => {
    const updatedComments = state.comments.map(comment => {
      if (comment.id === commentId) {
        const dislikeCount = comment.dislikedByCurrentUser ? comment.dislikeCount : comment.dislikeCount + 1;
        const likeCount = comment.likedByCurrentUser ? comment.likeCount - 1 : comment.likeCount;
        
        return { 
          ...comment, 
          dislikeCount,
          likeCount,
          dislikedByCurrentUser: true,
          likedByCurrentUser: false 
        };
      }
      return comment;
    });
    
    return {
      ...state,
      comments: updatedComments
    };
  })
);
