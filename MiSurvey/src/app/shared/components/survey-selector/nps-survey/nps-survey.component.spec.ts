import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsSurveyComponent } from './nps-survey.component';

describe('NpsSurveyComponent', () => {
  let component: NpsSurveyComponent;
  let fixture: ComponentFixture<NpsSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NpsSurveyComponent]
    });
    fixture = TestBed.createComponent(NpsSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
