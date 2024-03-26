import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { companyRoleManagementActions } from '../actions';
import { CompanyRolesManagementService } from '../../services';

@Injectable()
export class CompanyRolesManagementEffects {
  createCompanyRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyRoleManagementActions.createCompanyRoleRequest),
      switchMap(
        (
          action // Destructure the payload directly in the parameters
        ) =>
          this.companyRoleService
            .createCompanyRole(action.roleData, action.permissionsData)
            .pipe(
              map((response) =>
                companyRoleManagementActions.createCompanyRoleSuccess()
              ),
              catchError((error) =>
                of(
                  companyRoleManagementActions.createCompanyRoleFailure({
                    error,
                  })
                )
              ) 
            )
      )
    )
  );

  loadCompanyRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyRoleManagementActions.loadCompanyRolesRequest),
      switchMap(() =>
        this.companyRoleService.getAllCompanyRoles().pipe(
          map((response) =>
            companyRoleManagementActions.loadCompanyRolesSuccess({
              roles: response.data.roles,
            })
          ),
          catchError((error) =>
            of(companyRoleManagementActions.loadCompanyRolesFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyRoleService: CompanyRolesManagementService
  ) {}
}
