import { ActionType, createAction, props } from '@ngrx/store';
import { User } from '../../models';

enum UserManagementActionTypes {
  LOAD_USERS_REQUEST = '[User Management] Load Users',
  LOAD_USERS_SUCCESS = '[User Management] Load Users Success',
  LOAD_USERS_FAILURE = '[User Management] Load Users Failure',
  LOAD_USER_BY_ID_REQUEST = '[User Management] Load User By ID Request',
  LOAD_USER_BY_ID_SUCCESS = '[User Management] Load User By ID Success',
  LOAD_USER_BY_ID_FAILURE = '[User Management] Load User By ID Failure'
}

export const loadUsersRequest = createAction(UserManagementActionTypes.LOAD_USERS_REQUEST);
export const loadUsersSuccess = createAction(
  UserManagementActionTypes.LOAD_USERS_SUCCESS,
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  UserManagementActionTypes.LOAD_USERS_FAILURE,
  props<{ error: any }>()
);

export const loadUserByIdRequest = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_REQUEST,
  props<{ userId: string }>()
);

export const loadUserByIdSuccess = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_SUCCESS,
  props<{ user: User }>() 
);

export const loadUserByIdFailure = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_FAILURE,
  props<{ error: any }>()
);

export type UserManagementActions =
  | ActionType<typeof loadUsersRequest>
  | ActionType<typeof loadUsersSuccess>
  | ActionType<typeof loadUsersFailure>
  | ActionType<typeof loadUserByIdRequest>
  | ActionType<typeof loadUserByIdSuccess>
  | ActionType<typeof loadUserByIdFailure>;
