import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BACKEND_API } from '../../constants/apiConstants';
import { Company } from '../../models/company.model'; 

export interface CompaniesResponse {
    status: boolean;
    companies: Company[];
}

@Injectable({
  providedIn: 'root'
})

export class CompanyManagementService {
    private apiUrl = `${BACKEND_API.BASE_API_URL}${BACKEND_API.COMPANY}`;

    constructor(private http: HttpClient) {}

    getCompanies(): Observable<Company[]> {
        return this.http.get<{status: boolean; companies: Company[]}>(this.apiUrl, { withCredentials: true })
          .pipe(
            map(response => {
              if (response.status) {
                return response.companies;
              } else {
                return [];
              }
            })
        );
    }
    
    getCompanyId(companyId: string): Observable<Company | null> {
        console.log(`${this.apiUrl}/${companyId}`);
    return this.http.get<{status: boolean; company: Company}>(`${this.apiUrl}/${companyId}`, { withCredentials: true })
        .pipe(
            map(response => {
                if (response.status) {
                    return response.company;
                } else {
                    return null;
                }
            }),
        );
    }         
}