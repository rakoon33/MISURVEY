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
  })),
  on(userManagementActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users,
    loading: false
  })),
  on(userManagementActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: { message: error, timestamp: new Date() },
  })),
  on(userManagementActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
  })),
  on(userManagementActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    error: { message: error, timestamp: new Date() },
    selectedUser: null,
  }))
);
