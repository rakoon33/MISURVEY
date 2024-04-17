// customer-feedback.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerFeedbackState } from '../states/';
import { FeedbackResponse } from '../../models';

// Selector to get the whole feature state
export const getCustomerFeedbackState = createFeatureSelector<CustomerFeedbackState>('feature_customer_feedback');

// Selector to get all survey responses
const getSurveyResponses = createSelector(
  getCustomerFeedbackState,
  (state: CustomerFeedbackState) => state.surveyResponses
);

// Selector to get the contact info
const getContactInfo = createSelector(
  getCustomerFeedbackState,
  (state: CustomerFeedbackState) => state.contactInfo
);

// Selector to get the loading state
const getLoading = createSelector(
  getCustomerFeedbackState,
  (state: CustomerFeedbackState) => state.loading
);

// Selector to get any errors
const getError = createSelector(
  getCustomerFeedbackState,
  (state: CustomerFeedbackState) => state.error
);

const selectSurveyResponse = (questionId: number) => createSelector(
    getSurveyResponses,
    (responses: FeedbackResponse[]) => responses.find(r => r.QuestionID === questionId)
  );
  
export default {getSurveyResponses, getContactInfo, getLoading, getError, selectSurveyResponse }