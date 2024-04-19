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
        },
      };
    }
  ),
  on(surveyManagementActions.addSurveyQuestion, (state, { questionText }) => {
    // Ensure that the survey is defined
    if (!state.survey) {
      return state;
    }

    // Initialize SurveyQuestions as an empty array if it doesn't exist
    const SurveyQuestions = state.survey.SurveyQuestions || [];

    // Determine the new PageOrder value
    const newPageOrder = SurveyQuestions.length + 1;

    // Create a new question object
    const newQuestion = {
      QuestionText: questionText,
      // QuestionType can be added later when available
      PageOrder: newPageOrder,
    };

    // Add the new question to the list of questions
    const updatedQuestions = [...SurveyQuestions, newQuestion];

    return {
      ...state,
      survey: {
        ...state.survey,
        SurveyQuestions: updatedQuestions,
      },
    };
  }),

  on(
    surveyManagementActions.addSurveyQuestionType,
    (state, { questionText, questionType }) => {
      if (!state.survey || !state.survey.SurveyQuestions) {
        return state;
      }
  
      const updatedQuestions = [...state.survey.SurveyQuestions];
      let foundExisting = false;
  
      // First, check if we should update an existing question
      const questionsWithUpdates = updatedQuestions.map((question) => {
        if (question.QuestionText === questionText) {
          if (question.QuestionType === undefined) {
            foundExisting = true;
            return { ...question, QuestionType: questionType };
          }
        }
        return question;
      });
  
      // If no existing question was suitable for update, add a new one
      if (!foundExisting && !updatedQuestions.some(q => q.QuestionText === questionText && q.QuestionType === questionType)) {
        questionsWithUpdates.push({
          QuestionText: questionText,
          QuestionType: questionType,
          PageOrder: updatedQuestions.length + 1
        });
      }
  
      return {
        ...state,
        survey: {
          ...state.survey,
          SurveyQuestions: questionsWithUpdates,
        },
      };
    }
  )
  ,  
  on(surveyManagementActions.clearUnsavedQuestionText, (state) => {
    // Ensure that the survey and its questions are defined
    if (
      !state.survey ||
      !state.survey.SurveyQuestions ||
      state.survey.SurveyQuestions.length === 0
    ) {
      return state;
    }

    // Clone the questions array
    const updatedQuestions = [...state.survey.SurveyQuestions];

    // Get the last question
    const lastQuestion = updatedQuestions[updatedQuestions.length - 1];

    // Check if the last question lacks a QuestionType
    if (lastQuestion.QuestionType === undefined) {
      updatedQuestions.pop(); // Remove the last question
    }

    return {
      ...state,
      survey: {
        ...state.survey,
        SurveyQuestions: updatedQuestions,
      },
    };
  }),

  on(surveyManagementActions.createSurveyRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(surveyManagementActions.createSurveySuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(surveyManagementActions.createSurveyFailure, (state) => ({
    ...state,
    loading: false,
    error: 'Error creating survey',
  })),
  on(surveyManagementActions.fetchSurveysSuccess, (state, { surveys }) => ({
    ...state,
    surveys,
    loading: false,
    error: null,
  })),
  on(surveyManagementActions.fetchSurveysFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(surveyManagementActions.loadSurveyDetailSuccess, (state, { survey }) => ({
    ...state,
    survey,
    loading: false,
    error: null,
  })),

  on(surveyManagementActions.loadSurveyDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(surveyManagementActions.updateSurveySuccess, (state, { survey }) => ({
    ...state,
    survey,
    // ... update other parts of the state if necessary
  })),
  on(surveyManagementActions.updateSurveyFailure, (state, { error }) => ({
    ...state,
  })),
  on(surveyManagementActions.updateSurveyQuestion, (state, { questionId, questionText, questionType }) => {
    // Check if the survey and its questions are defined
    if (state.survey && state.survey.SurveyQuestions) {
      // Find the question with the matching QuestionID and update its text and type
      const updatedQuestions = state.survey.SurveyQuestions.map(question => {
        if (question.QuestionID === questionId) {
          return {
            ...question,
            QuestionText: questionText,
            QuestionType: questionType
          };
        }
        return question;
      });

      return {
        ...state,
        survey: {
          ...state.survey,
          SurveyQuestions: updatedQuestions,
        },
      };
    } else {
      // Return the state unchanged if survey or SurveyQuestions are not defined
      return state;
    }
  }),
);
