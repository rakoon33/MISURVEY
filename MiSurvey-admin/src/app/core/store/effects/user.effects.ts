import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services';
import { userActions } from '../actions';

@Injectable()
export class UserEffects {
  
  login$ = createEffect(() =>

    this.actions$.pipe(
      ofType(userActions.loginRequest),
      switchMap((action) =>
        this.authService.login(action.username, action.password).pipe(
          map((user) => userActions.loginSuccess({ user })),
          catchError((error) => of(userActions.loginFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}

