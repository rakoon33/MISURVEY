import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../states';

export const selectAuthStatus = (state: AuthState) => state.status;
export const selectAuthLoading = (state: AuthState) => state.loading;
export const selectAuthError = (state: AuthState) => state.error;

export const selectAuthState = createFeatureSelector<AuthState>('auth');

const selectCurrentAuth = createSelector(
  selectAuthState,
  selectAuthStatus
);

const selectIsAuthLoading = createSelector(
  selectAuthState,
  selectAuthLoading
);

const selectIsAuthError = createSelector(
  selectAuthState,
  selectAuthError
);

export default {selectCurrentAuth,selectIsAuthLoading, selectIsAuthError };