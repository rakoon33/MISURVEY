import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { userManagementActions } from 'src/app/core/store/actions';
import { userManagementSelector, userSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart, Event as RouterEvent, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private subscription = new Subscription();

  totalPages: number = 1;
  totalUsers: number = 1;
  pageSize: number = 1;
  currentPage: string = '1';

  currentAction: 'view' | 'edit' | null = null;
  // to get the user id you select to update/delete
  currentSelectedUserId: number | undefined;
  // to get the user login id to fill in create by, update by,...
  currentUserId: number | undefined;

  editUserFormGroup: FormGroup;
  addUserForm: FormGroup;

  users$: Observable<User[]> = this.store.select(
    userManagementSelector.selectCurrentUsers
  );
  isLoading$: Observable<boolean> = this.store.select(
    userManagementSelector.selectIsUserManagementLoading
  );
  selectedUser$: Observable<User | null> = this.store.select(
    userManagementSelector.selectCurrentUser
  );
  userPermissions$: Observable<Permission | undefined> | undefined;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the FormGroup and set up form controls
    this.editUserFormGroup = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Gender: new FormControl(''),
      PhoneNumber: new FormControl(''),
      UserRole: new FormControl(''),
      IsActive: new FormControl(false), // Default value
      CreatedAt: new FormControl(''),
      LastLogin: new FormControl(''),
    });

    this.addUserForm = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PhoneNumber: new FormControl(''),
      UserRole: new FormControl('', [Validators.required]),
      IsActive: new FormControl('', [Validators.required]),
      Gender: new FormControl(''),
      UserPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.subscription.add(
      this.selectedUser$
        .pipe(filter((user) => user !== null))
        .subscribe((user) => {
          if (user) {
            if (this.currentAction === 'view') {
              this.toggleModal('viewUserModal');
            } else if (this.currentAction === 'edit') {
              this.loadUserDataIntoForm(user);
              this.currentSelectedUserId = user.UserID;
              this.toggleModal('editUserModal');
            }
          } else {
            this.toastr.error('Error fetching user with id');
          }
        })
    );

    this.userPermissions$ = combineLatest([
      this.store.select(userSelector.selectCurrentUser),
      this.store.select(
        userSelector.selectPermissionByModuleName('User Management')
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
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart)
    )
    .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url === '/user-management') {
          this.router.navigate(['/user-management'], {
            queryParams: { page: 1, pageSize: 10 },
            replaceUrl: true // This replaces the current state in history
          });
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] || 1;
      this.pageSize = params['pageSize'] || 10;
      this.loadUsers();
    });
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
    this.store
      .select(userSelector.selectCurrentUser)
      .subscribe((id) => (this.currentUserId = id?.UserID));
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

  loadUsers() {
    this.store.dispatch(
      userManagementActions.loadUsersRequest({
        page: Number(this.currentPage),
        pageSize: this.pageSize,
      })
    );

    this.store
      .select(userManagementSelector.selectCurrentTotalUsers)
      .subscribe((totalUsers) => {
        this.totalUsers = totalUsers;
        this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
      });
  }

  onPageChange(page: number | string) {
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    this.router.navigate(['/user-management'], {
      queryParams: { page: pageNumber, pageSize: this.pageSize },
    });
    this.loadUsers();
  }

  onPageChangeNext() {
    this.router.navigate(['/user-management'], {
      queryParams: {
        page: Number(this.currentPage) + 1,
        pageSize: this.pageSize,
      },
    });
    this.loadUsers();
  }

  onPageChangePrevious() {
    this.router.navigate(['/user-management'], {
      queryParams: {
        page: Number(this.currentPage) - 1,
        pageSize: this.pageSize,
      },
    });
    this.loadUsers();
  }

  private loadUserDataIntoForm(user: User) {
    if (this.currentAction === 'edit') {
      this.editUserFormGroup.patchValue({
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        Gender: user.Gender,
        PhoneNumber: user.PhoneNumber,
        UserRole: user.UserRole,
        IsActive: user.IsActive,
        CreatedAt: user.CreatedAt,
        LastLogin: user.LastLogin,
        UpdatedAt: user.UpdatedAt,
      });
    }
  }

  viewUser(UserID: number): void {
    if (UserID !== undefined) {
      this.currentAction = 'view';
      this.store.dispatch(
        userManagementActions.loadUserByIdRequest({ UserID })
      );
    } else {
      this.toastr.error('UserID is undefined');
    }
  }

  createUser() {
    if (this.addUserForm.valid && this.currentUserId != null) {
      const formData = {
        ...this.addUserForm.value,
        CreatedAt: new Date(),
        CreatedBy: this.currentUserId,
      };
      this.store.dispatch(
        userManagementActions.createUserRequest({ userData: formData })
      );
    } else {
      this.toastr.error('Form is not valid or user ID is not available');
    }
  }

  editUser(UserID: number): void {
    this.currentAction = 'edit';
    this.store.dispatch(userManagementActions.loadUserByIdRequest({ UserID }));
  }

  saveChanges() {
    if (this.editUserFormGroup.valid && this.currentUserId) {
      const formValue = {
        ...this.editUserFormGroup.value,
        UpdatedBy: this.currentUserId,
      };

      this.store.dispatch(
        userManagementActions.updateUserRequest({
          UserID: Number(this.currentSelectedUserId),
          userData: formValue,
        })
      );

    } else {
      this.toastr.error('Form is invalid or user ID is not set');
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
