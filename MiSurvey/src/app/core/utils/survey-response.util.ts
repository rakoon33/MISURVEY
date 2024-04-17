import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyResponseUtil {
  private responses = new BehaviorSubject<{ [questionId: number]: any }>({});

  setResponse(questionId: number, response: any) {
    const currentResponses = this.responses.value;
    currentResponses[questionId] = response;
    this.responses.next(currentResponses);
  }

  getResponse(questionId: number) {
    return this.responses.value[questionId];
  }

  getAllResponses() {
    return this.responses.asObservable();
  }

  clearResponses() {
    this.responses.next({});
  }
}
