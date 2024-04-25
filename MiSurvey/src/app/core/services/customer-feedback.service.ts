import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ContactInfo, FeedbackResponse } from '../models'; // Adjust path as necessary
import { apiConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerFeedbackService {
  private apiUrl = `${apiConstants.BACKEND_API.BASE_API_URL}${apiConstants.BACKEND_API.FEEDBACK_RESPONSE}`;

  constructor(private http: HttpClient) {}

  // Function to submit survey responses along with contact info
  submitSurveyResponses(contactInfo: ContactInfo, surveyResponses: FeedbackResponse[]): Observable<any> {
    const payload = {
      ...contactInfo,
      SurveyResponses: surveyResponses
    };
    return this.http.post(this.apiUrl, payload, { withCredentials: true });
  }
}
