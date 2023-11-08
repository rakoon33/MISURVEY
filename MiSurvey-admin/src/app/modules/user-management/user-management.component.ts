import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './user-management.service';
import { User } from '../../models/user.model'; 
import { ToastrService } from 'ngx-toastr'; // Giả sử bạn sử dụng Toastr cho thông báo
import { ModalService } from '@coreui/angular';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
 
  currentUser: User = {
    Username: '',
    FirstName: '',
    LastName: '',
    Email: '',
    UserRole: '',
    CreatedAt: new Date(),
    IsActive: false
  };
  users: User[] = []; 
  isLoading = true; // Thêm một cờ để xác định trạng thái loading
  userId: string = '';

  constructor(
    private userManagementService: UserManagementService,
    private toastr: ToastrService, // Sử dụng ToastrService để hiển thị thông báo
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.userManagementService.getUsers().subscribe({
      next: (data: User[]) => {
        this.isLoading = false; // Cập nhật trạng thái loading khi dữ liệu đã tải xong
        this.users = data;
        if (data.length === 0) {
          this.toastr.info('No users found.'); // Thông báo nếu không có người dùng
        }
        console.log(this.users);
      },
      error: (error) => {
        this.isLoading = false; // Cập nhật trạng thái loading khi có lỗi
        if (error.status === 401) {
          this.toastr.error('Access denied. You do not have permission to view this content.');
        } else {
          this.toastr.error('Error fetching users');
        }
        console.error('Error fetching users', error);
      }
    });
  }
  
  editUser(userId: string): void {
    this.userManagementService.getUserById(userId).subscribe(user => {
      if (user) {
        this.currentUser = user;
        console.log(this.currentUser);
        // Here you can now open the modal and use currentUser to populate the form
        const action: IModalAction = {
          show: true,
          id: 'editUserModal' // Make sure this ID matches the ID of your modal
        };
        this.modalService.toggle(action); 
      } else {
        this.toastr.error('Error fetching user with id ' + userId);
      }
    });
  }



  // // This function can be called when the Save Changes button is clicked
  // saveUserChanges(): void {
  //   if (this.currentUser) {
  //     this.userManagementService.updateUser(this.currentUser).subscribe({
  //       next: (user) => {
  //         this.toastr.success('User updated successfully');
  //         // Close the modal and refresh the user list or update the list locally
  //         this.modalService.toggle({ show: false, id: 'editUserModal' });
  //         this.refreshUserList();
  //       },
  //       error: (error) => {
  //         this.toastr.error('Error updating user');
  //         console.error('Error updating user', error);
  //       }
  //     });
  //   }
  // }

  // // This function might refresh the user list after a successful update
  // refreshUserList(): void {
  //   this.userManagementService.getUsers().subscribe({
  //     // ... same as your current implementation of fetching users
  //   });
  // }
}
