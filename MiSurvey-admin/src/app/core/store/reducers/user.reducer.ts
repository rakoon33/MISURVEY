import { createReducer, on } from '@ngrx/store';
import { User } from '../../models';
import * as UserActions from './user.actions';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.getUserDataRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.getUserDataSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),
  on(UserActions.getUserDataFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
