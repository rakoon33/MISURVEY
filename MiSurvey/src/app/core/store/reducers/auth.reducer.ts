import { createReducer, on } from '@ngrx/store';
import { authActions } from '../actions';

import { AuthState } from '../states';

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  loading: false,
};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.loginRequest, (state) => ({ ...state, loading: true })),
  on(authActions.loginSuccess, (state) => ({
    ...state,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(authActions.loginFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(authActions.logoutRequest, (state) => ({ ...state, loading: true })),
  on(authActions.logoutFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(authActions.logoutSuccess, (state) => ({ ...initialAuthState }))
);
