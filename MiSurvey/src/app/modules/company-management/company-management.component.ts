import { Component, OnInit } from '@angular/core';
import { Permission, Company, User } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map, take, tap } from 'rxjs';
import { companyManagementActions, companyActions } from 'src/app/core/store/actions';
import { companyManagementSelector, companySelector, userSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart, Event as RouterEvent, ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/core/services';
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

  currentAction: 'view' | 'edit' | null = null;
  currentSelectedCompanyId: number | undefined;
  currentUserId: number | undefined;
  currentUserRole: string | undefined;
  currentCompanyId: number | undefined;
  editCompanyFormGroup: FormGroup;
  addCompanyForm: FormGroup;

  // search
  filteredCompanies$: Observable<Company[]> | undefined;
  searchText = '';
  filterType = 'name';

  currentPage = 1;
  itemsPerPage = 10;
  totalCompanies = 0;
  pages: (string | number)[] = [];

  
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
    private router: Router,
    private companyService: CompanyService
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
    if (this.currentUserRole === 'Admin' || this.currentUserRole === 'Supervisor') {
      this.store.dispatch(companyActions.getCompanyProfileRequest());
    } else {
      this.loadCompanies();
      this.applyFilters();
    }

  }

  loadCompanies() {
    this.store.dispatch(
      companyManagementActions.loadCompaniesRequest()
    );
  }

  clickToApplyFilters(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredCompanies$ = this.companies$.pipe(
      map(companies => {
        // Filter based on searchText and filterType
        const filtered = companies.filter(company => {
          if (!this.searchText) return true;
          const searchLower = this.searchText.toLowerCase();
          switch (this.filterType) {
            case 'name':
              return company.CompanyName.toLowerCase().includes(searchLower);
            case 'domain':
              return company.CompanyDomain.toLowerCase().includes(searchLower);
            default:
              return true;
          }
        });
        // Calculate total companies after filtering for pagination
        this.totalCompanies = filtered.length;
        // Update pages array based on the new total
        this.updatePagination();

        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return filtered.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }

  refreshData() {
    this.searchText = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  setFilterType(type: string) {
    this.filterType = type;
    this.applyFilters();
  }

  updatePagination() {
    const totalPageCount = Math.ceil(this.totalCompanies / this.itemsPerPage);
    const maxPagesToShow = 3; 
    let pages: (string | number)[] = [];

    // Compute the range of pages to show
    let rangeStart = Math.max(
      this.currentPage - Math.floor(maxPagesToShow / 2),
      1
    );
    let rangeEnd = Math.min(rangeStart + maxPagesToShow - 1, totalPageCount);

    // Adjust the range start if we're at the end of the page list
    if (rangeEnd === totalPageCount) {
      rangeStart = Math.max(totalPageCount - maxPagesToShow + 1, 1);
    }

    // Always add the first page and possibly an ellipsis
    if (rangeStart > 1) {
      pages.push(1);
      if (rangeStart > 2) {
        pages.push('...');
      }
    }

    // Add the calculated range of pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add an ellipsis and the last page if needed
    if (rangeEnd < totalPageCount) {
      if (rangeEnd < totalPageCount - 1) {
        pages.push('...');
      }
      pages.push(totalPageCount);
    }

    this.pages = pages;
  }

  setPage(page: string | number): void {
    if (typeof page === 'number') {
      if (page !== this.currentPage) {
        this.currentPage = page;
        this.applyFilters(); 
      }
    }
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
      this.addCompanyForm.reset();
      this.modalService.toggle({ show: false, id: 'addCompanyModal' });
    } else {
      this.toastr.error('Form is not valid or company ID is not available');
    }
  }

  editCompany(CompanyID: number): void {
    this.currentAction = 'edit';
    this.modalService.toggle({ show: true, id: 'editCompanyModal' });
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
        UpdatedBy: this.currentUserId
      };

      if (this.selectedLogoFile) {
        const formData = new FormData();
        formData.append('image', this.selectedLogoFile, this.selectedLogoFile.name);
        this.companyService.updateCompanyLogo(this.currentSelectedCompanyId!.toString(), formData).subscribe({
          next: (response) => {
            console.log('Logo updated successfully', response)
            if(this.currentUserRole==='Admin') {
              this.store.dispatch(companyActions.getCompanyProfileRequest());
            }
          },
          error: (error) => console.error('Error updating logo', error)
        });
      }

      this.store.dispatch(
        companyManagementActions.updateCompanyRequest({
          CompanyID: Number(this.currentSelectedCompanyId),
          updatedData: formValue,
        })
      );

      if(this.currentUserRole==='Admin') {
        this.store.dispatch(companyActions.getCompanyProfileRequest());
      }

      this.modalService.toggle({ show: false, id: 'editCompanyModal' });
    } else {
      this.toastr.error('Form is invalid or company ID is not set');
    }
  }

  exportToPdf() {
    this.companies$.pipe(take(1)).subscribe(companies => {
      if (companies.length > 0) {
        const documentDefinition = this.getDocumentDefinition(companies);
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