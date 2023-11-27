import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUserData(username: string): Observable<User> {
    const userDataUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.USER}/getUserData`;
    return this.http.get<{ status: boolean; message: string; data: User }>(userDataUrl, { withCredentials: true }).pipe(
      map(response => {
        if (response.status && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'No user data found');
        }
      }),
      catchError(error => {
        console.error('Error during fetching user data:', error);
        return throwError(() => new Error('Error fetching user data'));
      })
    );
  }
}
