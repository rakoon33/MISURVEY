import { createReducer, on } from '@ngrx/store';
import { customerFeedbackActions } from '../actions';
import { CustomerFeedbackState } from '../states';

export const initialState: CustomerFeedbackState = {
  surveyResponses: [],
  contactInfo: null,
  loading: false,
  error: null,
};

export const customerFeedbackReducer = createReducer(
  initialState,
  on(customerFeedbackActions.addSurveyResponse, (state, { response }) => {
    const updatedResponses = state.surveyResponses.map((existingResponse) => {
      if (existingResponse.SurveyID === response.SurveyID && existingResponse.QuestionID === response.QuestionID) {
        return { ...existingResponse, ResponseValue: response.ResponseValue }; // Update existing response
      }
      return existingResponse; // Return existing responses that do not match
    });
    // Check if the response was updated, if not add new one
    const isExisting = state.surveyResponses.some(
      (resp) => resp.SurveyID === response.SurveyID && resp.QuestionID === response.QuestionID
    );
    return {
      ...state,
      surveyResponses: isExisting ? updatedResponses : [...state.surveyResponses, response],
    };
  }),
  on(customerFeedbackActions.setContactInfo, (state, { contactInfo }) => ({
    ...state,
    contactInfo
  })),
  on(customerFeedbackActions.submitSurveyResponses, state => ({
    ...state,
    surveyResponses: [],
    contactInfo: null
  })),
  on(customerFeedbackActions.submitSurveyResponsesSuccess, state => ({
    ...state,
    loading: false,
    error: null
  })),
  on(customerFeedbackActions.submitSurveyResponsesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
