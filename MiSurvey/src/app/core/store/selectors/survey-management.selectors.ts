import { createSelector } from '@ngrx/store';
import { SurveyState } from '../states';

const selectFeatureSurveyManagementState = (state: any) => state.feature_survey_management;

// Selector for the current survey
const selectCurrentSurvey = createSelector(
  selectFeatureSurveyManagementState,
  (featureState: SurveyState) => featureState.survey
);

// Selector for all questions in the current survey
const selectAllSurveyQuestions = createSelector(
  selectCurrentSurvey,
  (survey) => survey?.SurveyQuestions || []
);

// Selector for all question texts in the current survey
const selectAllQuestionTexts = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => SurveyQuestions.map(question => question.QuestionText)
);

// Selector for the first question text in the current survey
const selectFirstQuestionText = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => SurveyQuestions.length > 0 ? SurveyQuestions[0].QuestionText : null
);

// Selector for the last question text in the current survey
const selectLastQuestionText = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => {
    const lastIndex = SurveyQuestions.length - 1;
    return lastIndex >= 0 ? SurveyQuestions[lastIndex].QuestionText : null;
  }
);

// Selector for the count of questions in the current survey
const selectQuestionsCount = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => SurveyQuestions.length
);

// Use the selectCurrentSurvey to get the entire survey object
export const selectSurveyValue = createSelector(
  selectCurrentSurvey,
  (survey) => survey
);

const selectAllSurveys = createSelector(
  selectFeatureSurveyManagementState,
  (state) => state.surveys
);

export default {
  selectAllQuestionTexts,
  selectFirstQuestionText,
  selectLastQuestionText,
  selectQuestionsCount,
  selectSurveyValue,
  selectAllSurveys,
  selectCurrentSurvey
};
