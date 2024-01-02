import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { apiConstants } from '../constants';
import { Company } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CompanyManagementService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.COMPANY}`;
  constructor(private http: HttpClient) {}
  
  getCompanies(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(this.apiUrl, { params, withCredentials: true });
  }

  getCompanyById(CompanyID: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${CompanyID}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updateCompany(CompanyID: number, updatedData: Company): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${CompanyID}`, updatedData, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createCompany(companyData: Company): Observable<any> {
    const url = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.COMPANY}`;
    return this.http.post<any>(url, companyData, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
