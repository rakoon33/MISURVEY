import { createAction, props, ActionType } from '@ngrx/store';
import { Company, Permission } from '../../models';

enum CompanyActionTypes {
    GET_COMPANY_DATA_REQUEST = '[Company] Get Company Data Request',
    GET_COMPANY_DATA_SUCCESS = '[Company] Get Company Data Success',
    GET_COMPANY_DATA_FAILURE = '[Company] Get Company Data Failure'
}

export const getCompanyDataRequest = createAction(
    CompanyActionTypes.GET_COMPANY_DATA_REQUEST
);

export const getCompanyDataSuccess = createAction(
    CompanyActionTypes.GET_COMPANY_DATA_SUCCESS,
    props<{ company: Company | null, permissions: Permission[] }>()
);

export const getCompanyDataFailure = createAction(
    CompanyActionTypes.GET_COMPANY_DATA_FAILURE,
);

export type CompanyActions =
  | ActionType<typeof getCompanyDataRequest>
  | ActionType<typeof getCompanyDataSuccess>
  | ActionType<typeof getCompanyDataFailure>;
