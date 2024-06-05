import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { CustomerService } from '../../services';
import { customerManagementActions } from '../actions';
import { Store } from '@ngrx/store';

@Injectable()
export class CustomerManagementEffects {
  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private store: Store
  ) {}

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerManagementActions.loadCustomers),
      mergeMap((action) =>
        this.customerService.getAllCustomers().pipe(
          map((data) =>
            customerManagementActions.loadCustomersSuccess({
              customers: data.customers
            })
          ),
          catchError((error) =>
            of(customerManagementActions.loadCustomersFailure({ error }))
          )
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerManagementActions.createCustomer),
      mergeMap((action) =>
        this.customerService.createCustomer(action.customer).pipe(
          map((customer) => {
            this.toastr.success('Customer created successfully');
            return customerManagementActions.createCustomerSuccess({
              customer,
            });
          }),
          catchError((error) => {
            this.toastr.error('Failed to create customer');
            return of(
              customerManagementActions.createCustomerFailure({ error })
            );
          })
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerManagementActions.updateCustomer),
      mergeMap((action) =>
        this.customerService
          .updateCustomer(action.customerID, action.update)
          .pipe(
            map((response) => {
              if (response.status) {
                this.toastr.success('Customer updated successfully');
                this.store.dispatch(customerManagementActions.loadCustomers());
                return customerManagementActions.updateCustomerSuccess({
                  customer: response.customer,
                });
              } else {
                this.toastr.error(response.message || 'Failed to update customer');
                return customerManagementActions.updateCustomerFailure({
                  error: response.message || 'Failed to update customer',
                });
              }
            }),
            catchError((error) => {
              this.toastr.error('Failed to update customer');
              return of(
                customerManagementActions.updateCustomerFailure({ error })
              );
            })
          )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerManagementActions.deleteCustomer),
      mergeMap((action) =>
        this.customerService.deleteCustomer(action.customerID).pipe(
          map((response) => {
            if (response.status) {
              this.toastr.success('Customer deleted successfully');
              this.store.dispatch(customerManagementActions.loadCustomers());
              return customerManagementActions.deleteCustomerSuccess({
                customerID: action.customerID,
              });
            } else {
              this.toastr.error(
                response.message || 'Failed to delete customer'
              );
              return customerManagementActions.deleteCustomerFailure({
                error: response.message,
              });
            }
          }),
          catchError((error) => {
            this.toastr.error('Failed to delete customer');
            return of(
              customerManagementActions.deleteCustomerFailure({ error })
            );
          })
        )
      )
    )
  );
}
