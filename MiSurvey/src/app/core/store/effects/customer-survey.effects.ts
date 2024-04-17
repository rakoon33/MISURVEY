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
import { customerSurveyActions } from '../actions';
import { CustomerSurveyService } from '../../services';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class CustomerSurveyEffects {

  loadCustomerSurveyDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerSurveyActions.loadCustomerSurveyDetailRequest),
      switchMap((action) =>
        this.customerSurveyService.getSurveyByLink(action.link).pipe(
          map((result) => {
            if (result.status) {
              // Trường hợp thành công
              return customerSurveyActions.loadCustomerSurveyDetailSuccess({
                survey: result.survey,
              });
            } else {
              // Trường hợp thất bại
              return customerSurveyActions.loadCustomerSurveyDetailFailure({
                error: result.message,
              });
            }
          }),
          catchError((error) =>
            of(customerSurveyActions.loadCustomerSurveyDetailFailure({ error }))
          )
        )
      )
    )
  );

  
  
  constructor(
    private actions$: Actions,
    private toastrService: ToastrService,
    private customerSurveyService: CustomerSurveyService,
    private store: Store,
    private router: Router,
  ) {}
}
