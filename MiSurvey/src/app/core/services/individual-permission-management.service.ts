import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})


export class IndividualPermissionsService {

  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}`; // Adjust this URL based on your actual API endpoint

  constructor(private http: HttpClient) {}

  // Create a new individual permission
  createPermission(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/permissions`, data, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an individual permission
  updatePermission(companyUserId: number, moduleId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/permissions/${companyUserId}/${moduleId}`, data, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an individual permission
  deletePermission(companyUserId: number, moduleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/permissions/${companyUserId}/${moduleId}`, { withCredentials: true }).pipe(
      catchError(this.handleError)
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
