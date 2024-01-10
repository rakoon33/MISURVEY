import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsatSurveyComponent } from './csat-survey.component';

describe('CsatSurveyComponent', () => {
  let component: CsatSurveyComponent;
  let fixture: ComponentFixture<CsatSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CsatSurveyComponent]
    });
    fixture = TestBed.createComponent(CsatSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
