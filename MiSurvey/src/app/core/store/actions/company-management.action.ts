import { ActionType, createAction, props } from '@ngrx/store';
import { Company } from '../../models';

enum CompanyManagementActionTypes {
  LOAD_COMPANIES_REQUEST = '[Company Management] Load Companies Request',
  LOAD_COMPANIES_SUCCESS = '[Company Management] Load Companies Success',
  LOAD_COMPANIES_FAILURE = '[Company Management] Load Companies Failure',

  LOAD_COMPANY_BY_ID_REQUEST = '[Company Management] Load Company By ID Request',
  LOAD_COMPANY_BY_ID_SUCCESS = '[Company Management] Load Company By ID Success',
  LOAD_COMPANY_BY_ID_FAILURE = '[Company Management] Load Company By ID Failure',

  UPDATE_COMPANY_REQUEST = '[Company Management] Update Company Request',
  UPDATE_COMPANY_SUCCESS = '[Company Management] Update Company Success',
  UPDATE_COMPANY_FAILURE = '[Company Management] Update Company Failure',

  CREATE_COMPANY_REQUEST = '[Company Management] Create Company Request',
  CREATE_COMPANY_SUCCESS = '[Company Management] Create Company Success',
  CREATE_COMPANY_FAILURE = '[Company Management] Create Company Failure',
}

export const loadCompaniesRequest = createAction(
    CompanyManagementActionTypes.LOAD_COMPANIES_REQUEST,
    props<{ page: number, pageSize: number }>()
);
export const loadCompaniesSuccess = createAction(
    CompanyManagementActionTypes.LOAD_COMPANIES_SUCCESS,
    props<{ companies: Company[], totalCompanies: number }>()
);
export const loadCompaniesFailure = createAction(
    CompanyManagementActionTypes.LOAD_COMPANIES_FAILURE,
);

export const loadCompanyByIdRequest = createAction(
    CompanyManagementActionTypes.LOAD_COMPANY_BY_ID_REQUEST,
    props<{ CompanyID: number }>()
);

export const loadCompanyByIdSuccess = createAction(
    CompanyManagementActionTypes.LOAD_COMPANY_BY_ID_SUCCESS,
    props<{ company: Company }>()
);

export const loadCompanyByIdFailure = createAction(
    CompanyManagementActionTypes.LOAD_COMPANY_BY_ID_FAILURE,
);

export const createCompanyRequest = createAction(
    CompanyManagementActionTypes.CREATE_COMPANY_REQUEST,
    props<{ companyData: Company }>()
);

export const createCompanySuccess = createAction(
    CompanyManagementActionTypes.CREATE_COMPANY_SUCCESS
);

export const createCompanyFailure = createAction(
    CompanyManagementActionTypes.CREATE_COMPANY_FAILURE,
);

export const updateCompanyRequest = createAction(
    CompanyManagementActionTypes.UPDATE_COMPANY_REQUEST,
    props<{ CompanyID: number; updatedData: Company }>()
);
export const updateCompanySuccess = createAction(
    CompanyManagementActionTypes.UPDATE_COMPANY_SUCCESS,
    props<{ company: Company }>() 
);
export const updateCompanyFailure = createAction(
    CompanyManagementActionTypes.UPDATE_COMPANY_FAILURE,
);

export type CompanyManagementActions =
  | ActionType<typeof loadCompaniesRequest>
  | ActionType<typeof loadCompaniesSuccess>
  | ActionType<typeof loadCompaniesFailure>
  | ActionType<typeof loadCompanyByIdRequest>
  | ActionType<typeof loadCompanyByIdSuccess>
  | ActionType<typeof loadCompanyByIdFailure>
  | ActionType<typeof updateCompanyRequest>
  | ActionType<typeof updateCompanySuccess>
  | ActionType<typeof updateCompanyFailure>;
