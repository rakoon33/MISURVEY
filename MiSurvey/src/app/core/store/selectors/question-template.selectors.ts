import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { QuestionTemplateState } from '../states';
import { QuestionTemplate } from '../../models';

// Selector to get the feature state from the app state
export const selectQuestionTemplateState = createFeatureSelector<QuestionTemplateState>('feature_question_template');


// Selector to get all question templates from the feature state
const selectAllQuestionTemplates = createSelector(
    selectQuestionTemplateState,
  (state: QuestionTemplateState) => state.questionTemplates
);

// Selector to get the loading status from the feature state
const selectQuestionTemplatesLoading = createSelector(
    selectQuestionTemplateState,
  (state: QuestionTemplateState) => state.loading
);

// Selector to get the error message from the feature state
const selectQuestionTemplatesError = createSelector(
    selectQuestionTemplateState,
  (state: QuestionTemplateState) => state.error
);


const selectTotalTemplates = createSelector(
    selectQuestionTemplateState,
    (state) => state.totalTemplates
  );

  
export default {
  selectQuestionTemplatesError,
  selectQuestionTemplatesLoading,
  selectAllQuestionTemplates,
  selectTotalTemplates
};
