import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ModuleState } from '../states';

export const selectModuleFeature = createFeatureSelector<ModuleState>('feature_module');

const selectAllModules = createSelector(
    selectModuleFeature,
    (state: ModuleState) => state.modules
);

const selectModulesLoading = createSelector(
  selectModuleFeature,
  (state: ModuleState) => state.loading
);


export default {selectAllModules, selectModulesLoading }