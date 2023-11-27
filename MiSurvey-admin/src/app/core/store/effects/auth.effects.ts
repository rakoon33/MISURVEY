import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
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
          map((response) => {
            if (response.status) {
              // Nếu đăng nhập thành công, cập nhật dữ liệu người dùng
              return userActions.getUserDataSuccess({ user: response.data });
            } else {
              return authActions.loginFailure({ error: response.message });
            }
          }),
          catchError((error) =>
            of(authActions.loginFailure({ error: error.toString() }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
