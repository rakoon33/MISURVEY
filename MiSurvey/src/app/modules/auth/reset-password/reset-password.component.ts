import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr : ToastrService,
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.token = this.route.snapshot.params['token'];  // Get token from the URL
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value
           ? null : {'mismatch': true};
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.password)
        .subscribe({
          next: (res) => {
            this.toastr.success('Password reset successfully');
            this.router.navigate(['/login']);
          },
          error: (err) =>  this.toastr.error(err.message) 
        });
    }
  }
}
