import { CompanyState } from './../states';
import { createReducer, on } from '@ngrx/store';
import { companyActions } from './../actions';

export const initialState: CompanyState = {
  company: null,
  loading: false,
};

export const companyReducer = createReducer(
  initialState,
  on(companyActions.getCompanyDataRequest, state => ({
    ...state,
    loading: true,
  })),
  on(companyActions.getCompanyDataSuccess, (state, { company, permissions = [] }) => {
    console.log('Company Data:', company);
    console.log('Permissions Data:', permissions);
    return {
      ...state,
      company,
      loading: false,
    };
  }),
  on(companyActions.getCompanyDataFailure, (state) => {
    console.log('Company Data loading failed:');
    return {
      ...state,
      loading: false
    };
  }),
  on(companyActions.getCompanyProfileRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyActions.getCompanyProfileSuccess, (state, { company }) => ({
    ...state,
    company,
    loading: false,
  })),
  on(companyActions.getCompanyProfileFailure, (state) => ({
    ...state,
    loading: false,
  }))
);
