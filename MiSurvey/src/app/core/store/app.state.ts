import { 
  AuthState, 
  UserState, 
  CompanyState, 
  UserManagementState, 
  CompanyManagementState,
  SurveyState,
  CustomerSurveyState
} from "./states";

import { RouterReducerState } from '@ngrx/router-store';

export interface AppState {
  feature_user: UserState;
  feature_company: CompanyState;
  feature_auth: AuthState;
  feature_user_management: UserManagementState;
  feature_company_management: CompanyManagementState;
  feature_survey_management: SurveyState;
  feature_customer_survey: CustomerSurveyState;
  router: RouterReducerState;
}