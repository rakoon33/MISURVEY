import { createReducer, on } from '@ngrx/store';
import * as QuestionTemplateActions from '../actions/question-template.actions';
import { QuestionTemplateState } from '../states';

export const initialState: QuestionTemplateState = {
  questionTemplates: [],
  totalTemplates: 0,
  loading: false,
  error: null
};

export const questionTemplateReducer = createReducer(
  initialState,
  on(QuestionTemplateActions.loadQuestionTemplatesSuccess, (state, { questionTemplates, totalTemplates }) => ({
    ...state,
    questionTemplates: questionTemplates,
    totalTemplates: totalTemplates,
    loading: false,
    error: null
  })),
  on(QuestionTemplateActions.loadQuestionTemplatesFailure, (state) => ({
    ...state,
    loading: false,
    error: "Failed to load question templates."
  })),
  on(QuestionTemplateActions.createQuestionTemplateSuccess, (state, { questionTemplate }) => ({
    ...state,
    questionTemplates: [...state.questionTemplates, questionTemplate],
    loading: false,
    error: null
  })),
  on(QuestionTemplateActions.createQuestionTemplateFailure, (state) => ({
    ...state,
    loading: false,
    error: "Failed to create question template."
  })),
  on(QuestionTemplateActions.updateQuestionTemplateSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(QuestionTemplateActions.updateQuestionTemplateFailure, (state) => ({
    ...state,
    loading: false,
    error: "Failed to update question template."
  })),
  on(QuestionTemplateActions.deleteQuestionTemplateSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(QuestionTemplateActions.deleteQuestionTemplateFailure, (state) => ({
    ...state,
    loading: false,
    error: "Failed to delete question template."
  })),
);

