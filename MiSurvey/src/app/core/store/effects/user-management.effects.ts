import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { userManagementActions } from '../actions';
import { UserManagementService } from '../../services';

@Injectable()
export class UserManagementEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userManagementActions.loadUsersRequest),
      switchMap(() =>
        this.userManagementService.getUsers().pipe(
          map((response) => {
            if (response.status) {
              // Trích xuất và gửi chỉ mảng users nếu status là true
              return userManagementActions.loadUsersSuccess({
                users: response.data,
              });
            } else {
              return userManagementActions.loadUsersFailure({
                error: 'Failed to load users',
              });
            }
          }),
          catchError((error) =>
            of(userManagementActions.loadUsersFailure({ error }))
          )
        )
      )
    )
  );
  loadUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userManagementActions.loadUserByIdRequest),
      switchMap((action) =>
        this.userManagementService.getUserById(action.userId).pipe(
          map((response) => {
            if (response.status) {
              return userManagementActions.loadUserByIdSuccess({
                user: response.user,
              });
            } else {
              return userManagementActions.loadUserByIdFailure({
                error: 'User not found or request failed',
              });
            }
          }),
          catchError((error) =>
            of(userManagementActions.loadUserByIdFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userManagementService: UserManagementService
  ) {}
}
