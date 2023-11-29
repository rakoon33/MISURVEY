import { AuthState, UserState, UserManagementState } from "./states";

export interface AppState {
  feature_user: UserState;
  feature_auth: AuthState;
  feature_user_management: UserManagementState;
}