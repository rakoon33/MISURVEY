import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSurveyComponent } from './text-survey.component';

describe('TextSurveyComponent', () => {
  let component: TextSurveyComponent;
  let fixture: ComponentFixture<TextSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextSurveyComponent]
    });
    fixture = TestBed.createComponent(TextSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
