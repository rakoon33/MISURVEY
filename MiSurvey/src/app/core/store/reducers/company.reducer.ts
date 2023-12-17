import { CompanyState } from './../states';
import { createReducer, on } from '@ngrx/store';
import { CompanyActions } from './../actions';

export const initialState: CompanyState = {
  company: null,
  loading: false,
  permissions: [],
};

export const companyReducer = createReducer(
  initialState,
  on(CompanyActions.getCompanyDataRequest, state => ({
    ...state,
    loading: true,
  })),
  on(CompanyActions.getCompanyDataSuccess, (state, { company, permissions = [] }) => ({
    ...state,
    company,
    loading: false,
    permissions: permissions
  })),
  on(CompanyActions.getCompanyDataFailure, (state) => ({
    ...state,
    loading: false
  })),
);
