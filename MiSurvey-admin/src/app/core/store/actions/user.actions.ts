import { createAction, props, ActionType } from '@ngrx/store';
import { User } from '../../models';

enum UserActionTypes {
  GET_USER_DATA_REQUEST = '[User] Get User Data Request',
  GET_USER_DATA_SUCCESS = '[User] Get User Data Success',
  GET_USER_DATA_FAILURE = '[User] Get User Data Failure'
}

export const getUserDataRequest = createAction(
  UserActionTypes.GET_USER_DATA_REQUEST
);

export const getUserDataSuccess = createAction(
  UserActionTypes.GET_USER_DATA_SUCCESS,
  props<{ message: string, user: User }>()
);

export const getUserDataFailure = createAction(
  UserActionTypes.GET_USER_DATA_FAILURE,
  props<{ error: string }>()
);

export type UserActions =
  | ActionType<typeof getUserDataRequest>
  | ActionType<typeof getUserDataSuccess>
  | ActionType<typeof getUserDataFailure>;
