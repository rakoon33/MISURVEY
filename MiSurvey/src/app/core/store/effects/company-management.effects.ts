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
        this.companyManagementService.getCompanies(action.page, action.pageSize).pipe(
          map((response) => {
            console.log('API response:', response);
            if (response.status) {
              return companyManagementActions.loadCompaniesSuccess({
                companies: response.data,
                totalCompanies: response.total,
              });
            } else {
              this.toastrService.error('Failed to load companies');
              return companyManagementActions.loadCompaniesFailure();
            }
          }),
          catchError((error) => {
            console.error('API error:', error);
            this.toastrService.error('An error occurred while loading companies');
            return of(companyManagementActions.loadCompaniesFailure());
          })
        )
      )
    )
  );

  loadUserById$ = createEffect(() =>
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
              this.toastrService.error('Failed to load user details');
              return companyManagementActions.loadCompanyByIdFailure();
            }
          }),
          catchError((error) => {
            this.toastrService.error(
              'An error occurred while loading user details'
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
        this.store.select(routerSelector.selectCurrentRoute).pipe(
          take(1),
          switchMap((route) => {
            const page = route.root.queryParams['page'] || '1';
            const pageSize = route.root.queryParams['pageSize'] || '10';
            return this.companyManagementService
              .updateCompany(action.CompanyID, action.updatedData)
              .pipe(
                map((response) => {
                  if (response.status) {
                    this.toastrService.success('User updated successfully');
                    this.store.dispatch(
                        companyManagementActions.loadCompaniesRequest({
                        page: Number(page),
                        pageSize: Number(pageSize),
                      })
                    );
                    return companyManagementActions.updateCompanySuccess({
                      company: response.data,
                    });
                  } else {
                    this.toastrService.error(
                      response.message || 'Update failed'
                    );
                    return companyManagementActions.updateCompanyFailure();
                  }
                }),
                catchError((error) => {
                  this.toastrService.error('An error occurred');
                  return of(companyManagementActions.updateCompanyFailure());
                })
              );
          })
        )
      )
    )
  );

  createUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(companyManagementActions.createCompanyRequest),
    switchMap((action) => 
      this.store.select(routerSelector.selectCurrentRoute).pipe(
        take(1), 
        switchMap(route => {
          const page = route.root.queryParams['page'] || '1'; 
          const pageSize = route.root.queryParams['pageSize'] || '10'; 

          return this.companyManagementService.createCompany(action.companyData).pipe(
            map((response) => {
              if (response.status) {
                this.toastrService.success('User created successfully');
                this.store.dispatch(
                    companyManagementActions.loadCompaniesRequest({
                    page: Number(page),
                    pageSize: Number(pageSize),
                  })
                );
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
