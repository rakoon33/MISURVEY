import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerSurveyState } from '../states';

// Selector for the entire feature module
export const selectCustomerSurveyState =
  createFeatureSelector<CustomerSurveyState>('feature_customer_survey');

// Selector to get the survey object
const selectSurvey = createSelector(
  selectCustomerSurveyState,
  (state: CustomerSurveyState) => state.survey
);

// Selector to get the current survey id
const selectCurrentSurveyId = createSelector(
  selectCustomerSurveyState,
  (state: CustomerSurveyState) => state.currentSurveyId
);

// Selector to get the loading state
const selectLoading = createSelector(
  selectCustomerSurveyState,
  (state: CustomerSurveyState) => state.loading
);

// Selector to get the error state
const selectError = createSelector(
  selectCustomerSurveyState,
  (state: CustomerSurveyState) => state.error
);

export default {selectSurvey,selectCurrentSurveyId, selectLoading, selectError }