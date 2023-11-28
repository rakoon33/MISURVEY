import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {userManagementActions } from '../actions';
import { UserManagementService } from '../../services';

@Injectable()
export class UserManagementEffects {

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(userManagementActions.loadUsersRequest),
    switchMap(() =>
      this.userManagementService.getUsers().pipe(
        map(response => {
          if (response.status) {
            return userManagementActions.loadUsersSuccess({ response });
          } else {
            return userManagementActions.loadUsersFailure({ error: 'Failed to load users' });
          }
        }),
        catchError(error => of(userManagementActions.loadUsersFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private userManagementService: UserManagementService
  ) {}
}