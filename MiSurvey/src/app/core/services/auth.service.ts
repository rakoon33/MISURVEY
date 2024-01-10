import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // Changed return type to any
    const loginUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.LOGIN}`;
    return this.http
      .post<any>(loginUrl, { username, password }, { withCredentials: true })
      .pipe(
        map((response) => {
          if (response.status) {
            return response;
          } else {
            throw new Error(response.message);
          }
        }),
        catchError((error) => {
          console.error('Error during login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    const logoutUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/logout`;
    return this.http
      .post<any>(logoutUrl, {}, { withCredentials: true })
      .pipe(catchError((error) => throwError(() => error)));
  }
}
