import { createAction, props } from '@ngrx/store';
import { SurveyResponse, ContactInfo, FeedbackResponse } from '../../models';

export const addSurveyResponse = createAction(
  '[SurveyFeedback] Add Survey Response',
  props<{ response: FeedbackResponse }>()
);

export const setContactInfo = createAction(
  '[SurveyFeedback] Set Contact Info',
  props<{ contactInfo: ContactInfo }>()
);

export const submitSurveyResponses = createAction(
  '[SurveyFeedback] Submit Survey Responses',
  props<{ contactInfo: ContactInfo; response: FeedbackResponse[] }>()
);

export const submitSurveyResponsesSuccess = createAction(
  '[SurveyFeedback] Submit Survey Responses Success'
);

export const submitSurveyResponsesFailure = createAction(
  '[SurveyFeedback] Submit Survey Responses Failure',
  props<{ error: string }>()
);
