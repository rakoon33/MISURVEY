import { createAction, props } from '@ngrx/store';
import {Customer} from '../../models';
export enum CustomerActionTypes {
    LOAD_CUSTOMERS = '[Customer] Load Customers',
    LOAD_CUSTOMERS_SUCCESS = '[Customer] Load Customers Success',
    LOAD_CUSTOMERS_FAILURE = '[Customer] Load Customers Failure',
    CREATE_CUSTOMER = '[Customer] Create Customer',
    CREATE_CUSTOMER_SUCCESS = '[Customer] Create Customer Success',
    CREATE_CUSTOMER_FAILURE = '[Customer] Create Customer Failure',
    UPDATE_CUSTOMER = '[Customer] Update Customer',
    UPDATE_CUSTOMER_SUCCESS = '[Customer] Update Customer Success',
    UPDATE_CUSTOMER_FAILURE = '[Customer] Update Customer Failure',
    DELETE_CUSTOMER = '[Customer] Delete Customer',
    DELETE_CUSTOMER_SUCCESS = '[Customer] Delete Customer Success',
    DELETE_CUSTOMER_FAILURE = '[Customer] Delete Customer Failure'
}

export const loadCustomers = createAction(
    CustomerActionTypes.LOAD_CUSTOMERS
);

export const loadCustomersSuccess = createAction(
    CustomerActionTypes.LOAD_CUSTOMERS_SUCCESS,
    props<{ customers: Customer[] }>() 
);

export const loadCustomersFailure = createAction(
    CustomerActionTypes.LOAD_CUSTOMERS_FAILURE,
    props<{ error: string }>()
);

export const createCustomer = createAction(
    CustomerActionTypes.CREATE_CUSTOMER,
    props<{ customer: Customer }>()
);

export const createCustomerSuccess = createAction(
    CustomerActionTypes.CREATE_CUSTOMER_SUCCESS,
    props<{ customer: Customer }>()
);

export const createCustomerFailure = createAction(
    CustomerActionTypes.CREATE_CUSTOMER_FAILURE,
    props<{ error: string }>()
);

export const updateCustomer = createAction(
    CustomerActionTypes.UPDATE_CUSTOMER,
    props<{ customerID: number, update: Customer }>()
);

export const updateCustomerSuccess = createAction(
    CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS,
    props<{ customer: Customer }>()
);

export const updateCustomerFailure = createAction(
    CustomerActionTypes.UPDATE_CUSTOMER_FAILURE,
    props<{ error: string }>()
);

export const deleteCustomer = createAction(
    CustomerActionTypes.DELETE_CUSTOMER,
    props<{ customerID: number }>()
);

export const deleteCustomerSuccess = createAction(
    CustomerActionTypes.DELETE_CUSTOMER_SUCCESS,
    props<{ customerID: number }>()
);

export const deleteCustomerFailure = createAction(
    CustomerActionTypes.DELETE_CUSTOMER_FAILURE,
    props<{ error: string }>()
);
