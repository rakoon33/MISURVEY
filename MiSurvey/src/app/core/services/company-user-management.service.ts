import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CompanyUserManagementService {

  constructor(private http: HttpClient) {}

  createCompanyUser(companyUserData: any, userData: any): Observable<any> {
    const apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/companyusers`;
    return this.http.post<any>(apiUrl, { companyUserData, userData }, { withCredentials: true });
  }
}
