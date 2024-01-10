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
  (survey) => survey?.pages || []
);

// Selector for all questions in the current survey
const selectAllSurveyQuestions = createSelector(
  selectSurveyPages,
  (pages) => pages.map(page => page.question).filter(question => question != null)
);
// Selector for all question texts in the current survey
const selectAllQuestionTexts = createSelector(
  selectAllSurveyQuestions,
  (questions) => questions.filter((question) => question !== undefined).map((question) => question!.QuestionText)
);

// Selector for the first question text in the current survey
const selectFirstQuestionText = createSelector(
  selectAllSurveyQuestions,
  (questions) => (questions.length > 0 && questions[0]) ? questions[0].QuestionText : null
);

// Selector for the last question text in the current survey
const selectLastQuestionText = createSelector(
  selectAllSurveyQuestions,
  (questions) => {
    if (questions.length > 0) {
      const lastQuestion = questions[questions.length - 1];
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
  (questions) => questions.length
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