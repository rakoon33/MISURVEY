import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DefaultLayoutService {

  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.LOGOUT}`;

  constructor(private http: HttpClient) {}

  logout(): Observable<any> {
    return this.http.post<{message: string}>(`${this.apiUrl}`, {}, { withCredentials: true })
      .pipe(
        catchError(this.handleError) 
      );
  }
  
  // Hàm xử lý lỗi tập trung
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
