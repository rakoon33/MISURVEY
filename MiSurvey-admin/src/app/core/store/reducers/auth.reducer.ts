import { createReducer, on } from '@ngrx/store';
import { authActions } from '../actions';

import { AuthState } from '../states';

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  error: null,
  loading: false,
  message: '',
};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.loginRequest, (state) => ({ ...state, loading: true })),
  on(authActions.loginSuccess, (state, { message }) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
    message: message,
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(authActions.logoutRequest, (state) => ({ ...state, loading: true })),
  on(authActions.logoutFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(authActions.logoutSuccess, state => ({ ...initialAuthState }))

);
