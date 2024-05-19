import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { userActions } from '../actions';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { companyActions } from '../actions';
@Injectable()
export class UserEffects {
  getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getUserDataRequest),
      switchMap(() =>
        this.userService.getUserData().pipe(
          switchMap(response => {
            if (response.status) {
              const actions = [
                userActions.getUserDataSuccess({
                  user: response.userDetails,
                  permissions: response.permissions,
                  packages: response.packages
                })
              ];

              if (['Admin', 'Supervisor'].includes(response.userDetails.UserRole)) {
                return [
                  ...actions,
                  companyActions.getCompanyProfileRequest()
                ];
              } else {
                return [
                  ...actions,
                  companyActions.getCompanyProfileSuccess({ company: null })
                ];
              }

              return actions;
            } else {
              this.toastrService.error(response.message || 'Failed to fetch user data');
              return of(userActions.getUserDataFailure());
            }
          }),
          catchError(error => {
            this.toastrService.error(error.message || 'An error occurred while fetching user data');
            return of(userActions.getUserDataFailure());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router
  ) {}
}
