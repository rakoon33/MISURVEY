import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { userActions } from '../actions';

@Injectable()
export class UserEffects {

    getUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getUserDataRequest),
      switchMap(() => 
        this.userService.getUserData().pipe(
          map(response => response.status ? userActions.getUserDataSuccess({ user: response.data }) : userActions.getUserDataFailure({ error: response.message })),
          catchError(error => of(userActions.getUserDataFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
