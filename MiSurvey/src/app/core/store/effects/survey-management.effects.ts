import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { surveyManagementActions } from '../actions';
import { SurveyManagementService } from '../../services';
import { Store } from '@ngrx/store';
import { surveyManagementSelector } from '../selectors';
import { Router } from '@angular/router';

@Injectable()
export class SurveyManagementEffects {
  createSurvey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(surveyManagementActions.createSurveyRequest),
      withLatestFrom(
        this.store.select(surveyManagementSelector.selectSurveyValue)
      ),
      switchMap(([action, survey]) =>
        this.surveyService.createSurvey(survey).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success('Survey created successfully');
              this.router.navigate([
                '/survey-management/survey-detailed',
                response.survey?.SurveyID,
              ]);
              return surveyManagementActions.createSurveySuccess();
            } else {
              console.log(response.message);
              this.toastrService.error('Failed to create survey');
              return surveyManagementActions.createSurveyFailure();
            }
          }),
          catchError((error) => {
            console.log(error.message);
            this.toastrService.error(
              'An error occurred during survey creation'
            );
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
            surveyManagementActions.fetchSurveysSuccess({
              surveys: response.surveys,
            })
          ),
          catchError((error) =>
            of(surveyManagementActions.fetchSurveysFailure({ error }))
          )
        )
      )
    )
  );

  loadSurveyDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(surveyManagementActions.loadSurveyDetailRequest),
      switchMap((action) =>
        this.surveyService.getSurveyById(action.id).pipe(
          map((result) => {
            if (result.status) {
              // Trường hợp thành công
              return surveyManagementActions.loadSurveyDetailSuccess({
                survey: result.survey,
              });
            } else {
              // Trường hợp thất bại
              return surveyManagementActions.loadSurveyDetailFailure({
                error: result.message,
              });
            }
          }),
          catchError((error) =>
            of(surveyManagementActions.loadSurveyDetailFailure({ error }))
          )
        )
      )
    )
  );

  updateSurvey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(surveyManagementActions.updateSurveyRequest),
      mergeMap((action) =>
        this.surveyService
          .updateSurvey(action.surveyId, action.surveyData)
          .pipe(
            map((response) => {
              // Display success message using toastrService
              if (response.status) {
                this.toastrService.success(response.message);
                return surveyManagementActions.updateSurveySuccess({
                  survey: action.surveyData, // Use the data from the action to update the state
                });
              } else {
                // If status is false, display the error message and dispatch failure action
                this.toastrService.error(response.message);
                return surveyManagementActions.updateSurveyFailure({
                  error: response.message,
                });
              }
            }),
            catchError((error) => {
              // Handle error response
              this.toastrService.error(
                'An error occurred during the update operation.'
              );
              return of(surveyManagementActions.updateSurveyFailure({ error }));
            })
          )
      )
    )
  );

  deleteSurvey$ = createEffect(() =>
    this.actions$.pipe(
      ofType(surveyManagementActions.deleteSurveyRequest),
      mergeMap((action) =>
        this.surveyService.deleteSurvey(action.surveyId).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success('Survey deleted successfully');
              return surveyManagementActions.deleteSurveySuccess({
                surveyId: action.surveyId,
              });
            } else {
              this.toastrService.error('Survey deleted failed');
              return surveyManagementActions.deleteSurveyFailure(
                response.message
              );
            }
          }),
          catchError((error) => {
            this.toastrService.error('Failed to delete survey');
            return of(surveyManagementActions.deleteSurveyFailure({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private toastrService: ToastrService,
    private surveyService: SurveyManagementService,
    private store: Store,
    private router: Router
  ) {}
}
