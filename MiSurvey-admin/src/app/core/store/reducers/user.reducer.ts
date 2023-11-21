import { createReducer, on } from '@ngrx/store';
import { userActions } from '../actions';

import { UserState } from '../states';

export const initialState: UserState = {
  user: null,
  error: null,
  loading: false,
};

export const userReducer = createReducer(
  initialState,
  on(userActions.loginRequest, (state) => ({ ...state, loading: true })),
  on(userActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),
  on(userActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(userActions.logoutRequest, () => initialState)
);
