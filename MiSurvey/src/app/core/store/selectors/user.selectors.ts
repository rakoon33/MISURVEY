import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './../states';

export const selectUser = (state: UserState) => state.user;
export const selectUserLoading = (state: UserState) => state.loading;
export const selectUserPermissions = (state: UserState) => state.permissions;
export const selectUserPackage = (state: UserState) => state.packages;
// Feature selector
export const selectUserState = createFeatureSelector<UserState>('feature_user');

const selectCurrentUser = createSelector(selectUserState, selectUser);

const selectIsUserLoading = createSelector(selectUserState, selectUserLoading);

const selectCurrentUserPermissions = createSelector(
  selectUserState,
  selectUserPermissions
);

const selectPermissionByModuleId = (moduleId: number) => createSelector(
  selectUserState,
  (state: UserState) => {
    // Safeguard against undefined permissions
    return state.permissions ? state.permissions.find(permission => permission.ModuleID === moduleId) : undefined;
  }
);
const selectPermissionByModuleName = (moduleName: string) => createSelector(
  selectUserState,
  (state: UserState) => {
    // Safeguard against undefined permissions
    return state.permissions ? state.permissions.find(permission => permission.module.ModuleName === moduleName) : undefined;
  }
);
const selectCurrentUserPackages = createSelector(
  selectUserState,
  selectUserPackage
);

export default {
  selectCurrentUser,
  selectIsUserLoading,
  selectCurrentUserPermissions,
  selectPermissionByModuleId,
  selectPermissionByModuleName,
  selectCurrentUserPackages,
};
