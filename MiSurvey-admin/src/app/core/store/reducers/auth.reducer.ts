import { createReducer, on } from '@ngrx/store';
import { authActions } from '../actions';

import { AuthState } from '../states';

export const initialAuthState: AuthState = {
  status: 'init', 
  loading: false,
  error: undefined,
};

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.loginRequest, (state) => ({
    ...state,
    status: 'init',
    error: undefined,
  })),
  on(authActions.loginSuccess, (state, { message }) => ({
    ...state,
    status: 'authenticated', 
    message: message,
    loading: true,
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    status: 'unauthenticated', 
    error: error,
    loading: true,
  })),
  
);