import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConstants } from '../constants';
import { QuestionTemplate } from '../models';

@Injectable({
  providedIn: 'root',
})
export class QuestionTemplateService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.QUESTION_TEMPLATE}`;

  constructor(private http: HttpClient) {}

  getQuestionTemplates(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(this.apiUrl, { params, withCredentials: true });
  }
  getQuestionTemplateById(templateId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${templateId}`, { withCredentials: true });
  }

  createQuestionTemplate(templateData: QuestionTemplate): Observable<any> {
    return this.http.post<any>(this.apiUrl, templateData, { withCredentials: true });
  }

  updateQuestionTemplate(templateId: number, templateData: QuestionTemplate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${templateId}`, templateData, { withCredentials: true });
  }

  searchQuestionTemplates(searchTerm: string): Observable<any> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<any>(`${this.apiUrl}/search`, { params, withCredentials: true });
  }
  deleteQuestionTemplate(templateId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${templateId}`, { withCredentials: true });
  }
}
