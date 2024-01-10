import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { surveyManagementActions } from '../actions';
import { SurveyManagementService } from '../../services';
import { Store } from '@ngrx/store';
import { surveyManagementSelector } from '../selectors';

@Injectable()
export class SurveyManagementEffects {


    createSurvey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(surveyManagementActions.createSurveyRequest),
      withLatestFrom(this.store.select(surveyManagementSelector.selectSurveyValue)),
      switchMap(([action, survey]) =>
        this.surveyService.createSurvey(survey).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success('Survey created successfully');
              return surveyManagementActions.createSurveySuccess();
            } else {
              this.toastrService.error('Failed to create survey');
              return surveyManagementActions.createSurveyFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('An error occurred during survey creation');
            return of(surveyManagementActions.createSurveyFailure());
          })
        )
      )
    )
  );

  fetchSurveys$ = createEffect(() =>
  this.actions$.pipe(
    ofType(surveyManagementActions.fetchSurveysRequest),
    switchMap(() =>
      this.surveyService.getSurveys().pipe(
        map((response) =>
          surveyManagementActions.fetchSurveysSuccess({ surveys: response.surveys })
        ),
        catchError((error) =>
          of(surveyManagementActions.fetchSurveysFailure({ error }))
        )
      )
    )
  )
);
  constructor(
    private actions$: Actions,
    private toastrService: ToastrService,
    private surveyService: SurveyManagementService,
    private store: Store
  ) {}
}
