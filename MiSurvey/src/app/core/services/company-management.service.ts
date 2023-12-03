import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { Company } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompanyManagementService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.COMPANY}`;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http
      .get<{ status: boolean; data: Company[] }>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          console.log('Full response:', response);
          if (response.status) {
            console.log('alo ' + response.data);
            return response.data;
          } else {
            return [];
          }
        }),
        catchError(this.handleError)
      );
  }

  getCompanyId(companyId: string): Observable<Company | null> {
    console.log(`${this.apiUrl}/${companyId}`);
    return this.http
      .get<{ status: boolean; data: Company }>(`${this.apiUrl}/${companyId}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (response.status) {
            return response.data;
          } else {
            return null;
          }
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
