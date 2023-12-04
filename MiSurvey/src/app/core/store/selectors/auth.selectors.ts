import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../states';

export const selectAuthStatus = (state: AuthState) => state.isAuthenticated;
export const selectAuthLoading = (state: AuthState) => state.loading;

export const selectAuthState = createFeatureSelector<AuthState>('feature_auth');

const selectCurrentAuth = createSelector(
  selectAuthState,
  selectAuthStatus
);

const selectIsAuthLoading = createSelector(
  selectAuthState,
  selectAuthLoading
);

export default {selectCurrentAuth,selectIsAuthLoading };