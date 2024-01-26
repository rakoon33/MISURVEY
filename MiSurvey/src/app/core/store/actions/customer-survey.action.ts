import { createAction, props } from '@ngrx/store';
import { Survey } from '../../models';

export const loadCustomerSurveyDetailRequest = createAction(
  '[Customer Survey] Load Survey Detail Request',
  props<{ link: string }>()
);

export const loadCustomerSurveyDetailSuccess = createAction(
  '[Customer Survey] Load Survey Detail Success',
  props<{ survey: Survey }>()
);

export const loadCustomerSurveyDetailFailure = createAction(
  '[Customer Survey] Load Survey Detail Failure',
  props<{ error: any }>()
);


