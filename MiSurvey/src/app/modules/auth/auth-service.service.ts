import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('YOUR_API_ENDPOINT', { username, password })
      .pipe(
        catchError(error => {
          console.error('Error during login:', error);
          return throwError(error);
        })
      );
  }
}