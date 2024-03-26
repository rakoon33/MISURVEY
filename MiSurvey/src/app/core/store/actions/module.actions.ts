import { createAction, props } from '@ngrx/store';
import { Module } from '../../models';

export const loadModulesRequest = createAction(
  '[Module] Load Modules Request'
);

export const loadModulesSuccess = createAction(
  '[Module] Load Modules Success',
  props<{ modules: Module[] }>()
);

export const loadModulesFailure = createAction(
  '[Module] Load Modules Failure',
  props<{ error: any }>()
);
