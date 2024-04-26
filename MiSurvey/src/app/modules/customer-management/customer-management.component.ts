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
          console.log("total custmer", this.totalPages);
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
    const pageNumber = Number(page);
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= this.totalPages
    ) {
      this.currentPage = pageNumber;
      this.router.navigate(['/customer-management'], {
        queryParams: { page: pageNumber, pageSize: this.pageSize },
      });
      this.loadCustomers();
    }
  }

  onPageChangePrevious() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onPageChangeNext() {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  getPaginationRange(currentPage: number, totalPages: number, siblingCount = 1): Array<string | number> {
    let pages: Array<number | string> = [];
  
    // Xác định các trang đầu và cuối để hiển thị
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
  
    // Thêm trang đầu tiên
    pages.push(1);
  
    // Thêm dấu ba chấm ở đầu nếu cần
    if (startPage > 2) {
      pages.push('...');
    }
  
    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    // Thêm dấu ba chấm ở cuối nếu cần
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
  
    // Thêm trang cuối cùng nếu nó chưa được thêm
    if (endPage !== totalPages) {
      pages.push(totalPages);
    }
  
    // Lọc mảng để loại bỏ trùng lặp, đặc biệt nếu trang đầu tiên gần với các trang được thêm
    pages = pages.filter((value, index, self) => self.indexOf(value) === index);
  
    return pages;
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