import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompanyData(): Observable<any> {
    const companyDataUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.COMPANY}/getCompanyData`;
    return this.http.get<any>(companyDataUrl, { withCredentials: true }).pipe(
      map((response) => response),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}