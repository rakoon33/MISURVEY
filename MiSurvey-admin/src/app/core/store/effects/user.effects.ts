import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { userActions } from '../actions';

@Injectable()
export class UserEffects {
  getUserData$ = createEffect(() => this.actions$.pipe(
    ofType(userActions.getUserDataRequest),
    switchMap((action) =>
      this.userService.getUserData(action.username).pipe(
        map(user => userActions.getUserDataSuccess({ user })),
        catchError(error => of(userActions.getUserDataFailure({ error: error.message })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
