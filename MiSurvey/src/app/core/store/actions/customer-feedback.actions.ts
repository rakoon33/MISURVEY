import { createAction, props } from '@ngrx/store';
import { SurveyResponse, ContactInfo, FeedbackResponse } from '../../models';

export const addSurveyResponse = createAction(
  '[Survey] Add Survey Response',
  props<{ response: FeedbackResponse }>()
);

export const setContactInfo = createAction(
  '[Survey] Set Contact Info',
  props<{ contactInfo: ContactInfo }>()
);

export const submitSurveyResponses = createAction(
  '[Survey] Submit Survey Responses'
);
