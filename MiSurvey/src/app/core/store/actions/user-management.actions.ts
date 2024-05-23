import { ActionType, createAction, props } from '@ngrx/store';
import { User } from '../../models';

enum UserManagementActionTypes {
  LOAD_USERS_REQUEST = '[User Management] Load Users Request',
  LOAD_USERS_SUCCESS = '[User Management] Load Users Success',
  LOAD_USERS_FAILURE = '[User Management] Load Users Failure',

  LOAD_USER_BY_ID_REQUEST = '[User Management] Load User By ID Request',
  LOAD_USER_BY_ID_SUCCESS = '[User Management] Load User By ID Success',
  LOAD_USER_BY_ID_FAILURE = '[User Management] Load User By ID Failure',

  UPDATE_USER_REQUEST = '[User Management] Update User Request',
  UPDATE_USER_SUCCESS = '[User Management] Update User Success',
  UPDATE_USER_FAILURE = '[User Management] Update User Failure',

  CREATE_USER_REQUEST = '[User Management] Create User Request',
  CREATE_USER_SUCCESS = '[User Management] Create User Success',
  CREATE_USER_FAILURE = '[User Management] Create User Failure',

  DELETE_USER_REQUEST = '[User Management] Delete User Request',
  DELETE_USER_SUCCESS = '[User Management] Delete User Success',
  DELETE_USER_FAILURE = '[User Management] Delete User Failure',
}

export const loadUsersRequest = createAction(
  UserManagementActionTypes.LOAD_USERS_REQUEST,
);
export const loadUsersSuccess = createAction(
  UserManagementActionTypes.LOAD_USERS_SUCCESS,
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  UserManagementActionTypes.LOAD_USERS_FAILURE,
);

export const loadUserByIdRequest = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_REQUEST,
  props<{ UserID: number }>()
);

export const loadUserByIdSuccess = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_SUCCESS,
  props<{ user: User, hasCompanyData: boolean }>()
);

export const loadUserByIdFailure = createAction(
  UserManagementActionTypes.LOAD_USER_BY_ID_FAILURE,
);

export const createUserRequest = createAction(
  UserManagementActionTypes.CREATE_USER_REQUEST,
  props<{ userData: User }>()
);

export const createUserSuccess = createAction(
  UserManagementActionTypes.CREATE_USER_SUCCESS,
  props<{ UserID: string }>()
);

export const createUserFailure = createAction(
  UserManagementActionTypes.CREATE_USER_FAILURE,
);

export const updateUserRequest = createAction(
  UserManagementActionTypes.UPDATE_USER_REQUEST,
  props<{ UserID: number; userData: User }>()
);
export const updateUserSuccess = createAction(
  UserManagementActionTypes.UPDATE_USER_SUCCESS,
  props<{ user: User }>() 
);
export const updateUserFailure = createAction(
  UserManagementActionTypes.UPDATE_USER_FAILURE,
);
export const deleteUserRequest = createAction(
  UserManagementActionTypes.DELETE_USER_REQUEST,
  props<{ userId: number }>()
);

export const deleteUserSuccess = createAction(
  UserManagementActionTypes.DELETE_USER_SUCCESS,
  props<{ userId: number }>()
);

export const deleteUserFailure = createAction(
  UserManagementActionTypes.DELETE_USER_FAILURE
);


export type UserManagementActions =
  | ActionType<typeof loadUsersRequest>
  | ActionType<typeof loadUsersSuccess>
  | ActionType<typeof loadUsersFailure>
  | ActionType<typeof loadUserByIdRequest>
  | ActionType<typeof loadUserByIdSuccess>
  | ActionType<typeof loadUserByIdFailure>
  | ActionType<typeof updateUserRequest>
  | ActionType<typeof updateUserSuccess>
  | ActionType<typeof updateUserFailure>;
