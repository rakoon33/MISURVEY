import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../core/models'; 
import { ToastrService } from 'ngx-toastr'; // Giả sử bạn sử dụng Toastr cho thông báo
import { ModalService } from '@coreui/angular';
import { Observable } from 'rxjs';
import { userManagementActions, userActions } from 'src/app/core/store/actions';
import { userManagementSelector, userSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  currentUser: User = {
    UserID: -1,
    UserAvatar: '',
    Username: '',
    FirstName: '',
    LastName: '',
    Email: '',
    UserRole: '',
    IsActive: false,
    CreatedAt: ''
  };
  users$: Observable<User[]> = this.store.select(userManagementSelector.selectAllUsers);
  isLoading$: Observable<boolean> = this.store.select(userManagementSelector.selectUserManagementLoading);

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.store.dispatch(userManagementActions.loadUsersRequest());
  }
  
  viewUser(userId: string): void {
    // this.store.dispatch(UserActions.loadUserById({ userId }));
    this.store.select(userSelector.selectCurrentUser).subscribe(
      user => {
        if (user) {
          this.currentUser = user;
          this.toggleModal('viewUserModal');
        } else {
          this.toastr.error('Error fetching user with id ' + userId);
        }
      }
    );
  }

  editUser(userId: string): void {
    // Similar to viewUser, but dispatch a different action if needed
  }

  private toggleModal(modalId: string): void {
    const action = { show: true, id: modalId };
    this.modalService.toggle(action);
  }

  // Implement additional methods for add, edit, and delete
}