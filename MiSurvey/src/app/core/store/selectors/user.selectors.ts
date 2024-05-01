import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './../states';

export const selectUser = (state: UserState) => state.user;
export const selectUserLoading = (state: UserState) => state.loading;
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

const selectCurrentUserPermissions = createSelector(
  selectUserState,
  selectUserPermissions
);

const selectPermissionByModuleId = (moduleId: number) => createSelector(
  selectUserState,
  (selectUserPermissions) => selectUserPermissions.permissions.find(selectUserPermissions => selectUserPermissions.ModuleID === moduleId)
);

const selectPermissionByModuleName = (moduleName: string) => createSelector(
  selectUserState,
  (selectUserPermissions) => selectUserPermissions.permissions.find(selectUserPermissions => selectUserPermissions.module.ModuleName === moduleName)
);
export default { selectCurrentUser, selectIsUserLoading, selectCurrentUserPermissions, selectPermissionByModuleId, selectPermissionByModuleName};
