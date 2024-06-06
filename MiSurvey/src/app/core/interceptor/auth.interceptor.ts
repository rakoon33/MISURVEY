import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu token tồn tại, thêm vào headers của request
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    // Chuyển request đã được chỉnh sửa cho next interceptor trong chuỗi hoặc gửi đi nếu không còn interceptor nào
    return next.handle(request);
  }
}
