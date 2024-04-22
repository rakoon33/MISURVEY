import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyRole, Permission } from './../models';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class CompanyRolesManagementService {
  constructor(private http: HttpClient) {}

  createCompanyRole(
    roleData: CompanyRole,
    permissionsData: Permission[]
  ): Observable<any> {
    return this.http.post(
      `${apiConstants.BACKEND_API.BASE_API_URL}/companyRoles`,
      { roleData, permissionsData },
      { withCredentials: true }
    );
  }

  updateCompanyRole(
    roleId: number,
    roleData: CompanyRole,
    permissionsData: Permission[]
  ): Observable<any> {
    return this.http.put(
      `${apiConstants.BACKEND_API.BASE_API_URL}/companyRoles/${roleId}`,
      { roleData, permissionsData },
      { withCredentials: true }
    );
  }

  deleteCompanyRole(roleId: number): Observable<any> {
    return this.http.delete(
      `${apiConstants.BACKEND_API.BASE_API_URL}/companyRoles/${roleId}`,
      { withCredentials: true }
    );
  }

  getAllCompanyRoles(): Observable<any> {
    return this.http.get(
      `${apiConstants.BACKEND_API.BASE_API_URL}/companyRoles`,
      { withCredentials: true }
    );
  }

  getOneCompanyRole(roleId: number): Observable<any> {
    return this.http.get(
      `${apiConstants.BACKEND_API.BASE_API_URL}/companyRoles/${roleId}`,
      { withCredentials: true }
    );
  }
}
