// customer.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CustomerManagementState } from '../states';

// Feature Selector
export const selectCustomerFeature = createFeatureSelector<CustomerManagementState>('feature_customer_management');

// Selectors for different parts of the state
const selectAllCustomers = createSelector(
    selectCustomerFeature,
    (state: CustomerManagementState) => state.customers
);

const selectCustomerLoading = createSelector(
    selectCustomerFeature,
    (state: CustomerManagementState) => state.loading
);

const selectCustomerError = createSelector(
    selectCustomerFeature,
    (state: CustomerManagementState) => state.error
);

export default  {selectAllCustomers, selectCustomerLoading, selectCustomerError }