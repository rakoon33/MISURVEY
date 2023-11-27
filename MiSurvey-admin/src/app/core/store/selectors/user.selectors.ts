import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './../states';

// Simple selectors
export const selectUser = (state: UserState) => state.user;
export const selectUserLoading = (state: UserState) => state.loading;
export const selectUserError = (state: UserState) => state.error;

// Feature selector
export const selectUserState = createFeatureSelector<UserState>('user');

// Complex selectors using createSelector
const selectCurrentUser = createSelector(
  selectUserState,
  selectUser
);

const selectIsUserLoading = createSelector(
  selectUserState,
  selectUserLoading
);

const selectIsUserError = createSelector(
  selectUserState,
  selectUserError
);

export default { selectCurrentUser, selectIsUserLoading, selectIsUserError };
