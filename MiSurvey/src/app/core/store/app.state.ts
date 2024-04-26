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
  CustomerFeedbackState,
  QuestionTemplateState,
  CustomerManagementState,
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
  feature_customer_feedback: CustomerFeedbackState;
  feature_question_template: QuestionTemplateState;
  feature_customer_management: CustomerManagementState;
  router: RouterReducerState;
}