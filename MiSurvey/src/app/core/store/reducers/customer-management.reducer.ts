import { createReducer, on } from '@ngrx/store';
import { CustomerManagementState } from './../states';
import { customerManagementActions } from '../actions';

export const initialState: CustomerManagementState = {
  customers: [],
  totalCustomers: 0,
  loading: false,
  error: undefined
};

export const customerManagementReducer = createReducer(
  initialState,
  on(customerManagementActions.loadCustomers, state => ({ ...state, loading: true })),
  on(customerManagementActions.loadCustomersSuccess, (state, { customers, total }) => ({
    ...state,
    customers,
    totalCustomers: total,
    loading: false
  })),
  on(customerManagementActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(customerManagementActions.createCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer]
  })),
  on(customerManagementActions.createCustomerFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(customerManagementActions.updateCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: state.customers.map(c => c?.CustomerID === customer?.CustomerID ? customer : c)
  })),
  on(customerManagementActions.deleteCustomerSuccess, (state, { customerID }) => ({
    ...state,
    customers: state.customers.filter(c => c?.CustomerID !== customerID) 
  }))
);
