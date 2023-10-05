import { Component } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  onLogin(username: string, password: string) {
    console.log('onLogin')
    this.authService.login(username, password).subscribe(response => {
      // Xử lý sau khi đăng nhập thành công
    }, error => {
      // Xử lý khi đăng nhập thất bại
    });
  }
}