import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, concatMap, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { authActions } from '../actions';
import { userActions } from '../actions';
import { surveyManagementActions } from '../actions';
import { companyActions } from '../actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginRequest),
      switchMap((action) =>
        this.authService.login(action.username, action.password).pipe(
          switchMap((response) => {
            if (response.status) {
              this.toastrService.success('Login successful');
              // Initiating the user data request and waiting for its success before dispatching login success
              return this.actions$.pipe(
                ofType(userActions.getUserDataSuccess), // Listening for the getUserDataSuccess action
                take(1), // Taking only one occurrence of getUserDataSuccess
                map(() => authActions.loginSuccess()), // Mapping to login success
                startWith(userActions.getUserDataRequest()) // Starting with the getUserDataRequest action
              );
            } else {
              this.toastrService.error(response.message || 'Login failed');
              return of(authActions.loginFailure());
            }
          }),
          catchError((error) => {
            this.toastrService.error(
              error.message || 'An error occurred during login'
            );
            return of(authActions.loginFailure());
          })
        )
      )
    )
  );
  

  logout$ = createEffect(() =>
  this.actions$.pipe(
    ofType(authActions.logoutRequest),
    switchMap(() =>
      this.authService.logout().pipe(
        concatMap((response) => {
          if (response.status) {
            this.toastrService.success('Logout successful');
            return [
              authActions.logoutSuccess(),
              userActions.getUserDataSuccess({ user: null, permissions: [], packages: null}),
              companyActions.getCompanyDataSuccess ({ company: null, permissions: [] }),
              surveyManagementActions.resetSurveyState(),
            ];
          } else {
            this.toastrService.error(response.message || 'Logout failed');
            return [authActions.logoutFailure()];
          }
        }),
        catchError((error) => {
          this.toastrService.error('An error occurred during logout');
          return of(authActions.logoutFailure());
        })
      )
    )
  )
);


register$ = createEffect(() =>
  this.actions$.pipe(
    ofType(authActions.registerRequest),
    concatMap((action) =>
      this.authService.register(action.userData).pipe(
        map((response) => {
          if (response.status) {
            this.toastrService.success('Registration successful');
            this.router.navigate(['/login']);
            return authActions.registerSuccess();
          } else {
            this.toastrService.error(response.message || 'Registration failed');
            return authActions.registerFailure();
          }
        }),
        catchError((error) => {
          this.toastrService.error('An error occurred during registration');
          return of(authActions.registerFailure());
        })
      )
    )
  )
);

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}
}
