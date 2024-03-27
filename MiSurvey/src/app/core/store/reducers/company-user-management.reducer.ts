import { createReducer, on } from '@ngrx/store';
import { companyUserManagementActions } from '../actions';

export const initialState = {
    loading: false,
    error: null,
  };

export const companyUserManagementReducer = createReducer(
  initialState,
  on(companyUserManagementActions.createCompanyUserRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(companyUserManagementActions.createCompanyUserSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(companyUserManagementActions.createCompanyUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);
