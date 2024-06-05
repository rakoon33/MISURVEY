import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, CompanyRole } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import {
  Observable,
  Subscription,
  combineLatest,
  filter,
  forkJoin,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import {
  companyRoleManagementActions,
  companyUserManagementActions,
  userManagementActions,
} from 'src/app/core/store/actions';
import {
  companyRolesManagementSelectors,
  userManagementSelector,
  userSelector,
} from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Router,
  NavigationStart,
  Event as RouterEvent,
  ActivatedRoute,
} from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  IndividualPermissionsService,
  AuthService,
} from 'src/app/core/services';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private subscription = new Subscription();

  currentAction: 'view' | 'edit' | null = null;
  // to get the user id you select to update/delete
  currentSelectedUserId: number | undefined;
  // to get the user login id to fill in create by, update by,...
  currentUserId: number | undefined;
  currentUserRole: string | undefined;
  currentUserRoleId: string = '0';

  originalPermissions: any[] = [];

  permissionsForm: FormGroup;
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

  IndividualPermissions$: Observable<any[]> | undefined;
  currentCompanyUserId: any;

  // search
  filteredUsers$: Observable<User[]> | undefined;
  currentPage = 1;
  itemsPerPage = 10;
  totalUsers = 0;
  pages: (string | number)[] = [];

  filterType = 'name'; // Default filter type
  searchText = '';

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private permissionsService: IndividualPermissionsService,
    private authService: AuthService
  ) {
    this.permissionsForm = this.fb.group({
      permissions: this.fb.array([]),
    });
    // Initialize the FormGroup and set up form controls
    this.editUserFormGroup = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Gender: new FormControl(''),
      PhoneNumber: new FormControl(''),
      UserRole: new FormControl(''),
      IsActive: new FormControl(true),
      CreatedAt: new FormControl(''),
      LastLogin: new FormControl(''),
    });

    this.addUserForm = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PhoneNumber: new FormControl(''),
      UserRole: new FormControl('SuperAdmin', [Validators.required]),
      IsActive: new FormControl('', [Validators.required]),
      Gender: new FormControl(''),
      UserPassword: new FormControl('', [
        Validators.required,
        this.validatePassword,
      ]),
    });

    this.companyInfoFormGroup = new FormGroup({
      CompanyName: new FormControl('', [Validators.required]),
      CompanyDomain: new FormControl(''),
    });

    this.companyRoleFormGroup = new FormGroup({
      CompanyRoleID: new FormControl('', [Validators.required]),
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

    this.companyRoleFormGroup
      .get('CompanyRoleID')!
      .valueChanges.subscribe((value) => {
        this.currentUserRoleId = value;
      });
  }

  ngOnInit() {
    this.loadUsers();

    this.applyFilters();

    this.store
      .select(userSelector.selectCurrentUser)
      .subscribe((id) => (this.currentUserId = id?.UserID));

    this.store
      .select(userSelector.selectCurrentUser)
      .subscribe((currentUser) => {
        this.currentUserId = currentUser?.UserID;

        if (
          currentUser?.UserRole === 'Admin' ||
          currentUser?.UserRole === 'Supervisor'
        ) {
          // Lưu vai trò người dùng hiện tại để sử dụng sau này
          this.currentUserRole = currentUser?.UserRole;
          if (
            this.currentUserRole === 'Admin' ||
            this.currentUserRole === 'Supervisor'
          ) {
            this.addUserForm.get('UserRole')?.setValue('Supervisor');
            this.addUserForm.get('UserRole')?.disable();
          }
        } else {
          this.currentUserRole = currentUser?.UserRole;
        }
      });
    this.store.dispatch(companyRoleManagementActions.loadCompanyRolesRequest());

    this.roles$.subscribe((roles) => {
      if (roles && roles.length > 0) {
        this.companyRoleFormGroup
          .get('CompanyRoleID')
          ?.setValue(roles[0].CompanyRoleID);
      }
    });
  }

  applyFilters() {
    this.filteredUsers$ = this.users$.pipe(
      map(users => users.filter(user => {
        let matchesFilter = true;
  
        switch (this.filterType) {
          case 'name':
            matchesFilter = this.searchText ? (user.FirstName + ' ' + user.LastName).toLowerCase().includes(this.searchText.toLowerCase()) : true;
            break;
          case 'role':
            matchesFilter = this.searchText ? user.UserRole.toLowerCase().includes(this.searchText.toLowerCase()) : true;
            break;
          case 'active':
            matchesFilter = this.searchText ? (user.IsActive ? 'active' : 'inactive').includes(this.searchText.toLowerCase()) : true;
            break;
          case 'userID':
            matchesFilter = this.searchText ? user.UserID!.toString() === this.searchText.trim() : true;
            break;
          default:
            matchesFilter = true;
        }
  
        return matchesFilter;
      })),
      tap(filteredUsers => {
        this.totalUsers = filteredUsers.length;
        this.updatePagination();
        
      }),
      map(filteredUsers => {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
      })
    );
  }
  
  

  refreshData() {
    this.searchText = '';
    this.currentPage = 1; 
    this.loadUsers(); 
    this.applyFilters(); 
  }

  setFilterType(type: string) {
    this.filterType = type;
  }

  updatePagination() {
    const totalPageCount = Math.ceil(this.totalUsers / this.itemsPerPage);
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

  loadUsers() {
    this.store.dispatch(userManagementActions.loadUsersRequest());
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

    this.editUserFormGroup
      .get('UserRole')!
      .setValue(user.UserRole, { onlySelf: true });
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

      if (
        this.currentUserRole === 'Admin' ||
        this.currentUserRole === 'Supervisor'
      ) {
        const formData = {
          ...this.addUserForm.value,
          CreatedAt: new Date(),
          CreatedBy: this.currentUserId,
          UserRole: 'Supervisor',
        };

        this.store.dispatch(
          companyUserManagementActions.createCompanyUserRequest({
            companyUserData: {
              CompanyRoleID: parseInt(this.currentUserRoleId),
            },
            userData: formData,
          })
        );
        this.modalService.toggle({ show: false, id: 'addUserModal' });
        this.addUserForm.reset();


      } else {
        // Xử lý cho các vai trò người dùng khác
        this.store.dispatch(
          userManagementActions.createUserRequest({ userData: formData })
        );
        this.modalService.toggle({ show: false, id: 'addUserModal' });
      }
    } else {
      this.toastr.error('Form is not valid or user ID is not available');
    }
  }

  clickToApplyFilters(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  editUser(UserID: number): void {
    this.currentAction = 'edit';

    this.store.dispatch(userManagementActions.loadUserByIdRequest({ UserID }));
    this.store
      .select(userManagementSelector.selectHasCompanyData)
      .subscribe((hasCompanyData) => {
        this.modalService.toggle({ show: true, id: 'editUserModal' });
        if (hasCompanyData) {
          this.editUserFormGroup.get('UserRole')?.disable();
        } else {
          this.editUserFormGroup.get('UserRole')?.enable();
        }
      });
  }

  saveChanges() {
    if (this.editUserFormGroup.valid && this.currentUserId) {
      console.log(this.currentUserId);
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
      this.modalService.toggle({ show: false, id: 'editUserModal' });
    } else {
      this.toastr.error('Form is invalid or user ID is not set');
    }
  }

  exportToPdf() {
    this.users$.pipe(take(1)).subscribe((users) => {
      if (users.length > 0) {
        const documentDefinition = this.getDocumentDefinition(users);
        pdfMake.createPdf(documentDefinition).download('users-report.pdf');
      } else {
        this.toastr.error('No users data available to export.');
      }
    });
  }

  getDocumentDefinition(users: User[]) {
    const now = new Date();
    const formattedTime = now.toLocaleString();

    return {
      content: [
        {
          text: 'Users Report',
          style: 'header',
        },
        this.buildUserTable(users),
        {
          text: `Report generated on: ${formattedTime}`,
          style: 'subheader',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10] as [number, number, number, number], // left, top, right, bottom
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

  buildUserTable(users: User[]) {
    return {
      table: {
        headerRows: 1,
        widths: [30, 'auto', 'auto', '*', 'auto', '*', 'auto'],
        body: [
          [
            { text: '#', style: 'tableHeader' },
            { text: 'Username', style: 'tableHeader' },
            { text: 'First Name', style: 'tableHeader' },
            { text: 'Last Name', style: 'tableHeader' },
            { text: 'Email', style: 'tableHeader' },
            { text: 'Role', style: 'tableHeader' },
            { text: 'Active', style: 'tableHeader' },
          ],
          ...users.map((user, index) => [
            (index + 1).toString(),
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            user.UserRole,
            user.IsActive ? 'Yes' : 'No',
          ]),
        ],
      },
      layout: 'auto',
    };
  }

  openPermissionsModal(userId: number | undefined) {
    console.log(userId);
    if (userId) {
      this.authService.getPermissions(userId).subscribe(
        (response) => {
          console.log(response);
          if (!response || !response.permissions) {
            console.error('Permissions data is missing');
            return;
          }
          this.IndividualPermissions$ = of(response.permissions);
          this.currentCompanyUserId = parseInt(response.companyUserId);
          const permissions = response.permissions;

          const permissionArray = this.permissionsForm.get(
            'permissions'
          ) as FormArray;
          permissionArray.clear();

          permissions.forEach(
            (permission: {
              IndividualPermissionID?: null;
              RolePermissionID?: null;
              ModuleID: any;
              CanView: any;
              CanAdd: any;
              CanUpdate: any;
              CanDelete: any;
              CanExport: any;
              CanViewData: any;
            }) => {
              const formGroup = this.fb.group({
                RolePermissionID: [permission.RolePermissionID || null],
                IndividualPermissionID: [
                  permission.IndividualPermissionID || null,
                ],
                CanView: [permission.CanView],
                CanAdd: [permission.CanAdd],
                CanUpdate: [permission.CanUpdate],
                CanDelete: [permission.CanDelete],
                CanExport: [permission.CanExport],
                CanViewData: [permission.CanViewData],
                ModuleID: [permission.ModuleID],
              });

              permissionArray.push(formGroup);
            }
          );
          this.originalPermissions = permissions;
        },
        (error) => {
          console.error('Failed to load permissions:', error);
        }
      );

      this.modalService.toggle({ show: true, id: 'permissionsModal' });
    } else {
      console.error('UserID is undefined');
    }
  }

  get permissionsControls() {
    return (this.permissionsForm.get('permissions') as FormArray).controls;
  }

  private toggleModal(modalId: string): void {
    const action = { show: true, id: modalId };
    this.modalService.toggle(action);
  }

  updatePermissions() {
    const permissionsFormArray = this.permissionsForm.get(
      'permissions'
    ) as FormArray;

    permissionsFormArray.controls.forEach((control, index) => {
      const currentPermission = control.value;

      if (this.hasPermissionChanged(index, currentPermission)) {
        if (this.currentCompanyUserId && currentPermission.ModuleID) {
          if (currentPermission.RolePermissionID != null) {
            // Create new permission
            const dataToCreate = {
              CompanyUserID: this.currentCompanyUserId,
              ModuleID: currentPermission.ModuleID,
              CanView: currentPermission.CanView,
              CanAdd: currentPermission.CanAdd,
              CanUpdate: currentPermission.CanUpdate,
              CanDelete: currentPermission.CanDelete,
              CanExport: currentPermission.CanExport,
              CanViewData: currentPermission.CanViewData,
            };
            this.permissionsService.createPermission(dataToCreate).subscribe({
              next: (res) => {
                console.log(res);
                this.toastr.success(
                  `Permissions created successfully for Module ID: ${currentPermission.ModuleID}`
                );
                // Optional: Update local state or UI to reflect the creation
              },
              error: (err) => {
                console.error(err);
                this.toastr.error(
                  `Failed to create permissions for Module ID: ${currentPermission.ModuleID}`
                );
              },
            });
          } else {
            // Update existing permission
            const permissionToUpdate = {
              CanView: currentPermission.CanView,
              CanAdd: currentPermission.CanAdd,
              CanUpdate: currentPermission.CanUpdate,
              CanDelete: currentPermission.CanDelete,
              CanExport: currentPermission.CanExport,
              CanViewData: currentPermission.CanViewData,
            };
            this.permissionsService
              .updatePermission(
                this.currentCompanyUserId,
                currentPermission.ModuleID,
                permissionToUpdate
              )
              .subscribe({
                next: (res) => {
                  this.toastr.success(
                    `Permissions updated successfully for Module ID: ${currentPermission.ModuleID}`
                  );
                  // Optional: Update local state or UI to reflect the update
                },
                error: (err) => {
                  console.error(err);
                  this.toastr.error(
                    `Failed to update permissions for Module ID: ${currentPermission.ModuleID}`
                  );
                },
              });
          }
          this.modalService.toggle({ show: false, id: 'permissionsModal' });
        } else {
          this.toastr.error(
            'Necessary IDs for permissions update are missing.'
          );
        }
      }
    });
  }

  hasPermissionChanged(index: number, currentPermission: any): boolean {
    const originalPermission = this.originalPermissions[index];

    const propertiesToCompare = [
      'CanView',
      'CanAdd',
      'CanUpdate',
      'CanDelete',
      'CanExport',
      'CanViewData',
    ];
    return propertiesToCompare.some(
      (key) => currentPermission[key] !== originalPermission[key]
    );
  }

  deleteAllPermissions(): void {
    const permissionsFormArray = this.permissionsForm.get(
      'permissions'
    ) as FormArray;

    const deleteObservables: Observable<any>[] = [];
    permissionsFormArray.controls.forEach((control) => {
      const permission = control.value;
      if (
        permission.IndividualPermissionID &&
        permission.IndividualPermissionID != null &&
        this.currentCompanyUserId
      ) {
        // Gọi phương thức deletePermission cho từng permission dựa trên IndividualPermissionID và CompanyUserID
        deleteObservables.push(
          this.permissionsService.deletePermission(
            this.currentCompanyUserId,
            permission.ModuleID
          )
        );
      }
    });

    if (deleteObservables.length > 0) {
      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.toastr.success(
            'All permissions have been successfully deleted.'
          );
          this.modalService.toggle({ show: false, id: 'permissionsModal' });
        },
        error: (error) => {
          console.error('Error deleting permissions:', error);
          this.toastr.error('Failed to delete permissions.');
        },
      });
    } else {
      this.toastr.info('No permissions to delete.');
    }
  }

  deleteAllPermissionsModal() {
    this.modalService.toggle({ show: true, id: 'deleteIndividualPermissions' });
  }

  openDeleteUserModal(userId: number | undefined) {
    this.currentSelectedUserId = userId;
    this.modalService.toggle({ show: true, id: 'deleteUserModal' });
  }

  deleteUser() {
    if (this.currentSelectedUserId) {
      this.store.dispatch(
        userManagementActions.deleteUserRequest({
          userId: this.currentSelectedUserId,
        })
      );
      this.modalService.toggle({ show: false, id: 'deleteUserModal' });
    } else {
      this.toastr.error('User ID is not available');
    }
  }

  validatePassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const errors: ValidationErrors = {}; // Explicitly type as ValidationErrors
    let errorMessages = [];

    if (!/\d/.test(value)) {
      errorMessages.push('include a number');
    }
    if (!/[A-Z]/.test(value)) {
      errorMessages.push('include an uppercase letter');
    }
    if (value.length < 6) {
      errorMessages.push('be at least 6 characters long');
    }

    if (errorMessages.length > 0) {
      errors['passwordComplexity'] = `Password must ${errorMessages.join(
        ', '
      )}.`;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
