import { UserState } from './../states';
import { createReducer, on } from '@ngrx/store';
import  {userActions } from './../actions';


export const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(userActions.getUserDataRequest, state => ({
    ...state,
    loading: true,
  })),
  on(userActions.getUserDataSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(userActions.getUserDataFailure, (state, { error }) => ({
    ...state,
    error: { message: error, timestamp: new Date() },
    loading: false
  }))
);
