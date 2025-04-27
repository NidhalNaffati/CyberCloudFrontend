import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const reducer = createReducer(
  initialState,
  
  // Check auth status
  on(AuthActions.checkAuthStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.checkAuthStatusSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.checkAuthStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false
  })),
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.logoutSuccess, () => ({
    ...initialState
  })),
  
  // Get current user
  on(AuthActions.getCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.getCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false
  })),
  on(AuthActions.getCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
