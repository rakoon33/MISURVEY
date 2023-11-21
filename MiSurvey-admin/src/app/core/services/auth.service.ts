
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    const loginUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.LOGIN}`;
    return this.http.post<User>(loginUrl, { username, password }, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error during login:', error);
          throw error; // Let the effect handle the error
        })
      );
  }


}
