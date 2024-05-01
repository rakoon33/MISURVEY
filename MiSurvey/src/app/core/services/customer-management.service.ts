import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models';
import { apiConstants } from '../constants';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/customers`;

  constructor(private http: HttpClient) {}

  getAllCustomers(page: number, pageSize: number): Observable<{ customers: Customer[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<{ customers: Customer[], total: number }>(this.apiUrl, { params, withCredentials: true });
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`, { withCredentials: true });
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer, { withCredentials: true });
  }

  updateCustomer(customerId: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, customer, { withCredentials: true });
  }

  deleteCustomer(customerId: number): Observable<{ status: boolean, message: string }> {
    return this.http.delete<{ status: boolean, message: string }>(`${this.apiUrl}/${customerId}`, { withCredentials: true });
  }

  searchCustomers(searchTerm: string): Observable<Customer[]> {
    const params = new HttpParams().set('name', searchTerm);
    return this.http.get<Customer[]>(`${this.apiUrl}/searchCustomers`, { params, withCredentials: true });
  }
}
