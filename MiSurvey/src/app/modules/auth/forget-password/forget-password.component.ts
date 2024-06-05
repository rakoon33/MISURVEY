import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email(): FormControl {
    return this.forgetPasswordForm.get('email') as FormControl;
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      this.authService.forgotPassword(this.email.value).subscribe({
        next: (res) => {
          this.toastr.success('Please check your email for password reset instructions.');
        },
        error: (err) => this.toastr.error(err.message),
      });
    }
  }
}
