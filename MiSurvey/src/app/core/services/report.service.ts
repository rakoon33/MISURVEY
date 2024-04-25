import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.REPORTS}`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getActivityOverview(startDate: string, endDate: string): Observable<any> {
    const params = { startDate, endDate };
    return this.http.get<any>(`${this.apiUrl}/activity-overview`, { params, withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getSurveyTypeUsage(startDate: string, endDate: string): Observable<any> {
    const params = { startDate, endDate };
    return this.http.get<any>(`${this.apiUrl}/survey-type-usage`, { params, withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getSurveyCountByDateRange(startDate: string, endDate: string): Observable<any> {
    const params = { startDate, endDate };
    return this.http.get<any>(`${this.apiUrl}/survey-count`, { params, withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
