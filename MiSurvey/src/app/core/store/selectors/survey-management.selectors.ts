import { createSelector } from '@ngrx/store';
import { SurveyState } from '../states';

const selectFeatureSurveyManagementState = (state: any) => state.feature_survey_management;

// Selector for the current survey
const selectCurrentSurvey = createSelector(
  selectFeatureSurveyManagementState,
  (featureState: SurveyState) => featureState.survey
);

// Selector for the pages of the current survey
const selectSurveyPages = createSelector(
  selectCurrentSurvey,
  (survey) => survey?.SurveyPages || []
);

// Selector for all questions in the current survey
const selectAllSurveyQuestions = createSelector(
  selectSurveyPages,
  (SurveyPages) => SurveyPages.map(page => page.SurveyQuestions).filter(question => question != null)
);
// Selector for all question texts in the current survey
const selectAllQuestionTexts = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => SurveyQuestions.filter((question) => question !== undefined).map((question) => question!.QuestionText)
);

// Selector for the first question text in the current survey
const selectFirstQuestionText = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => (SurveyQuestions.length > 0 && SurveyQuestions[0]) ? SurveyQuestions[0].QuestionText : null
);

// Selector for the last question text in the current survey
const selectLastQuestionText = createSelector(
  selectAllSurveyQuestions,
  (SurveyQuestions) => {
    if (SurveyQuestions.length > 0) {
      const lastQuestion = SurveyQuestions[SurveyQuestions.length - 1];
      if (lastQuestion) {
        return lastQuestion.QuestionText;
      }
    }
    return null;
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
  selectAllSurveys
};