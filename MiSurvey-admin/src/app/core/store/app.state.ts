import { AuthState, UserState } from "./states";

export interface AppState {
  feature_user: UserState;
  feature_auth: AuthState;
}