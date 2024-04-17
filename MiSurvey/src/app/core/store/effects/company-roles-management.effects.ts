import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { companyRoleManagementActions } from '../actions';
import { CompanyRolesManagementService } from '../../services';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class CompanyRolesManagementEffects {
  createCompanyRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyRoleManagementActions.createCompanyRoleRequest),
      switchMap((action) =>
        this.companyRoleService
          .createCompanyRole(action.roleData, action.permissionsData)
          .pipe(
            map((response) => {
              if (response.status) {
                this.toastrService.success('Company role created successfully');
                return companyRoleManagementActions.createCompanyRoleSuccess();
              } else {
                this.toastrService.error(response.message || 'Creation failed');
                return companyRoleManagementActions.createCompanyRoleFailure(
                  response.message
                );
              }
            }),
            catchError((error) => {
              this.toastrService.error(
                'An error occurred while creating the company role'
              );
              return of(
                companyRoleManagementActions.createCompanyRoleFailure({
                  error,
                })
              );
            })
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
    private companyRoleService: CompanyRolesManagementService,
    private toastrService: ToastrService // Inject ToastrService
  ) {}
}
