import { 
  AuthState, 
  UserState, 
  CompanyState, 
  UserManagementState, 
  CompanyManagementState,
  SurveyState,
  CustomerSurveyState,
  CompanyRolesManagementState,
  ModuleState,
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
  feature_company_roles_management: CompanyRolesManagementState;
  feature_module: ModuleState;
  router: RouterReducerState;
}