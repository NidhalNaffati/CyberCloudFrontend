import { createAction, props } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../models/user.model';

// Check auth status
export const checkAuthStatus = createAction('[Auth] Check Auth Status');
export const checkAuthStatusSuccess = createAction(
  '[Auth] Check Auth Status Success',
  props<{ user: User }>()
);
export const checkAuthStatusFailure = createAction(
  '[Auth] Check Auth Status Failure',
  props<{ error: any }>()
);

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterRequest }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ response: AuthResponse }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// Get current user
export const getCurrentUser = createAction('[Auth] Get Current User');
export const getCurrentUserSuccess = createAction(
  '[Auth] Get Current User Success',
  props<{ user: User }>()
);
export const getCurrentUserFailure = createAction(
  '[Auth] Get Current User Failure',
  props<{ error: any }>()
);
