import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission } from '../../core/models';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '@coreui/angular';
import {
  Observable,
  Subscription,
  combineLatest,
  filter,
  map,
  take,
} from 'rxjs';
import { userManagementActions } from 'src/app/core/store/actions';
import {
  userManagementSelector,
  userSelector,
} from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  private subscription = new Subscription();

  currentAction: 'view' | 'edit' | null = null;
  currentSelectedUserId: number | undefined;
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
    private modalService: ModalService
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
      UpdatedAt: new FormControl(''),
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
            this.loadUserDataIntoForm(user);
            console.log(user.IsActive);
            if (this.currentAction === 'view') {
              this.toggleModal('viewUserModal');
            } else if (this.currentAction === 'edit') {
              this.currentSelectedUserId = user.UserID;
              this.toggleModal('editUserModal');
            }
          } else {
            this.toastr.error('Error fetching user with id');
          }
        })
    );

    this.subscription.add(
      this.store
        .select(userManagementSelector.selectCurrentUseManagementError)
        .subscribe((error) => {
          if (error) {
            this.toastr.error(error.message);
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
    this.store.dispatch(userManagementActions.loadUsersRequest());
    this.store
      .select(userSelector.selectCurrentUser)
      .subscribe((id) => (this.currentUserId = id?.UserID));
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
      const formValue = this.editUserFormGroup.value;

      this.store.dispatch(
        userManagementActions.updateUserRequest({
          UserID: this.currentUserId,
          userData: formValue,
        })
      );
      this.store.dispatch(userManagementActions.loadUsersRequest());
      this.store.dispatch(
        userManagementActions.loadUserByIdRequest({
          UserID: this.currentUserId,
        })
      );
    } else {
      // Handle form invalid or user ID not set
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
