import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BACKEND_API } from '../../constants/apiConstants';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) {}


//   createUser(username: string, password: string): Observable<any> {
//     const loginUrl = `${BACKEND_API.BASE_API_URL}/${BACKEND_API.USER}`;
//     return this.http.post(loginUrl, { username, password })
//       .pipe(
//         map((response: any) => {
//           if (response && response.status) {
//             // Handle successful login
//             return response; // Return the login success message
//           }
//           return response; // Return null if login failed
//         }),
//         catchError(error => {
//           console.error('Error during login:', error);
//           return of(false); // Indicate failure to the caller
//         })
//       );
//   }


}
