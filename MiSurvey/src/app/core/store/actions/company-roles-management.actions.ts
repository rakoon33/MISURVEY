import { createAction, props } from '@ngrx/store';
import { CompanyRole, Permission } from '../../models';

export const createCompanyRoleRequest = createAction(
    '[Company Role] Create Company Role Request',
    props<{ roleData: { CompanyRoleName: string; CompanyRoleDescription: string }; permissionsData: any[] }>()
  );
  
export const createCompanyRoleSuccess = createAction(
  '[Company Role] Create Company Role Success',
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
  