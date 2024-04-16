import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyRolesManagementState } from './../states';

export const selectCompanyRoleState =
  createFeatureSelector<CompanyRolesManagementState>('feature_company_roles_management');

const selectAllCompanyRoles = createSelector(
  selectCompanyRoleState,
  (state: CompanyRolesManagementState) => state.companyRoles
);

const selectCompanyRolesLoading = createSelector(
  selectCompanyRoleState,
  (state) => state.loading
);

const selectCompanyRolesError = createSelector(
  selectCompanyRoleState,
  (state) => state.error
);

export default { selectAllCompanyRoles, selectCompanyRolesLoading, selectCompanyRolesError };
