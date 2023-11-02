import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:3000/api/SuperAdmin';

  constructor(private http: HttpClient) {}


  login(username: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, { username, password })
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return response; // Return the whole response
          }
          return null; // Return null if login failed
        }),
        catchError(error => {
          console.error('Error during login:', error);
          return of(false);
        })
      );
  }

  // Optional: You can add other methods related to authentication here (like logout, isAuthenticated, etc.)
}
