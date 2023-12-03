import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserManagementState } from '../states';

export const selectAllUsers = (state: UserManagementState) => state.users;
export const selectUserManagementLoading = (state: UserManagementState) => state.loading;
export const selectSelectedUser = (state: UserManagementState) => state.selectedUser;
export const selectUseManagementError = (state: UserManagementState) => state.error;

export const selectUserManagementState = createFeatureSelector<UserManagementState>('feature_user_management');

const selectCurrentUsers = createSelector(
  selectUserManagementState,
  selectAllUsers
);

const selectIsUserManagementLoading = createSelector(
  selectUserManagementState,
  selectUserManagementLoading
);

const selectCurrentUser = createSelector(
  selectUserManagementState,
  selectSelectedUser
);

const selectCurrentUseManagementError = createSelector(
  selectUserManagementState,
  selectUseManagementError
);


export default { selectCurrentUsers, selectIsUserManagementLoading, selectCurrentUser, selectCurrentUseManagementError };
