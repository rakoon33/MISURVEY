import { surveyManagementActions } from '../actions';
import { SurveyState } from '../states';
import { createReducer, on } from '@ngrx/store';

export const initialState: SurveyState = {
  surveys: [],
  survey: null,
  currentSurveyId: null,
  loading: false,
  error: null,
};

export const surveyManagementReducer = createReducer(
  initialState,
  on(surveyManagementActions.resetSurveyState, () => initialState),
  on(surveyManagementActions.setInvitationMethod, (state, { method }) => {
    return {
      ...state,
      survey: {
        ...state.survey,
        InvitationMethod: method,
      },
    };
  }),
  on(
    surveyManagementActions.cacheSurveyInfo,
    (state, { title, customizations, surveyDescription }) => {
      // If there's no survey in the state, we return the state as is
      if (!state.survey) {
        return state;
      }

      return {
        ...state,
        survey: {
          ...state.survey,
          Title: title,
          Customizations: customizations,
          SurveyDescription: surveyDescription,
          SurveyPages: state.survey.SurveyPages,
        },
      };
    }
  ),
  on(surveyManagementActions.addSurveyQuestion, (state, { questionText }) => {
    // Ensure that the survey is defined
    if (!state.survey) {
      return state;
    }

    // Initialize pages as an empty array if it doesn't exist
    const SurveyPages = state.survey.SurveyPages || [];

    // Determine the new PageOrder value
    const newPageOrder = SurveyPages.length + 1;

    // Create a new page with the new question
    const newPage = {
      PageOrder: newPageOrder,
      SurveyQuestions: { QuestionText: questionText }, // Change to single question object
    };

    // Add the new page to the list of pages
    const updatedPages = [...SurveyPages, newPage];

    return {
      ...state,
      survey: {
        ...state.survey,
        SurveyPages: updatedPages,
      },
    };
  }),

  on(
    surveyManagementActions.addSurveyQuestionType,
    (state, { questionText, questionType }) => {
      if (!state.survey || !state.survey.SurveyPages) {
        return state;
      }

      const updatedPages = state.survey.SurveyPages.map((page) => {
        if (page.SurveyQuestions && page.SurveyQuestions.QuestionText === questionText) {
          return {
            ...page,
            SurveyQuestions: {
              ...page.SurveyQuestions,
              QuestionType: questionType,
            },
          };
        }
        return page;
      });

      return {
        ...state,
        survey: {
          ...state.survey,
          SurveyPages: updatedPages,
        },
      };
    }
  ),

  on(surveyManagementActions.clearUnsavedQuestionText, (state) => {
    if (
      !state.survey ||
      !state.survey.SurveyPages ||
      state.survey.SurveyPages.length === 0
    ) {
      return state;
    }

    // Clone the pages array
    const updatedPages = [...state.survey.SurveyPages];

    // Get the last page
    const lastPage = updatedPages[updatedPages.length - 1];

    // Check if the last page's question lacks a QuestionType
    if (lastPage.SurveyQuestions && lastPage.SurveyQuestions.QuestionType === undefined) {
      updatedPages.pop(); // Remove the last page
    }

    return {
      ...state,
      survey: {
        ...state.survey,
        SurveyPages: updatedPages,
      },
    };
  }),
  on(surveyManagementActions.createSurveyRequest, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(surveyManagementActions.createSurveySuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(surveyManagementActions.createSurveyFailure, (state) => ({
    ...state,
    loading: false,
    error: 'Error creating survey'
  })),
  on(surveyManagementActions.fetchSurveysSuccess, (state, { surveys }) => ({
    ...state,
    surveys,  
    loading: false,
    error: null
  })),
  on(surveyManagementActions.fetchSurveysFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
   on(surveyManagementActions.loadSurveyDetailSuccess, (state, { survey }) => ({
    ...state,
    survey,
    loading: false,
    error: null
  })),

  on(surveyManagementActions.loadSurveyDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
