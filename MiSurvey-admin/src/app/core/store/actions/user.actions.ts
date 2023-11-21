import { createAction, props, ActionType } from '@ngrx/store';
import { User } from '../../models';

enum UserActionTypes {
  LOGIN_REQUEST = '@User/Login',
  LOGIN_SUCCESS = '@User/LoginSuccess',
  LOGIN_FAILURE = '@User/LoginFailed',
  LOGOUT_REQUEST = '@User/Logout',
}

export const loginRequest = createAction(
  UserActionTypes.LOGIN_REQUEST,
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  UserActionTypes.LOGIN_SUCCESS,
  props<{ user: User }>()
);

export const loginFailure = createAction(
  UserActionTypes.LOGIN_FAILURE,
  props<{ error: any }>()
);

export const logoutRequest = createAction(UserActionTypes.LOGOUT_REQUEST);

export type userActionsType =
  | ActionType<typeof loginRequest>
  | ActionType<typeof loginSuccess>
  | ActionType<typeof loginFailure>
  | ActionType<typeof logoutRequest>
  