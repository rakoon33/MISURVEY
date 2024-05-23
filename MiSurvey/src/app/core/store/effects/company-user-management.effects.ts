import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CompanyUserManagementService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import * as companyUserManagementActions from '../actions/company-user-management.actions';
import { userManagementActions } from '../actions';
import { Store } from '@ngrx/store';

@Injectable()
export class CompanyUserManagementEffects {

    createCompanyUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyUserManagementActions.createCompanyUserRequest),
      mergeMap((action) =>
        this.companyUserManagementService.createCompanyUser(action.companyUserData, action.userData).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success(response.message);
              // Gọi action loadUsersRequest ngay sau khi tạo user thành công
              this.store.dispatch(userManagementActions.loadUsersRequest());
              return companyUserManagementActions.createCompanyUserSuccess();
            } else {
              this.toastrService.error(response.message);
              return companyUserManagementActions.createCompanyUserFailure({ error: response.message });
            }
          }),
          catchError(error => {
            this.toastrService.error(error.message);
            return of(companyUserManagementActions.createCompanyUserFailure({ error }));
          })
        )
      )
    )
  );
  

  constructor(
    private actions$: Actions,
    private companyUserManagementService: CompanyUserManagementService,
    private toastrService: ToastrService,
    private store: Store
  ) {}
}
