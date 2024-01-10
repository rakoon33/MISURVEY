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
}
