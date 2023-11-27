import { createAction, props, ActionType } from '@ngrx/store';
import { User } from '../../models';

enum AuthActionTypes {
  LOGIN_REQUEST = '@Auth/Login',
  LOGIN_SUCCESS = '@Auth/LoginSuccess',
  LOGIN_FAILURE = '@Auth/LoginFailed',
  LOGOUT_REQUEST = '@Auth/Logout',
}

export const loginRequest = createAction(
  AuthActionTypes.LOGIN_REQUEST,
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ message: string }>() 
);

export const loginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ error: string }>()
);

export const logoutRequest = createAction(AuthActionTypes.LOGOUT_REQUEST);

export type userActionsType =
  | ActionType<typeof loginRequest>
  | ActionType<typeof loginSuccess>
  | ActionType<typeof loginFailure>
  | ActionType<typeof logoutRequest>
  