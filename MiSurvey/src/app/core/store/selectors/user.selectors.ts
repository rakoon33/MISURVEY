import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './../states';

export const selectUser = (state: UserState) => state.user;
export const selectUserLoading = (state: UserState) => state.loading;
export const selectUserError = (state: UserState) => state.error;
export const selectUserPermissions = (state: UserState) => state.permissions;
// Feature selector
export const selectUserState = createFeatureSelector<UserState>('feature_user');

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

export const selectCurrentUserPermissions = createSelector(
  selectUserState,
  selectUserPermissions
);

export const selectPermissionByModuleId = (moduleId: number) => createSelector(
  selectUserState,
  (selectUserPermissions) => selectUserPermissions.permissions.find(selectUserPermissions => selectUserPermissions.ModuleID === moduleId)
);

export const selectPermissionByModuleName = (moduleName: string) => createSelector(
  selectUserState,
  (selectUserPermissions) => selectUserPermissions.permissions.find(selectUserPermissions => selectUserPermissions.module.ModuleName === moduleName)
);
export default { selectCurrentUser, selectIsUserLoading, selectIsUserError, selectPermissionByModuleId, selectPermissionByModuleName};
