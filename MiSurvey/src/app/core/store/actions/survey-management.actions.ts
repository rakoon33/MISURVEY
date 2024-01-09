import { createAction, props } from '@ngrx/store';

export const resetSurveyState = createAction('[Survey] Reset State');

export const setInvitationMethod = createAction(
  '[Survey] Set Invitation Method',
  props<{ method: string }>()
);

export const cacheSurveyInfo = createAction(
  '[Survey] Cache Survey Info',
  props<{
    title: string,
    customizations: { topBarColor: string, buttonTextColor: string },
    surveyDescription: string
  }>()
);

export const addSurveyQuestion = createAction(
  '[Survey] Add Survey Question',
  props<{ questionText: string }>()
);

export const addSurveyQuestionType = createAction(
  '[Survey] Add Survey Question Type',
  props<{ questionText: string, questionType: number }>()
);

export const clearUnsavedQuestionText = createAction(
  '[Survey] Clear Unsaved Question Text'
);