import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}


  login(username: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/login`;
    return this.http.post(loginUrl, { username, password }, { withCredentials: true })
      .pipe(
        map((response: any) => {
          // Instead of looking for a token in the response,
          // look for the status property to check if the login was successful.
          if (response && response.status) {
            // Handle successful login, maybe update UI or redirect
            return response.message; // Return the login success message
          }
          return null; // Return null if login failed
        }),
        catchError(error => {
          console.error('Error during login:', error);
          return of(false); // Indicate failure to the caller
        })
      );
  }

  // Optional: You can add other methods related to authentication here (like logout, isAuthenticated, etc.)
}
