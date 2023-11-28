import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserManagementState } from '../states';

export const selectUserManagementState = createFeatureSelector<UserManagementState>('feature_user_management');

const selectAllUsers = createSelector(
  selectUserManagementState,
  (state: UserManagementState) => state.users
);

const selectUserManagementLoading = createSelector(
  selectUserManagementState,
  (state: UserManagementState) => state.loading
);

export default { selectAllUsers, selectUserManagementLoading };