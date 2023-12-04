import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { userManagementActions } from '../actions';
import { UserManagementService } from '../../services';

@Injectable()
export class UserManagementEffects {
  loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(userManagementActions.loadUsersRequest),
    switchMap((action) =>
      this.userManagementService.getUsers(action.page, action.pageSize).pipe(
        map((response) => {
          if (response.status) {
            return userManagementActions.loadUsersSuccess({
              users: response.data,
              totalUsers: response.total,
            });
          } else {
            this.toastrService.error('Failed to load users');
            return userManagementActions.loadUsersFailure();
          }
        }),
        catchError((error) => {
          this.toastrService.error('An error occurred while loading users');
          return of(userManagementActions.loadUsersFailure());
        })
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
              this.toastrService.error('Failed to load user details');
              return userManagementActions.loadUserByIdFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error(
              'An error occurred while loading user details'
            );
            return of(userManagementActions.loadUserByIdFailure());
          })
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
                this.toastrService.success('User updated successfully');
                return userManagementActions.updateUserSuccess({
                  user: response.data,
                });
              } else {
                this.toastrService.error(response.message || 'Update failed');
                return userManagementActions.updateUserFailure();
              }
            }),
            catchError((error) => {
              this.toastrService.error('An error occurred');
              return of(userManagementActions.updateUserFailure());
            })
          )
      )
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userManagementActions.createUserRequest),
      switchMap((action) =>
        this.userManagementService.createUser(action.userData).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success('User created successfully');
              return userManagementActions.createUserSuccess();
            } else {
              this.toastrService.error(response.message || 'Creation failed');
              return userManagementActions.createUserFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('An error occurred');
            return of(userManagementActions.createUserFailure());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userManagementService: UserManagementService,
    private toastrService: ToastrService
  ) {}
}
