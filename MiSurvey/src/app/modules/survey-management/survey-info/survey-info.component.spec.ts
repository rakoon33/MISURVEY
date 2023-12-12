import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyInfoComponent } from './survey-info.component';

describe('SurveyInfoComponent', () => {
  let component: SurveyInfoComponent;
  let fixture: ComponentFixture<SurveyInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyInfoComponent]
    });
    fixture = TestBed.createComponent(SurveyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
