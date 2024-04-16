import { createReducer, on } from '@ngrx/store';
import * as moduleActions from '../actions/module.actions';
import { ModuleState } from '../states';

export const initialState: ModuleState = {
  modules: [],
  loading: false,
  error: null,
};

export const moduleReducer = createReducer(
  initialState,
  on(moduleActions.loadModulesRequest, (state) => ({
    ...state,
    loading: true,
  })),
  on(moduleActions.loadModulesSuccess, (state, { modules }) => ({
    ...state,
    modules: modules,
    loading: false,
  })),
  on(moduleActions.loadModulesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
