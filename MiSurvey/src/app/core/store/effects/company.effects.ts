import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { companyActions } from '../actions';
import { CompanyService } from '../../services';
import { Router } from '@angular/router';

@Injectable()
export class CompanyEffects {
  getCompanyData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyActions.getCompanyDataRequest),
      switchMap(() => 
        this.companyService.getCompanyData().pipe(
          map(response => {
            if (response.status) {
              this.router.navigate(['/dashboard']);
              return companyActions.getCompanyDataSuccess({
                company: response.companyDetails,
                permissions: response.permissions
              });
            } else {
              this.toastrService.error(response.message || 'Failed to fetch user data');
              return companyActions.getCompanyDataFailure();
            }
          }),
          catchError(error => {
            this.toastrService.error(error.message || 'An error occurred while fetching user data');
            return of(companyActions.getCompanyDataFailure());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyService: CompanyService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
}
