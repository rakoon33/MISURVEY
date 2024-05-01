import { Component, OnInit } from '@angular/core';
import { Permission, Company, User } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { companyManagementActions, companyActions } from 'src/app/core/store/actions';
import { companyManagementSelector, companySelector, userSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart, Event as RouterEvent, ActivatedRoute } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  currentUserId: number | undefined;
  currentUserRole: string | undefined;
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
  userPermissions$: Observable<Permission | undefined> | undefined;
  adminCompany$: Observable<Company | null> = this.store.select(companySelector.selectCurrentCompany);
  private selectedLogoFile: File | null = null;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editCompanyFormGroup = new FormGroup({
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl('', [Validators.required]),
      CreatedAt: new FormControl(''),
    });

    this.addCompanyForm = new FormGroup({
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl('', [Validators.required]),
      AdminID: new FormControl(''),
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

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('Company Management')
      ),
    ]).pipe(
      map(([currentUser, permissions]) => {
        // If the current user is a Supervisor, return their actual permissions
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        // If not, return an object with all permissions set to true
        return {
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
          CanViewData: true,
        } as Permission;
      })
    );
  }

  ngOnInit() {
    this.store.select(userSelector.selectCurrentUser).subscribe((currentUser) => {
      this.currentUserId = currentUser?.UserID;
      this.currentUserRole = currentUser?.UserRole;
      
    });
    if (this.currentUserRole === 'Admin') {
      this.store.dispatch(companyActions.getCompanyProfileRequest());
    }
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
        console.log(`Total companies received: ${totalCompanies}`);
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
    if (this.addCompanyForm.valid && this.currentUserId != null) {
      const formData = {
        ...this.addCompanyForm.value,
        CreatedAt: new Date(),
        CreatedBy: this.currentUserId,
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

  onLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedLogoFile = input.files[0];
    }
  }

  
  saveChanges() {

    if (this.editCompanyFormGroup.valid && this.currentUserId) {
      const formValue = {
        ...this.editCompanyFormGroup.value,
        UpdatedBy: this.currentUserId,
        CompanyLogo:  this.selectedLogoFile
      };

      this.store.dispatch(
        companyManagementActions.updateCompanyRequest({
          CompanyID: Number(this.currentSelectedCompanyId),
          updatedData: formValue,
        })
      );

      if(this.currentUserRole==='Admin') {
        this.store.dispatch(companyActions.getCompanyProfileRequest());
      }
    } else {
      this.toastr.error('Form is invalid or company ID is not set');
    }
  }

  exportToPdf() {
    this.companies$.subscribe(companies => {
      if (companies.length > 0) {
        const documentDefinition = this.getDocumentDefinition(companies);
        pdfMake.createPdf(documentDefinition).open();
        pdfMake.createPdf(documentDefinition).download('companies-report.pdf');
      } else {
        this.toastr.error('No companies data available to export.');
      }
    });
  }

  getDocumentDefinition(companies: Company[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();
  
    return {
      content: [
        {
          text: 'Companies Report',
          style: 'header'
        },
        this.buildCompanyTable(companies),
        {
          text: `Report generated on: ${formattedTime}`,
          style: 'subheader'
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number],
        },
        subheader: {
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
        tableCell: {
          margin: [5, 5, 5, 5] as [number, number, number, number], 
          fontSize: 11, 
        },
      }
    };
  }

  buildCompanyTable(companies: Company[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, '*', '*', '*', '*'],
        body: [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Company Name', style: 'tableHeader' },
            { text: 'Domain', style: 'tableHeader' },
            { text: 'Created At', style: 'tableHeader' },
            { text: 'Admin ID', style: 'tableHeader' },
          ],
          ...companies.map((company, index) => [
            { text: (index + 1).toString() || 'N/A', style: 'tableCell' },
            { text: company.CompanyName || 'N/A', style: 'tableCell' },
            { text: company.CompanyDomain || 'N/A', style: 'tableCell' },
            { text: company.CreatedAt ? new Date(company.CreatedAt).toLocaleDateString() : 'N/A', style: 'tableCell' },
            { text: company.AdminID ? company.AdminID.toString() : 'N/A', style: 'tableCell' },
          ])
        ]
      },
      layout: 'auto'
    };
  }

  private toggleModal(modalId: string): void {
    const action = { show: true, id: modalId };
    this.modalService.toggle(action);
  }

  deleteCompany() {
    if (this.currentSelectedCompanyId) {
      this.store.dispatch(
        companyManagementActions.deleteCompanyRequest({
          CompanyID: this.currentSelectedCompanyId,
        })
      );
      this.modalService.toggle({ show: false, id: 'deleteCompanyModal' });
    } else {
      this.toastr.error('Company ID is not available');
    }
  }
  
  openDeleteCompanyModal(CompanyID: number | undefined){
    this.currentSelectedCompanyId = CompanyID;
    this.modalService.toggle({ show: true, id: 'deleteCompanyModal' });
  }

  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}