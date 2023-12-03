import { createReducer, on } from '@ngrx/store';
import { userManagementActions } from '../actions';
import { UserManagementState } from '../states';

export const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
};

export const userManagementReducer = createReducer(
  initialState,
  on(userManagementActions.loadUsersRequest, (state) => ({
    ...state,
    loading: true,
    error: null, // Reset the error on new request
  })),
  on(userManagementActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users,
    loading: false,
    error: null,
  })),
  on(userManagementActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: { message: error, timestamp: new Date() },
  })),
  on(userManagementActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    error: null,
  })),
  on(userManagementActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    error: { message: error, timestamp: new Date() },
    selectedUser: null,
  })),
  on(userManagementActions.updateUserRequest, (state) => ({
    ...state,
    loading: true,
    error: null, // Reset the error on new request
  })),

  on(userManagementActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.UserID === user.UserID ? user : u)),
    loading: false,
    selectedUser: user, 
    error: null,
  })),

  on(userManagementActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error, // Capture error information
  })),
  on(userManagementActions.createUserRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.createUserSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(userManagementActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);
