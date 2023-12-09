import { AuthState, UserState, UserManagementState } from "./states";
import { RouterReducerState } from '@ngrx/router-store';
export interface AppState {
  feature_user: UserState;
  feature_auth: AuthState;
  feature_user_management: UserManagementState;
  router: RouterReducerState;
}