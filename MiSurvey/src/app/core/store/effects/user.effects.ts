import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { userActions } from '../actions';
import { UserService } from '../../services';
import { Router } from '@angular/router';
@Injectable()
export class UserEffects {
  // ... other effects

  getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getUserDataRequest),
      switchMap(() => 
        this.userService.getUserData().pipe(
          map(response => {
            if (response.status) {
              this.router.navigate(['/dashboard']);
              return userActions.getUserDataSuccess({
                user: response.userDetails,
                permissions: response.permissions
              });
            } else {
              this.toastrService.error(response.message || 'Failed to fetch user data');
              return userActions.getUserDataFailure();
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
