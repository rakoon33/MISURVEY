import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserActivityLogService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/useractivitylogs`;

  constructor(private http: HttpClient) {}

  getAllActivities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { withCredentials: true });
  }
}
