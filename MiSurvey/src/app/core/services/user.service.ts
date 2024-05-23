import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserData(): Observable<any> {
    const userDataUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.USER}/getUserData`;
    return this.http.get<any>(userDataUrl, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  updateUser(UserID: string, userData: any): Observable<any> {
    const updateUserUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/users/${UserID}`;
    return this.http.put(updateUserUrl, userData, {
      withCredentials: true,
    }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        let errorMessage = 'Failed to update user data.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Invalid request to update user data.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateUserAvatar(UserID: string, formData: FormData): Observable<any> {
    const updateAvatarUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/image/upload-user-avatar/${UserID}`;
    return this.http.post(updateAvatarUrl, formData, {
      withCredentials: true,
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event) => {
        return event;
      }),
      catchError((error) => {
        let errorMessage = 'Failed to update user avatar.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Invalid request to update avatar.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
