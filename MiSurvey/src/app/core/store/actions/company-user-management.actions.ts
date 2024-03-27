import { createAction, props } from '@ngrx/store';

export const createCompanyUserRequest = createAction(
  '[Company User] Create Company User Request',
  props<{ companyUserData: any; userData: any }>()
);

export const createCompanyUserSuccess = createAction(
  '[Company User] Create Company User Success'
);

export const createCompanyUserFailure = createAction(
  '[Company User] Create Company User Failure',
  props<{ error: any }>()
);
