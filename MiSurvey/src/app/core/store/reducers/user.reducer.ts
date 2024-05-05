import { UserState } from './../states';
import { createReducer, on } from '@ngrx/store';
import { userActions } from './../actions';

export const initialState: UserState = {
  user: null,
  loading: false,
  permissions: [],
  packages: null
};

export const userReducer = createReducer(
  initialState,
  on(userActions.getUserDataRequest, state => ({
    ...state,
    loading: true,
  })),
  on(userActions.getUserDataSuccess, (state, { user, permissions, packages }) => ({
    ...state,
    user,
    loading: false,
    permissions: permissions,
    packages 
  })),
  on(userActions.getUserDataFailure, (state) => ({
    ...state,
    loading: false
  })),
);
