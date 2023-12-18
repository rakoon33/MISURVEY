import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbsSurveyComponent } from './thumbs-survey.component';

describe('ThumbsSurveyComponent', () => {
  let component: ThumbsSurveyComponent;
  let fixture: ComponentFixture<ThumbsSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThumbsSurveyComponent]
    });
    fixture = TestBed.createComponent(ThumbsSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
