import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { companyManagementActions } from '../actions';
import { CompanyManagementService } from '../../services';
import { routerSelector } from '../selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class CompanyManagementEffects {
  loadCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyManagementActions.loadCompaniesRequest),
      switchMap((action) =>
        this.companyManagementService
          .getCompanies()
          .pipe(
            map((response) => {
              console.log('API response:', response);
              if (response.status) {
                return companyManagementActions.loadCompaniesSuccess({
                  companies: response.data,
                });
              } else {
                this.toastrService.error('Failed to load companies');
                return companyManagementActions.loadCompaniesFailure();
              }
            }),
            catchError((error) => {
              console.error('API error:', error);
              this.toastrService.error(
                'An error occurred while loading companies'
              );
              return of(companyManagementActions.loadCompaniesFailure());
            })
          )
      )
    )
  );

  loadCompanyById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyManagementActions.loadCompanyByIdRequest),
      switchMap((action) =>
        this.companyManagementService.getCompanyById(action.CompanyID).pipe(
          map((response) => {
            if (response.status) {
              return companyManagementActions.loadCompanyByIdSuccess({
                company: response.data,
              });
            } else {
              this.toastrService.error('Failed to load company details');
              return companyManagementActions.loadCompanyByIdFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error(
              'An error occurred while loading company details'
            );
            return of(companyManagementActions.loadCompanyByIdFailure());
          })
        )
      )
    )
  );

  updateCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyManagementActions.updateCompanyRequest),
      switchMap((action) =>
        this.companyManagementService.updateCompany(action.CompanyID, action.updatedData)
          .pipe(
            map((response) => {
              if (response.status) {
                this.toastrService.success('Company updated successfully');
             
                this.store.dispatch(companyManagementActions.loadCompaniesRequest());
                return companyManagementActions.updateCompanySuccess({
                  company: response.data,
                });
              } else {
                this.toastrService.error(response.message || 'Update failed');
                return companyManagementActions.updateCompanyFailure();
              }
            }),
            catchError((error) => {
              this.toastrService.error('An error occurred');
              return of(companyManagementActions.updateCompanyFailure());
            })
          )
      )
    )
  );


  createCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyManagementActions.createCompanyRequest),
      switchMap((action) =>
        this.companyManagementService.createCompany(action.companyData)
          .pipe(
            map((response) => {
              if (response.status) {
                this.toastrService.success('Company created successfully');
                
                this.store.dispatch(companyManagementActions.loadCompaniesRequest());
                return companyManagementActions.createCompanySuccess();
              } else {
                this.toastrService.error(response.message || 'Creation failed');
                return companyManagementActions.createCompanyFailure();
              }
            }),
            catchError((error) => {
              this.toastrService.error('An error occurred');
              return of(companyManagementActions.createCompanyFailure());
            })
          )
      )
    )
  );


  deleteCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(companyManagementActions.deleteCompanyRequest),
      switchMap((action) =>
        this.companyManagementService.deleteCompany(action.CompanyID).pipe(
          map((response) => {
            // Check the status returned from the server
            if (response.status) {
              this.toastrService.success(response.message || 'Company deleted successfully');
              return companyManagementActions.deleteCompanySuccess({
                CompanyID: action.CompanyID,
              });
            } else {
              // Display an error message if deletion failed
              this.toastrService.error(response.message || 'Delete company failed');
              return companyManagementActions.deleteCompanyFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error('An unexpected error occurred during company deletion');
            return of(companyManagementActions.deleteCompanyFailure());
          })
        )
      )
    )
  );
  

  constructor(
    private actions$: Actions,
    private companyManagementService: CompanyManagementService,
    private toastrService: ToastrService,
    private store: Store
  ) {}
}
