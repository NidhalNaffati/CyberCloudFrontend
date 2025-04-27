import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth/auth.reducer';
import * as fromBuzz from './buzz/buzz.reducer';
import * as fromUser from './user/user.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  buzz: fromBuzz.BuzzState;
  user: fromUser.UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  buzz: fromBuzz.reducer,
  user: fromUser.reducer
};
