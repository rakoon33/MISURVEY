import { createAction, props } from '@ngrx/store';
import { QuestionTemplate } from '../../models';

export const loadQuestionTemplatesRequest = createAction(
  '[Question Template] Load Question Templates Request'
);

export const loadQuestionTemplatesSuccess = createAction(
  '[Question Template] Load Question Templates Success',
  props<{ questionTemplates: QuestionTemplate[]; }>()
);

export const loadQuestionTemplatesFailure = createAction(
  '[Question Template] Load Question Templates Failure'
);

export const loadQuestionTemplateByIdRequest = createAction(
  '[Question Template] Load Question Template By ID Request',
  props<{ templateId: number }>()
);

export const loadQuestionTemplateByIdSuccess = createAction(
  '[Question Template] Load Question Template By ID Success',
  props<{ questionTemplate: QuestionTemplate }>()
);

export const loadQuestionTemplateByIdFailure = createAction(
  '[Question Template] Load Question Template By ID Failure'
);

export const createQuestionTemplateRequest = createAction(
  '[Question Template] Create Question Template Request',
  props<{ templateData: QuestionTemplate }>()
);

export const updateQuestionTemplateRequest = createAction(
  '[Question Template] Update Question Template Request',
  props<{ templateId: number; templateData: QuestionTemplate }>()
);

export const searchQuestionTemplatesRequest = createAction(
  '[Question Template] Search Question Templates Request',
  props<{ searchTerm: string }>()
);

export const createQuestionTemplateSuccess = createAction(
  '[Question Template] Create Question Template Success',
  props<{ questionTemplate: QuestionTemplate }>()
);

export const createQuestionTemplateFailure = createAction(
  '[Question Template] Create Question Template Failure'
);

export const updateQuestionTemplateSuccess = createAction(
  '[Question Template] Update Question Template Success'
);

export const updateQuestionTemplateFailure = createAction(
  '[Question Template] Update Question Template Failure'
);

export const searchQuestionTemplatesSuccess = createAction(
  '[Question Template] Search Question Templates Success',
  props<{ searchResults: QuestionTemplate[] }>()
);

export const searchQuestionTemplatesFailure = createAction(
  '[Question Template] Search Question Templates Failure'
);
export const deleteQuestionTemplateRequest = createAction(
  '[Question Template] Delete Question Template Request',
  props<{ templateId: number }>()
);

export const deleteQuestionTemplateSuccess = createAction(
  '[Question Template] Delete Question Template Success'
);

export const deleteQuestionTemplateFailure = createAction(
  '[Question Template] Delete Question Template Failure'
);
