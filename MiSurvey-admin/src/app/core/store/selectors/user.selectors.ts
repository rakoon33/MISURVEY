import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../states';

export const selectUser = (state: UserState) => state.user;
export const selectUserLoading = (state: UserState) => state.loading;
export const selectUserError = (state: UserState) => state.error;

// Assuming you have a feature selector for 'auth'
export const selectAuthState = createFeatureSelector<UserState>('auth');

const selectCurrentUser = createSelector(
  selectAuthState,
  selectUser
);

const selectIsUserLoading = createSelector(
  selectAuthState,
  selectUserLoading
);

const selectAuthError = createSelector(
  selectAuthState,
  selectUserError
);

export default {selectCurrentUser,selectIsUserLoading, selectAuthError };