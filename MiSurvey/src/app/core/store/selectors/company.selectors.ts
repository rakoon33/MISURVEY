import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyState } from './../states';

export const selectCompany = (state: CompanyState) => state.company;
export const selectCompanyLoading = (state: CompanyState) => state.loading;
export const selectCompanyPermissions = (state: CompanyState) => state.permissions;

export const selectCompanyState = createFeatureSelector<CompanyState>('feature_company');

const selectCurrentCompany = createSelector(
    selectCompanyState,
    selectCompany
);

const selectIsCompanyLoading = createSelector(
    selectCompanyState,
    selectCompanyLoading
);

export const selectCurrentCompanyPermissions = createSelector(
    selectCompanyState,
    selectCompanyPermissions
);

export const selectPermissionByModuleId = (moduleId: number) => createSelector(
    selectCompanyState,
    (selectCompanyPermissions) => selectCompanyPermissions.permissions.find(selectCompanyPermissions => selectCompanyPermissions.ModuleID === moduleId)
);

export const selectPermissionByModuleName = (moduleName: string) => createSelector(
    selectCompanyState,
    (selectCompanyPermissions) => selectCompanyPermissions.permissions.find(selectCompanyPermissions => selectCompanyPermissions.module.ModuleName === moduleName)
);
export default { selectCurrentCompany, selectIsCompanyLoading, selectPermissionByModuleId, selectPermissionByModuleName};
