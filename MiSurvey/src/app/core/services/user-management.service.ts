import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  getUsers(): Observable<{ status: boolean; data: User[] }> {
    return this.http
      .get<{ status: boolean; data: User[] }>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          // Directly returning the entire response object
          return response;
        }),
        catchError((error) => {
          console.error('Error during fetching users data:', error);
          return throwError(() => new Error('Error fetching users data'));
        })
      );
  }

  getUserById(userId: string): Observable<{ status: boolean; user: User }> {
    return this.http
      .get<{ status: boolean; data: User }>(`${this.apiUrl}/${userId}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return { status: response.status, user: response.data };
        }),
        catchError((error) => {
          console.error('Error during fetching user data:', error);
          return throwError(() => new Error('Error fetching user data'));
        })
      );
  }
}
