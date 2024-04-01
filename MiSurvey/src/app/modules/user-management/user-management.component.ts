import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, CompanyRole } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { companyRoleManagementActions, companyUserManagementActions, userManagementActions } from 'src/app/core/store/actions';
import { companyRolesManagementSelectors, userManagementSelector, userSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationStart, Event as RouterEvent, ActivatedRoute } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  currentUserRole: string | undefined;
  currentUserRoleId: string = '0';

  editUserFormGroup: FormGroup;
  addUserForm: FormGroup;
  companyInfoFormGroup: FormGroup;
  companyRoleFormGroup: FormGroup;
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

  roles$: Observable<CompanyRole[]> = this.store.select(
    companyRolesManagementSelectors.selectAllCompanyRoles
  );
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

    this.companyInfoFormGroup = new FormGroup({
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl(''), 
    });

    this.companyRoleFormGroup = new FormGroup({
      CompanyRoleID: new FormControl('', [Validators.required])
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

    this.companyRoleFormGroup.get('CompanyRoleID')!.valueChanges.subscribe(value => {
      this.currentUserRoleId = value;
    });
    
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


    this.store.select(userSelector.selectCurrentUser).subscribe((currentUser) => {
      this.currentUserId = currentUser?.UserID;
      if (currentUser?.UserRole === 'Admin' || currentUser?.UserRole === 'Supervisor') {
        // Lưu vai trò người dùng hiện tại để sử dụng sau này
        this.currentUserRole = currentUser?.UserRole;
  
        if (this.currentUserRole === 'Admin' || this.currentUserRole === 'Supervisor') {
          this.addUserForm.get('UserRole')?.setValue('Supervisor');
          this.addUserForm.get('UserRole')?.disable();
        }

      }
    });
    
    this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());
    
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
      
      if (this.currentUserRole === 'Admin' || this.currentUserRole === 'Supervisor') {

        const formData = {
          ...this.addUserForm.value,
          CreatedAt: new Date(),
          CreatedBy: this.currentUserId,
          UserRole: 'Supervisor',
        };
      
        this.store.dispatch(
          companyUserManagementActions.createCompanyUserRequest({
            companyUserData: {
              CompanyRoleID: parseInt(this.currentUserRoleId)
            },
            userData: formData
          })
        );
      } else {
        // Xử lý cho các vai trò người dùng khác
        this.store.dispatch(
          userManagementActions.createUserRequest({ userData: formData })
        );
      }
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

  exportToPdf() {
    this.users$.subscribe(users => {
      if (users.length > 0) {
        const documentDefinition = this.getDocumentDefinition(users);
        pdfMake.createPdf(documentDefinition).open();
        pdfMake.createPdf(documentDefinition).download('users-report.pdf');
      } else {
        this.toastr.error('No users data available to export.');
      }
    });
  }

  getDocumentDefinition(users: User[]) {
    return {
      content: [
        {
          text: 'Users Report',
          style: 'header'
        },
        this.buildUserTable(users),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number] // left, top, right, bottom
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    };
  }

  buildUserTable(users: User[]) {
    return {
      table: {
        headerRows: 1,
        widths: [100, 'auto', 'auto', '*', 'auto'],
        body: [
          [
            { text: 'Username', style: 'tableHeader' },
            { text: 'First Name', style: 'tableHeader' },
            { text: 'Last Name', style: 'tableHeader' },
            { text: 'Email', style: 'tableHeader' },
            { text: 'Role', style: 'tableHeader' },
          ],
          ...users.map(user => [
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            user.UserRole,
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
