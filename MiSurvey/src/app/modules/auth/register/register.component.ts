import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { authActions } from './../../../core/store/actions';
import { AppState } from './../../../core/store/app.state';
import { authSelector } from './../../../core/store/selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        this.validatePassword,
      ]),
    });
  }

  validatePassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    let errors: ValidationErrors = {};
    let errorMessages = [];

    if (!/\d/.test(value)) {
      errorMessages.push('include a number');
    }
    if (!/[A-Z]/.test(value)) {
      errorMessages.push('include an uppercase letter');
    }
    if (value.length < 6) {
      errorMessages.push('be at least 6 characters long');
    }

    if (errorMessages.length > 0) {
      errors['passwordComplexity'] = `Password must ${errorMessages.join(
        ', '
      )}.`;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);
      this.store.dispatch(
        authActions.registerRequest({ userData: this.registerForm.value })
      );
    } else {
      console.error('Form is not valid');
    }
  }
}
