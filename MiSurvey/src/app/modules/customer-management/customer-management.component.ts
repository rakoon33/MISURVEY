import { CustomerService } from './../../core/services/customer-management.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Customer } from '../../core/models';
import { customerManagementSelectors } from '../../core/store/selectors';
import { customerManagementActions } from '../../core/store/actions';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Event as RouterEvent,
} from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})

export class CustomerManagementComponent implements OnInit {
  customers$: Observable<Customer[]>;
  isLoading$: Observable<boolean>;
  totalCustomers: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  selectedCustomerId: number = 0;
  editCustomerForm: FormGroup;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {
    this.customers$ = this.store.select(customerManagementSelectors.selectAllCustomers);
    this.isLoading$ = this.store.select(customerManagementSelectors.selectCustomerLoading);

    this.editCustomerForm = new FormGroup({
      FullName: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PhoneNumber: new FormControl(''),
    });
  }

  ngOnInit(): void {

    this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart)
    )
    .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/customer-management') {
          this.router.navigate(['/customer-management'], {
            queryParams: { page: 1, pageSize: 10 },
            replaceUrl: true 
          });
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page'], 10) || 1;
      this.pageSize = parseInt(params['pageSize'], 10) || 10;
      this.loadCustomers();
    });

    this.subscriptions.add(
      this.store.select(customerManagementSelectors.selectTotalCustomers).subscribe(
        total => {
          this.totalCustomers = total;
          this.totalPages = Math.ceil(this.totalCustomers / this.pageSize);
        }
      )
    );
  }

  loadCustomers(): void {
    this.store.dispatch(customerManagementActions.loadCustomers({
      page: this.currentPage,
      pageSize: this.pageSize
    }));
  }


  onPageChange(page: number | string) {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    this.router.navigate(['/customer-management'], {
      queryParams: { page: pageNumber, pageSize: this.pageSize },
    });
    this.currentPage = pageNumber;
    this.loadCustomers()
  }

  onPageChangeNext() {
    this.router.navigate(['/customer-management'], {
      queryParams: {
        page: Number(this.currentPage) + 1,
        pageSize: this.pageSize,
      },
    });
    this.loadCustomers()
  }

  onPageChangePrevious() {
    this.router.navigate(['/customer-management'], {
      queryParams: {
        page: Number(this.currentPage) - 1,
        pageSize: this.pageSize,
      },
    });
    this.loadCustomers()
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
  

  openEditModal(customerId: number): void {
    // Logic to load customer data into edit form
    this.selectedCustomerId = customerId;
    // Open the modal window
    this.modalService.toggle({ show: true, id: 'editCustomerModal' });
  }

  saveCustomerChanges(): void {
    if (this.editCustomerForm.valid) {
      const updatedCustomer = this.editCustomerForm.value;
      this.store.dispatch(customerManagementActions.updateCustomer({
        customerID: this.selectedCustomerId,
        update: updatedCustomer
      }));
    } else {
      this.toastr.error('Please check the form fields.');
    }
  }

  openViewModal(customer: number) {
    // view customer detailed
   }
 

  openDeleteModal(customerId: number): void {
    this.selectedCustomerId = customerId;
    this.modalService.toggle({ show: true, id: 'deleteCustomerModal' });
  }

  deleteCustomer(): void {
    this.store.dispatch(customerManagementActions.deleteCustomer({ customerID: this.selectedCustomerId }));
    this.modalService.toggle({ show: false, id: 'deleteCustomerModal' });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}