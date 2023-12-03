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
              return userManagementActions.loadUsersSuccess({
                users: response.data,
              });
            } else {
              return userManagementActions.loadUsersFailure({
                error: response.message,
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
        this.userManagementService.getUserById(action.UserID).pipe(
          map((response) => {
            if (response.status) {
              return userManagementActions.loadUserByIdSuccess({
                user: response.data,
              });
            } else {
              return userManagementActions.loadUserByIdFailure({
                error: response.message,
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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userManagementActions.updateUserRequest),
      switchMap((action) =>
        this.userManagementService
          .updateUser(action.UserID, action.userData)
          .pipe(
            map((response) => {
              if (response.status) {
                return userManagementActions.updateUserSuccess({
                  user: response.data,
                });
              } else {
                return userManagementActions.updateUserFailure({
                  error: response.message,
                });
              }
            }),
            catchError((error) =>
              of(userManagementActions.updateUserFailure({ error }))
            )
          )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userManagementActions.createUserRequest),
      switchMap((action) =>
        this.userManagementService.createUser(action.userData).pipe(
          map((response) =>
            response.status
              ? userManagementActions.createUserSuccess()
              : userManagementActions.createUserFailure({
                  error: response.message,
                })
          ),
          catchError((error) =>
            of(
              userManagementActions.createUserFailure({ error })
            )
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
