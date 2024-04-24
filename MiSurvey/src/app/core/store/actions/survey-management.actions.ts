import { createAction, props } from '@ngrx/store';
import { Survey } from '../../models';
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

export const createSurveyRequest = createAction(
  '[Survey] Create Survey Request'
);
export const createSurveySuccess = createAction(
  '[Survey] Create Survey Success'
);
export const createSurveyFailure = createAction(
  '[Survey] Create Survey Failure'
);


export const fetchSurveysRequest = createAction('[Survey] Fetch Surveys Request');
export const fetchSurveysSuccess = createAction(
  '[Survey] Fetch Surveys Success',
  props<{ surveys: any[] }>()
);
export const fetchSurveysFailure = createAction(
  '[Survey] Fetch Surveys Failure',
  props<{ error: any }>()
);

export const loadSurveyDetailRequest = createAction(
  '[Survey] Load Survey Detail Request',
  props<{ id: number }>()
);

export const loadSurveyDetailSuccess = createAction(
  '[Survey] Load Survey Detail Success',
  props<{ survey: Survey }>()
);

export const loadSurveyDetailFailure = createAction(
  '[Survey] Load Survey Detail Failure',
  props<{ error: any }>()
);


// Define actions for updating a survey
export const updateSurveyRequest = createAction(
  '[Survey] Update Survey Request',
  props<{ surveyId: number; surveyData: Survey }>()
);

export const updateSurveySuccess = createAction(
  '[Survey] Update Survey Success',
  props<{ survey: Survey }>()
);

export const updateSurveyFailure = createAction(
  '[Survey] Update Survey Failure',
  props<{ error: any }>()
);

// update questions
export const updateSurveyQuestion = createAction(
  '[Survey] Update Survey Question',
  props<{ questionId: number; questionText: string, questionType: number }>()
);

export const deleteSurveyRequest = createAction(
  '[Survey] Delete Survey Request',
  props<{ surveyId: number }>()
);

export const deleteSurveySuccess = createAction(
  '[Survey] Delete Survey Success',
  props<{ surveyId: number }>()
);

export const deleteSurveyFailure = createAction(
  '[Survey] Delete Survey Failure',
  props<{ error: any }>()
);