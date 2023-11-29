import * as featureReducer from './reducers';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { AppState } from './app.state'; 

export const reducers: ActionReducerMap<AppState> = {
    feature_user: featureReducer.userReducer,
    feature_auth: featureReducer.authReducer,
    feature_user_management: featureReducer.userManagementReducer,
};

  
export function storageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  const metaReducer = storageSync<AppState>({
    features: [
      { stateKey: 'feature_auth' },
      { stateKey: 'feature_user' }
    ],
    storage: window.localStorage
  });

  return metaReducer(reducer);
}

export const metaReducers: MetaReducer<any>[] = [storageSyncReducer];
