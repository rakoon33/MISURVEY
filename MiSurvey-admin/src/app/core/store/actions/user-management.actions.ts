import { ActionType, createAction, props } from '@ngrx/store';
import { User } from '../../models';

export const loadUsersRequest = createAction('[User Management] Load Users');
export const loadUsersSuccess = createAction(
  '[User Management] Load Users Success', 
  props<{ response: { status: boolean; data: User[] } }>()
);
export const loadUsersFailure = createAction(
  '[User Management] Load Users Failure',
  props<{ error: any }>()
);

export const loadUserByIdRequest = createAction(
  '[User Management] Load User By ID Request',
  props<{ userId: string }>()
);

export const loadUserByIdSuccess = createAction(
  '[User Management] Load User By ID Success',
  props<{ user: User }>()
);

export const loadUserByIdFailure = createAction(
  '[User Management] Load User By ID Failure',
  props<{ error: any }>()
);

export type UserManagementActions =
  | ActionType<typeof loadUsersRequest>
  | ActionType<typeof loadUsersSuccess>
  | ActionType<typeof loadUsersFailure>
  | ActionType<typeof loadUserByIdRequest>
  | ActionType<typeof loadUserByIdSuccess>
  | ActionType<typeof loadUserByIdFailure>;