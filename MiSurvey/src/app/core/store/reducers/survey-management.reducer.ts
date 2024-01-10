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
          pages: state.survey.pages,
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
    const pages = state.survey.pages || [];

    // Determine the new PageOrder value
    const newPageOrder = pages.length + 1;

    // Create a new page with the new question
    const newPage = {
      PageOrder: newPageOrder,
      question: { QuestionText: questionText }, // Change to single question object
    };

    // Add the new page to the list of pages
    const updatedPages = [...pages, newPage];

    return {
      ...state,
      survey: {
        ...state.survey,
        pages: updatedPages,
      },
    };
  }),

  on(
    surveyManagementActions.addSurveyQuestionType,
    (state, { questionText, questionType }) => {
      if (!state.survey || !state.survey.pages) {
        return state;
      }

      const updatedPages = state.survey.pages.map((page) => {
        if (page.question && page.question.QuestionText === questionText) {
          return {
            ...page,
            question: {
              ...page.question,
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
          pages: updatedPages,
        },
      };
    }
  ),

  on(surveyManagementActions.clearUnsavedQuestionText, (state) => {
    if (
      !state.survey ||
      !state.survey.pages ||
      state.survey.pages.length === 0
    ) {
      return state;
    }

    // Clone the pages array
    const updatedPages = [...state.survey.pages];

    // Get the last page
    const lastPage = updatedPages[updatedPages.length - 1];

    // Check if the last page's question lacks a QuestionType
    if (lastPage.question && lastPage.question.QuestionType === undefined) {
      updatedPages.pop(); // Remove the last page
    }

    return {
      ...state,
      survey: {
        ...state.survey,
        pages: updatedPages,
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
  }))
);
