import { createReducer, on } from '@ngrx/store';
import { authActions } from '../actions';

import { AuthState } from '../states';

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.loginRequest, (state) => ({ ...state, loading: true })),
  on(authActions.loginSuccess, (state) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    error: { message: error, timestamp: new Date() },
    loading: false,
  })),
  on(authActions.logoutRequest, (state) => ({ ...state, loading: true })),
  on(authActions.logoutFailure, (state, { error }) => ({
    ...state,
    error: { message: error, timestamp: new Date() },
    loading: false,
  })),
  on(authActions.logoutSuccess, (state) => ({ ...initialAuthState }))
);
