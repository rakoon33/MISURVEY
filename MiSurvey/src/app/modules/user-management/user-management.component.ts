import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, CompanyRole } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, combineLatest, filter, forkJoin, map, of } from 'rxjs';
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

    this.companyRoleFormGroup
      .get('CompanyRoleID')!
      .valueChanges.subscribe((value) => {
        this.currentUserRoleId = value;
      });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: RouterEvent) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/user-management') {
            this.router.navigate(['/user-management'], {
              queryParams: { page: 1, pageSize: 10 },
              replaceUrl: true, // This replaces the current state in history
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
    this.users$.subscribe((users) => {
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
    if (userId) {
      this.authService.getPermissions(userId).subscribe(
        (response) => {
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
                  console.log(res);
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
      const permissionsFormArray = this.permissionsForm.get('permissions') as FormArray;
      
      const deleteObservables: Observable<any>[] = [];
      permissionsFormArray.controls.forEach((control) => {
        const permission = control.value;
        if (permission.IndividualPermissionID && permission.IndividualPermissionID != null && this.currentCompanyUserId) {
          // Gọi phương thức deletePermission cho từng permission dựa trên IndividualPermissionID và CompanyUserID
          deleteObservables.push(this.permissionsService.deletePermission(this.currentCompanyUserId, permission.ModuleID));
        }
      });
  
      if (deleteObservables.length > 0) {
        forkJoin(deleteObservables).subscribe({
          next: () => {
            this.toastr.success('All permissions have been successfully deleted.');
            this.modalService.toggle({ show: false, id: 'permissionsModal' });
          },
          error: (error) => {
            console.error('Error deleting permissions:', error);
            this.toastr.error('Failed to delete permissions.');
          }
        });
      } else {
        this.toastr.info('No permissions to delete.');
      }
    
  }
  
  deleteAllPermissionsModal() {
    this.modalService.toggle({ show: true, id: 'deleteIndividualPermissions' });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
