import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../core/services/user-management.service';
import { User } from '../../core/models'; 
import { ToastrService } from 'ngx-toastr'; // Giả sử bạn sử dụng Toastr cho thông báo
import { ModalService } from '@coreui/angular';
import { Observable, Subscription, filter, take } from 'rxjs';
import { userManagementActions } from 'src/app/core/store/actions';
import { userManagementSelector } from 'src/app/core/store/selectors';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private subscription = new Subscription();

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
  users$: Observable<User[]> = this.store.select(userManagementSelector.selectCurrentUsers);
  isLoading$: Observable<boolean> = this.store.select(userManagementSelector.selectIsUserManagementLoading);
  selectedUser$: Observable<User | null> = this.store.select(userManagementSelector.selectCurrentUser);

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {

    this.subscription.add(
      this.selectedUser$.pipe(
        filter(user => user !== null) // Ignore null values
      ).subscribe(
        user => {
          if (user) {
            this.toggleModal('viewUserModal');
          } else {
            this.toastr.error('Error fetching user with id ');
          }
        }
      )
    );

  }

  ngOnInit() {
    this.store.dispatch(userManagementActions.loadUsersRequest());
  }
  
  viewUser(userId: string): void {
    this.store.dispatch(userManagementActions.loadUserByIdRequest({ userId }));
  }

  editUser(userId: string): void {
   
  }

  private toggleModal(modalId: string): void {
    const action = { show: true, id: modalId };
    this.modalService.toggle(action);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}