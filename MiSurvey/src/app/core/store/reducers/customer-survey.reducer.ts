import { loadSurveyDetailRequest } from './../actions/survey-management.actions';
import { customerSurveyActions } from '../actions';
import { CustomerSurveyState } from '../states';
import { createReducer, on } from '@ngrx/store';

export const initialState: CustomerSurveyState = {
  survey: null,
  currentSurveyId: null,
  loading: false,
  error: null,
};

export const customerSurveyReducer = createReducer(
  initialState,
  on(customerSurveyActions.loadCustomerSurveyDetailRequest, (state) => ({
    ...state,
  })),
  on(customerSurveyActions.loadCustomerSurveyDetailSuccess, (state, { survey }) => ({
    ...state,
    survey,
    loading: false,
    error: null,
  })),

  on(customerSurveyActions.loadCustomerSurveyDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
