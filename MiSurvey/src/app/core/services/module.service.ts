import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module } from '../models';
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}/modules`;

  constructor(private http: HttpClient) {}

  getAllModules(): Observable<any> {
    return this.http.get<Module[]>(this.apiUrl, { withCredentials: true });
  }
}
