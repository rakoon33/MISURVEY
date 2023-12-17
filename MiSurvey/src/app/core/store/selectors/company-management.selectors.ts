import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyManagementState } from '../states';

export const selectAllCompanies = (state: CompanyManagementState) => state.companies;
export const selectCompanyManagementLoading = (state: CompanyManagementState) => state.loading;
export const selectSelectedCompany = (state: CompanyManagementState) => state.selectedCompany;
export const selectSelectedTotalCompanies = (state: CompanyManagementState) => state.totalCompanies;

export const selectCompanyManagementState = createFeatureSelector<CompanyManagementState>('feature_company_management');

const selectCurrentCompanies = createSelector(
    selectCompanyManagementState,
    selectAllCompanies
);

const selectIsCompanyManagementLoading = createSelector(
    selectCompanyManagementState,
    selectCompanyManagementLoading
);

const selectCurrentCompany = createSelector(
  selectCompanyManagementState,
  selectSelectedCompany
);

const selectCurrentTotalCompanies = createSelector(
    selectCompanyManagementState,
    selectSelectedTotalCompanies
);

export default { selectCurrentCompanies, selectIsCompanyManagementLoading, selectCurrentCompany, selectCurrentTotalCompanies };
