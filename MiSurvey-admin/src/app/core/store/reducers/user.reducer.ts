import { UserState } from './../states';
import { createReducer, on } from '@ngrx/store';
import  {userActions } from './../actions';


export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  message: '',
};

export const userReducer = createReducer(
  initialState,
  on(userActions.getUserDataRequest, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(userActions.getUserDataSuccess, (state, { message, user }) => ({
    ...state,
    user,
    loading: false,
    message: message
  })),
  on(userActions.getUserDataFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
