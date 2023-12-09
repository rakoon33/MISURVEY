import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';

export const selectRouter = (state: RouterReducerState) => state.state;

export const selectRouterState = createFeatureSelector<RouterReducerState<any>>('router');

const selectCurrentRoute = createSelector(
  selectRouterState,
  selectRouter
);

export default { selectCurrentRoute };