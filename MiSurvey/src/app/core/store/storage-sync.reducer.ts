import * as featureReducer from './reducers';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { AppState } from './app.state'; 
import { routerReducer } from '@ngrx/router-store';

export const reducers: ActionReducerMap<AppState> = {
    feature_user: featureReducer.userReducer,
    feature_company: featureReducer.companyReducer,
    feature_auth: featureReducer.authReducer,
    feature_user_management: featureReducer.userManagementReducer,
    feature_company_management: featureReducer.companyManagementReducer,
    feature_survey_management: featureReducer.surveyManagementReducer,
    feature_customer_survey: featureReducer.customerSurveyReducer,
    feature_company_roles_management: featureReducer.companyRolesManagementReducer,
    feature_module: featureReducer.moduleReducer,
    feature_customer_feedback: featureReducer.customerFeedbackReducer,
    feature_question_template: featureReducer.questionTemplateReducer,
    feature_customer_management: featureReducer.customerManagementReducer,
    router: routerReducer,
};
  
export function storageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  const metaReducer = storageSync<AppState>({
    features: [
      { stateKey: 'feature_auth' },
      { stateKey: 'feature_user' },
      { stateKey: 'feature_survey_management' },
    ],
    storage: window.localStorage
  });

  return metaReducer(reducer);
}

export const metaReducers: MetaReducer<any>[] = [storageSyncReducer];
