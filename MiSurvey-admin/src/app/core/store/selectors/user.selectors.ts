import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

const selectCurrentUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export default {selectCurrentUser, selectUserLoading, selectUserError };