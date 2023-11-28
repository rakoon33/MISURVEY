import { createReducer, on } from '@ngrx/store';
import  {userManagementActions} from '../actions';
import { UserManagementState } from '../states';

export const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,
  status: false,
};

export const userManagementReducer = createReducer(
  initialState,
  on(userManagementActions.loadUsersRequest, state => ({ ...state, loading: true })),
  on(userManagementActions.loadUsersSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    users: response.status ? response.data : []  // Only update users if status is true
  })),
  on(userManagementActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);