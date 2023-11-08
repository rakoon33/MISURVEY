import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BACKEND_API } from '../../constants/apiConstants';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private apiUrl = `${BACKEND_API.BASE_API_URL}${BACKEND_API.USER}`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<{status: boolean; users: User[]}>(this.apiUrl, { withCredentials: true })
      .pipe(
        map(response => {
          // Kiểm tra nếu phản hồi có trạng thái là true và có mảng users
          if (response.status) {
            return response.users;
          } else {
            // Nếu trạng thái không phải là true, trả về một mảng rỗng
            return [];
          }
        }),
        catchError(this.handleError) // Xử lý lỗi một cách tập trung
      );
  }

  getUserById(userId: string): Observable<User | null> {
    console.log(`${this.apiUrl}/${userId}`);
    return this.http.get<{status: boolean; user: User}>(`${this.apiUrl}/${userId}`, { withCredentials: true })
      .pipe(
        map(response => {
          // Check if the response has a status of true and a user object
          if (response.status) {
            return response.user;
          } else {
            // If the status is not true, return null to indicate no user was found
            return null;
          }
        }),
        catchError(this.handleError) // Handle errors in a centralized way
      );
  }
  

  // Hàm xử lý lỗi tập trung
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Một lỗi client-side hoặc lỗi mạng xảy ra. Xử lý nó theo cách phù hợp.
      console.error('An error occurred:', error.error.message);
    } else {
      // Server trả về một mã phản hồi không thành công.
      // Phản ứng lại dựa trên mã phản hồi và dữ liệu phản hồi.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Trả về một Observable với thông điệp lỗi người dùng thân thiện
    return throwError(
      'Something bad happened; please try again later.');
  }
}
