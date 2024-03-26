import { createAction, props, ActionType } from '@ngrx/store';

enum AuthActionTypes {
  LOGIN_REQUEST = '[Auth] Login Request',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT_REQUEST = '[Auth] Logout Request',
  LOGOUT_FAILURE = '[Auth] Logout Failure',
  LOGOUT_SUCCESS = '[Auth] Logout Success'
}

export const loginRequest = createAction(
  AuthActionTypes.LOGIN_REQUEST,
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
);

export const loginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
);

export const logoutRequest = createAction(
  AuthActionTypes.LOGOUT_REQUEST
);

export const logoutFailure = createAction(
  AuthActionTypes.LOGOUT_FAILURE,
);

export const logoutSuccess = createAction(
  AuthActionTypes.LOGOUT_SUCCESS
);



export const registerRequest = createAction(
  '[Auth] Register Request',
  props<{ userData: { firstName: string; lastName: string; companyName: string; email: string; username: string; password: string } }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
);

export type AuthActions =
  | ActionType<typeof loginRequest>
  | ActionType<typeof loginSuccess>
  | ActionType<typeof loginFailure>
  | ActionType<typeof logoutRequest>
  | ActionType<typeof logoutSuccess>;
