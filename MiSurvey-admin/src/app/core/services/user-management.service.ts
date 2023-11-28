import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.USER}`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ status: boolean; data: User[] }> {
    return this.http.get<{ status: boolean; data: User[] }>(this.apiUrl, { withCredentials: true })
      .pipe(
        map(response => {
          // Directly returning the entire response object
          return response;
        }),
        catchError(error => {
          console.error('Error during fetching users data:', error);
          return throwError(() => new Error('Error fetching users data'));
        })
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
        catchError(error => {
          console.error('Error during fetching user data:', error);
          return throwError(() => new Error('Error fetching user data'));
        })// Handle errors in a centralized way
      );
  }
  
}