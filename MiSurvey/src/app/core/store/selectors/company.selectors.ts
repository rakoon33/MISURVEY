import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyState } from './../states';

export const selectCompany = (state: CompanyState) => state.company;
export const selectCompanyLoading = (state: CompanyState) => state.loading;

export const selectCompanyState = createFeatureSelector<CompanyState>('feature_company');

const selectCurrentCompany = createSelector(
    selectCompanyState,
    selectCompany
);

const selectIsCompanyLoading = createSelector(
    selectCompanyState,
    selectCompanyLoading
);

export default { selectCurrentCompany, selectIsCompanyLoading};
