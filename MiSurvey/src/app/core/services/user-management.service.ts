import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.USER}`;
  constructor(private http: HttpClient) {}

  getUsers(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(this.apiUrl, { params, withCredentials: true });
  }

  getUserById(userId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${userId}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateUser(UserID: number, userData: User): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${UserID}`, userData, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createUser(userData: User): Observable<any> {
    const url = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.USER}`;
    return this.http.post<any>(url, userData, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
