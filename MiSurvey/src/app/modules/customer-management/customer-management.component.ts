import { CustomerService } from './../../core/services/customer-management.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Observable,
  Subscription,
  combineLatest,
  filter,
  map,
  take,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Customer, Permission } from '../../core/models';
import {
  customerManagementSelectors,
  userSelector,
} from '../../core/store/selectors';
import { customerManagementActions } from '../../core/store/actions';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {
  customers$: Observable<Customer[]>;
  isLoading$: Observable<boolean>;

  selectedCustomerId: number = 0;
  editCustomerForm: FormGroup;

  viewedCustomer: Customer | null = null;

  userPermissions$: Observable<Permission | undefined> | undefined;

  private subscriptions: Subscription = new Subscription();

  //search
  filteredCustomers$: Observable<Customer[]> | undefined;
  totalCustomers: number = 10;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pages: (string | number)[] = [];
  searchText: string = '';
  filterType: string = 'FullName'; // Default filter type

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {
    this.customers$ = this.store.select(
      customerManagementSelectors.selectAllCustomers
    );
    this.isLoading$ = this.store.select(
      customerManagementSelectors.selectCustomerLoading
    );

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('Customer Management')
      ),
    ]).pipe(
      map(([currentUser, permissions]) => {
        if (currentUser?.UserRole === 'Supervisor') {
          return permissions;
        }
        return {
          CanViewData: true,
          CanView: true,
          CanAdd: true,
          CanUpdate: true,
          CanDelete: true,
          CanExport: true,
        } as Permission;
      })
    );

    this.editCustomerForm = new FormGroup({
      FullName: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.email]),
      PhoneNumber: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(customerManagementActions.loadCustomers());
    this.applyFilters();
  }

  clickToApplyFilters(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  setFilterType(type: string): void {
    this.filterType = type;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCustomers$ = this.customers$.pipe(
      map(customers => customers.filter(customer => {
        const searchTextLower = this.searchText.toLowerCase();
        switch (this.filterType) {
          case 'FullName':
            return customer.FullName.toLowerCase().includes(searchTextLower);
          case 'Email':
            return customer.Email.toLowerCase().includes(searchTextLower);
          case 'PhoneNumber':
            return customer.PhoneNumber!.toLowerCase().includes(searchTextLower);
          default:
            return true;
        }
      })),
      map(customers => {
        // Calculate total number of pages based on the filtered customers
        this.totalCustomers = customers.length;
        this.pages = Array.from({length: Math.ceil(this.totalCustomers / this.itemsPerPage)}, (_, i) => i + 1);
  
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return customers.slice(startIndex, endIndex);
      })
    );
  }

  updatePagination() {
    const totalPageCount = Math.ceil(this.totalCustomers / this.itemsPerPage);
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

  refreshData(): void {
    this.searchText = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  loadCustomers(): void {
    this.store.dispatch(customerManagementActions.loadCustomers());
  }

  openEditModal(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.customerService.getCustomerById(customerId).subscribe({
      next: (response) => {
        if (response.status) {
          const customer = response.customer;
          this.editCustomerForm.patchValue({
            FullName: customer.FullName,
            Email: customer.Email,
            PhoneNumber: customer.PhoneNumber,
          });

          // Open the modal window
          this.modalService.toggle({ show: true, id: 'editCustomerModal' });
        } else {
          this.toastr.error(
            response.message || 'Failed to fetch customer details'
          );
        }
      },
      error: (err) => {
        this.toastr.error('Error fetching customer details');
        console.error(err);
      },
    });
  }

  saveCustomerChanges(): void {
    if (this.editCustomerForm.valid) {
      const updatedCustomer = this.editCustomerForm.value;
      this.store.dispatch(
        customerManagementActions.updateCustomer({
          customerID: this.selectedCustomerId,
          update: updatedCustomer,
        })
      );
      this.loadCustomers();
      this.modalService.toggle({ show: false, id: 'editCustomerModal' });
    } else {
      this.toastr.error('Please check the form fields.');
    }
  }

  openViewModal(customerId: number): void {
    this.customerService.getCustomerById(customerId).subscribe({
      next: (response) => {
        if (response.status) {
          this.viewedCustomer = response.customer;
          this.modalService.toggle({ show: true, id: 'viewCustomerModal' });
        } else {
          this.toastr.error(
            response.message || 'Failed to fetch customer details'
          );
        }
      },
      error: (err) => {
        this.toastr.error('Failed to fetch customer details');
      },
    });
  }

  openDeleteModal(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.modalService.toggle({ show: true, id: 'deleteCustomerModal' });
  }

  deleteCustomer(): void {
    this.store.dispatch(
      customerManagementActions.deleteCustomer({
        customerID: this.selectedCustomerId,
      })
    );
    this.loadCustomers();
    this.modalService.toggle({ show: false, id: 'deleteCustomerModal' });
  }

  exportToPdf() {
    this.customers$.pipe(take(1)).subscribe((customers) => {
      if (customers.length > 0) {
        const documentDefinition = this.getDocumentDefinition(customers);
        pdfMake.createPdf(documentDefinition).download('customers-report.pdf');
      } else {
        this.toastr.error('No customers data available to export.');
      }
    });
  }

  getDocumentDefinition(customers: Customer[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();

    return {
      content: [
        {
          text: 'Customer Report',
          style: 'header',
        },
        this.buildCustomerTable(customers),
        {
          text: `Report generated on: ${formattedTime}`,
          style: 'subheader',
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
          fontSize: 12,
          color: 'black',
        },
      },
    };
  }

  buildCustomerTable(customers: Customer[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, 150, 150, 100, 'auto'],
        body: [
          [
            { text: 'NO', style: 'tableHeader' },
            { text: 'Full Name', style: 'tableHeader' },
            { text: 'Email', style: 'tableHeader' },
            { text: 'Phone Number', style: 'tableHeader' },
            { text: 'Created At', style: 'tableHeader' },
          ],
          ...customers.map((customer, index) => [
            (index + 1).toString(),
            customer.FullName || '',
            customer.Email || '',
            customer.PhoneNumber || '',
            customer.CreatedAt
              ? new Date(customer.CreatedAt).toLocaleDateString()
              : '',
          ]),
        ],
      },
      layout: 'auto',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
