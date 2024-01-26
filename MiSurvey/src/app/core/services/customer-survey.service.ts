import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CustomerSurveyService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.SURVEY}${apiConstants.BACKEND_API.CUSTOMER_SURVEY}`;

  constructor(private http: HttpClient) {}

  getSurveyByLink(surveyLink: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${surveyLink}`, { withCredentials: true })
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
