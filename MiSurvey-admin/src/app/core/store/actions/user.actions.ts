import { createAction, props } from '@ngrx/store';
import { User } from '../../models';

export const getUserDataRequest = createAction(
  '[User] Get User Data Request',
  props<{ username: string }>()
);

export const getUserDataSuccess = createAction(
  '[User] Get User Data Success',
  props<{ user: User }>()
);

export const getUserDataFailure = createAction(
  '[User] Get User Data Failure',
  props<{ error: string }>()
);
