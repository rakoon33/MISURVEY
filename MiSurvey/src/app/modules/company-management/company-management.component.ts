import { Component, OnInit } from '@angular/core';
import { Permission, Company } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { companyManagementActions } from 'src/app/core/store/actions';
import { companyManagementSelector, companySelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart, Event as RouterEvent, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss'],
})
export class CompanyManagementComponent implements OnInit {
  private subscription = new Subscription();

  totalPages: number = 1;
  totalCompanies: number = 1;
  pageSize: number = 1;
  currentPage: string = '1';
  currentAction: 'view' | 'edit' | null = null;
  currentSelectedCompanyId: number | undefined;
  currentCompanyId: number | undefined;
  editCompanyFormGroup: FormGroup;
  addCompanyForm: FormGroup;

  companies$: Observable<Company[]> = this.store.select(
    companyManagementSelector.selectCurrentCompanies
  );
  isLoading$: Observable<boolean> = this.store.select(
    companyManagementSelector.selectIsCompanyManagementLoading
  );
  selectedCompany$: Observable<Company | null> = this.store.select(
    companyManagementSelector.selectCurrentCompany
  );
  companyPermissions$: Observable<Permission | undefined> | undefined;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editCompanyFormGroup = new FormGroup({
      CompanyLogo: new FormControl(''),
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl(''),
    });

    this.addCompanyForm = new FormGroup({
      CompanyLogo: new FormControl(''),
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl(''),
    });

    this.subscription.add(
      this.selectedCompany$
        .pipe(filter((company) => company !== null))
        .subscribe((company) => {
          if (company) {
            if (this.currentAction === 'view') {
              this.toggleModal('viewCompanyModal');
            } else if (this.currentAction === 'edit') {
              this.loadCompanyDataIntoForm(company);
              this.currentSelectedCompanyId = company.CompanyID;
              this.toggleModal('editCompanyModal');
            }
          } else {
            this.toastr.error('Error fetching company with id');
          }
        })
    );

    // this.companyPermissions$ = combineLatest([
    //   this.store.select(companySelector.selectCurrentCompany),
    //   this.store.select(
    //     companySelector.selectPermissionByModuleName('Company Management')
    //   ),
    // ]).pipe(
    //   map(([currentCompany, permissions]) => {
    //     // If the current user is a Supervisor, return their actual permissions
    //     if (currentCompany?.UserRole === 'Supervisor') {
    //       return permissions;
    //     }
    //     // If not, return an object with all permissions set to true
    //     return {
    //       CanView: true,
    //       CanAdd: true,
    //       CanUpdate: true,
    //       CanDelete: true,
    //       CanExport: true,
    //       CanViewData: true,
    //     } as Permission;
    //   })
    // );
  }

  ngOnInit() {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart)
    )
    .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/company-management') {
          this.router.navigate(['/company-management'], {
            queryParams: { page: 1, pageSize: 10 },
            replaceUrl: true // This replaces the current state in history
          });
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] || 1;
      this.pageSize = params['pageSize'] || 10;
      this.loadCompanies();
    });
    this.totalPages = Math.ceil(this.totalCompanies / this.pageSize);
    this.store
      .select(companySelector.selectCurrentCompany)
      .subscribe((id) => (this.currentCompanyId = id?.CompanyID));
  }

  getPaginationRange(
    currentPageStr: string,
    totalPages: number,
    siblingCount = 1
  ): Array<number | string> {
    const currentPage = parseInt(currentPageStr, 10);
    const range = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    range.push(1);

    if (shouldShowLeftDots) {
      range.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (shouldShowRightDots) {
      range.push('...');
    }

    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  }

  loadCompanies() {
    this.store.dispatch(
      companyManagementActions.loadCompaniesRequest({
        page: Number(this.currentPage),
        pageSize: this.pageSize,
      })
    );

    this.store
      .select(companyManagementSelector.selectCurrentTotalCompanies)
      .subscribe((totalCompanies) => {
        this.totalCompanies = totalCompanies;
        this.totalPages = Math.ceil(this.totalCompanies / this.pageSize);
      });
  }

  onPageChange(page: number | string) {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    this.router.navigate(['/company-management'], {
      queryParams: { page: pageNumber, pageSize: this.pageSize },
    });
    this.loadCompanies();
  }

  onPageChangeNext() {
    this.router.navigate(['/company-management'], {
      queryParams: {
        page: Number(this.currentPage) + 1,
        pageSize: this.pageSize,
      },
    });
    this.loadCompanies();
  }

  onPageChangePrevious() {
    this.router.navigate(['/company-management'], {
      queryParams: {
        page: Number(this.currentPage) - 1,
        pageSize: this.pageSize,
      },
    });
    this.loadCompanies();
  }

  private loadCompanyDataIntoForm(company: Company) {
    if (this.currentAction === 'edit') {
      this.editCompanyFormGroup.patchValue({
        CompanyLogo: company.CompanyLogo,
        CompanyName: company.CompanyName,
        CompanyDomain: company.CompanyDomain,
        CreatedAt: company.CreatedAt,
      });
    }
  }

  viewCompany(CompanyID: number): void {
    if (CompanyID !== undefined) {
      this.currentAction = 'view';
      this.store.dispatch(
        companyManagementActions.loadCompanyByIdRequest({ CompanyID })
      );
    } else {
      this.toastr.error('CompanyID is undefined');
    }
  }

  createCompany() {
    if (this.addCompanyForm.valid && this.currentCompanyId != null) {
      const formData = {
        ...this.addCompanyForm.value,
        CreatedAt: new Date(),
        CreatedBy: this.currentCompanyId,
      };
      this.store.dispatch(
        companyManagementActions.createCompanyRequest({ companyData: formData })
      );
    } else {
      this.toastr.error('Form is not valid or company ID is not available');
    }
  }

  editCompany(CompanyID: number): void {
    this.currentAction = 'edit';
    this.store.dispatch(companyManagementActions.loadCompanyByIdRequest({ CompanyID }));
  }

  saveChanges() {
    if (this.editCompanyFormGroup.valid && this.currentCompanyId) {
      const formValue = {
        ...this.editCompanyFormGroup.value,
        UpdatedBy: this.currentCompanyId,
      };

      this.store.dispatch(
        companyManagementActions.updateCompanyRequest({
          CompanyID: Number(this.currentSelectedCompanyId),
          updatedData: formValue,
        })
      );

    } else {
      // Handle form invalid or company ID not set
      this.toastr.error('Form is invalid or company ID is not set');
    }
  }

  private toggleModal(modalId: string): void {
    const action = { show: true, id: modalId };
    this.modalService.toggle(action);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}