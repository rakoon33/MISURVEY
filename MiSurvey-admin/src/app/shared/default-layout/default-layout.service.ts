import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { BACKEND_API } from '../../constants/apiConstants';

@Injectable({
  providedIn: 'root'
})
export class DefaultLayoutService {

  private apiUrl = `${BACKEND_API.BASE_API_URL}${BACKEND_API.LOGOUT}`;

  constructor(private http: HttpClient) {}

  logout(): Observable<any> {
    return this.http.post<{message: string}>(`${this.apiUrl}`, {}, { withCredentials: true })
      .pipe(
        catchError(this.handleError) // Use your existing error handling
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
