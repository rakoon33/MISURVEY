import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { companyRoleManagementActions } from '../actions';
import { CompanyRolesManagementService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
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
                this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());
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

  updateCompanyRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyRoleManagementActions.updateCompanyRoleRequest),
      mergeMap((action) =>
        this.companyRoleService
          .updateCompanyRole(
            action.roleId,
            action.roleData,
            action.permissionsData
          )
          .pipe(
            map(() => {
              this.toastrService.success('Role updated successfully!');
              this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());
              return companyRoleManagementActions.updateCompanyRoleSuccess();
            }),
            catchError((error) => {
              this.toastrService.error('Failed to update role');
              return of(
                companyRoleManagementActions.updateCompanyRoleFailure({ error })
              );
            })
          )
      )
    )
  );

  deleteCompanyRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyRoleManagementActions.deleteCompanyRoleRequest),
      mergeMap((action) =>
        this.companyRoleService.deleteCompanyRole(action.roleId).pipe(
          map((response) => {
            if (response.status) {
              this.toastrService.success('Role deleted successfully!');
              this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());
              return companyRoleManagementActions.deleteCompanyRoleSuccess();
            } else {
              this.toastrService.error(response.message || 'Deletion failed');
              return companyRoleManagementActions.deleteCompanyRoleFailure({
                error: response.message,
              });
            }
          }),
          catchError((error) => {
            this.toastrService.error('Failed to delete role');
            return of(
              companyRoleManagementActions.deleteCompanyRoleFailure({ error })
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
    private toastrService: ToastrService,
    private store: Store
  ) {}
}
