import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router'; // nhập Router từ @angular/router để thực hiện việc chuyển hướng:

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) { 
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe(response => {
        if (response && response.status) {
          console.log('Login successful!');
          localStorage.setItem('token', response.token); // Store token to localStorage
          this.router.navigate(['/dashboard']); // Redirect to dashboard
        } else {
          console.log('Login failed.');
          // Optional: Display a message to the user about the failed login
        }
      });
    } else {
      console.log('Form is invalid');
      // Optional: Display a message to the user about the invalid form
    }
  }

}