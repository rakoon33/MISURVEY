import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { authActions } from './../../../core/store/actions';
import { AppState } from './../../../core/store/app.state';
import {authSelector} from './../../../core/store/selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private store: Store<AppState>) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);
      this.store.dispatch(authActions.registerRequest({ userData: this.registerForm.value }));
    } else {
      console.error('Form is not valid');
    }
  }
}
