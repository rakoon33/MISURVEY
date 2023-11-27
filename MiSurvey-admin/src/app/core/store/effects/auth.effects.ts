import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { authActions } from '../actions';
import { userActions } from '../actions';

@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(authActions.loginRequest),
    switchMap((action) =>
      this.authService.login(action.username, action.password).pipe(
        concatMap((response) => {
          if (response.status) {
            // Return an array of actions
            return [
              authActions.loginSuccess({ message: response.message }),
              userActions.getUserDataRequest()
            ];
          } else {
            // Return an array with a single failure action
            return [authActions.loginFailure({ error: response.message })];
          }
        }),
        catchError((error) => {
          // Handle errors and return an array with a single error action
          return [authActions.loginFailure({ error: error.toString() })];
        })
      )
    )
  )
);

  constructor(private actions$: Actions, private authService: AuthService) {}
}
