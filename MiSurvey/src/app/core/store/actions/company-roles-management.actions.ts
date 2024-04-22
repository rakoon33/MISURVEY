import { createAction, props } from '@ngrx/store';
import { CompanyRole, Permission } from '../../models';

export const createCompanyRoleRequest = createAction(
  '[Company Role] Create Company Role Request',
  props<{
    roleData: { CompanyRoleName: string; CompanyRoleDescription: string };
    permissionsData: any[];
  }>()
);

export const createCompanyRoleSuccess = createAction(
  '[Company Role] Create Company Role Success'
);

export const createCompanyRoleFailure = createAction(
  '[Company Role] Create Company Role Failure',
  props<{ error: any }>()
);

// In your company role actions file

export const loadCompanyRolesRequest = createAction(
  '[Company Role] Load Company Roles Request'
);

export const loadCompanyRolesSuccess = createAction(
  '[Company Role] Load Company Roles Success',
  props<{ roles: CompanyRole[] }>()
);

export const loadCompanyRolesFailure = createAction(
  '[Company Role] Load Company Roles Failure',
  props<{ error: any }>()
);

export const updateCompanyRoleRequest = createAction(
  '[Company Role] Update Company Role Request',
  props<{
    roleId: number;
    roleData: { CompanyRoleName: string; CompanyRoleDescription: string };
    permissionsData: any[];
  }>()
);

export const updateCompanyRoleSuccess = createAction(
  '[Company Role] Update Company Role Success'
);

export const updateCompanyRoleFailure = createAction(
  '[Company Role] Update Company Role Failure',
  props<{ error: any }>()
);

export const deleteCompanyRoleRequest = createAction(
  '[Company Role] Delete Company Role Request',
  props<{ roleId: number }>()
);

export const deleteCompanyRoleSuccess = createAction(
  '[Company Role] Delete Company Role Success'
);

export const deleteCompanyRoleFailure = createAction(
  '[Company Role] Delete Company Role Failure',
  props<{ error: any }>()
);
