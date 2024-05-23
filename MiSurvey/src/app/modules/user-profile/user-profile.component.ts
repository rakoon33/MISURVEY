import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';
import { userSelector } from 'src/app/core/store/selectors';
import { ModalService } from '@coreui/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/';
import { ToastrService } from 'ngx-toastr';
import { userActions } from 'src/app/core/store/actions';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  user$: Observable<User | null>;
  editUserProfileForm: FormGroup;
  selectedFile: File | null = null;
  currentUserId: number | undefined;

  constructor(
    private store: Store,
    private modalService: ModalService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
    this.user$ = this.store.select(userSelector.selectCurrentUser);
    this.editUserProfileForm = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      FirstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      PhoneNumber: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUserId = user.UserID;
        this.editUserProfileForm.patchValue({
          Username: user.Username,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          PhoneNumber: user.PhoneNumber,
        });
      }
    });
  }

  openEditModal() {
    this.modalService.toggle({ show: true, id: 'editUserProfileModal' });
  }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  reloadUserData() {
    this.store.dispatch(userActions.getUserDataRequest()); // Dispatch action to load current user
  }

  saveUserProfile() {
    if (this.editUserProfileForm.valid) {
      const userID = this.currentUserId;
      const updatedUserData = this.editUserProfileForm.value;
      this.userService.updateUser(userID!.toString(), updatedUserData).subscribe(
        (response) => {
          this.toastr.success('User data updated successfully');
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append(
              'image',
              this.selectedFile,
              this.selectedFile.name
            );
            this.userService.updateUserAvatar(userID!.toString(), formData).subscribe(
              (event) => {
                this.reloadUserData();
              },
              (error) => {
                this.toastr.error('Failed to update user avatar');
              }
            );
          }
          this.modalService.toggle({ show: false, id: 'editUserProfileModal' });
        },
        (error) => {
          this.toastr.error('Failed to update user data');
          console.log(error);
        }
      );
    }
    this.reloadUserData();
  }
}
