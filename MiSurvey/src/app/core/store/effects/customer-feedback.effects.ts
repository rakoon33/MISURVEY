import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { customerFeedbackActions } from '../actions';
import { CustomerFeedbackService } from '../../services/customer-feedback.service';

@Injectable()
export class CustomerFeedbackEffects {
  submitSurveyResponses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerFeedbackActions.submitSurveyResponses),
      switchMap((action) =>
        this.feedbackService.submitSurveyResponses(action.contactInfo, action.response).pipe(
          map(() => {
            // Success toastr notification
            this.toastrService.success('Survey response submitted successfully!');
            return customerFeedbackActions.submitSurveyResponsesSuccess();
          }),
          catchError((error) => {
            // Error toastr notification
            this.toastrService.error(error.message || 'Failed to submit survey responses');
            return of(customerFeedbackActions.submitSurveyResponsesFailure({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private feedbackService: CustomerFeedbackService,
    private toastrService: ToastrService // Inject ToastrService
  ) {}
}
