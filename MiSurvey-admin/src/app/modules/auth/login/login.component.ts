
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';

import { userActions } from './../../../core/store/actions';
import { AppState } from './../../../core/store/app.state';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private store: Store<AppState>, // Chú ý kiểu dữ liệu của Store
  ) { 
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.store.dispatch(userActions.loginRequest({ username, password }));
    } else {
      this.toastr.error('Please make sure all fields are filled out correctly.');
    }
  }
}