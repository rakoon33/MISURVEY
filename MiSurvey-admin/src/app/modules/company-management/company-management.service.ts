import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BACKEND_API } from '../../constants/apiConstants';
import { Company } from '../../models/company.model'; 

@Injectable({
  providedIn: 'root'
})

export class CompanyManagementService {

    private apiUrl = `${BACKEND_API.BASE_API_URL}${BACKEND_API.COMPANY}`;

    constructor(private http: HttpClient) {}

    getCompanies(): Observable<Company[]> {
        return this.http.get<{status: boolean; data: Company[]}>(this.apiUrl, { withCredentials: true })
          .pipe(
            map(response => {
                console.log('Full response:', response);
              if (response.status) {
                console.log("alo " + response.data)
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
    
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // Một lỗi client-side hoặc lỗi mạng xảy ra. Xử lý nó theo cách phù hợp.
          console.error('An error occurred:', error.error.message);
        } else {
          // Server trả về một mã phản hồi không thành công.
          // Phản ứng lại dựa trên mã phản hồi và dữ liệu phản hồi.
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // Trả về một Observable với thông điệp lỗi người dùng thân thiện
        return throwError(
          'Something bad happened; please try again later.');
      }
}