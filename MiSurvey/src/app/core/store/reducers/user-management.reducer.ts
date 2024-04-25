import { createReducer, on } from '@ngrx/store';
import { userManagementActions } from '../actions';
import { UserManagementState } from '../states';

export const initialState: UserManagementState = {
  users: [],
  loading: false,
  selectedUser: null,
  totalUsers: 0,
};

export const userManagementReducer = createReducer(
  initialState,
  on(userManagementActions.loadUsersRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.loadUsersSuccess, (state, { users, totalUsers }) => ({
    ...state,
    users: users,
    loading: false,
    totalUsers
  })),
  on(userManagementActions.loadUsersFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(userManagementActions.loadUserByIdRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),
  on(userManagementActions.loadUserByIdFailure, (state) => ({
    ...state,
    selectedUser: null,
    loading: false,
  })),
  on(userManagementActions.updateUserRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.UserID === user.UserID ? user : u)),
    loading: false,
    selectedUser: user, 
  })),

  on(userManagementActions.updateUserFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(userManagementActions.createUserRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.createUserSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(userManagementActions.createUserFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(userManagementActions.deleteUserRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(userManagementActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(user => user.UserID !== userId),
    loading: false
  })),
  on(userManagementActions.deleteUserFailure, (state) => ({
    ...state,
    loading: false
  }))
);
