import { UserState } from "./states";
import { AuthState } from "./states"; 

export interface AppState {
  feature_user: UserState;
  feature_auth: AuthState; 
}
