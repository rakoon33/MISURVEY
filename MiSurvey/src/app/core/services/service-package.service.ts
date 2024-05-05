import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ServicePackageService {
  private apiUrl =`${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.SERVICEPACKAGES}`;
  private createPaymentUrl = `${apiConstants.BACKEND_API.BASE_API_URL_PAYMENT}/order/create_payment`;

  constructor(private http: HttpClient) {}

  getAllServicePackages(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  initiatePayment(packageId: number, bankCode: string, language: string): Observable<any> { 
    const paymentData = {
      packageId: packageId,
      bankCode: bankCode,
      language: language
    };
    return this.http.post<any>(this.createPaymentUrl, paymentData, { withCredentials: true }); 
  }
}