import { AuthState, UserState, UserManagementState, SurveyState } from "./states";
import { RouterReducerState } from '@ngrx/router-store';
export interface AppState {
  feature_user: UserState;
  feature_auth: AuthState;
  feature_user_management: UserManagementState;
  feature_survey_management: SurveyState;
  router: RouterReducerState;
}