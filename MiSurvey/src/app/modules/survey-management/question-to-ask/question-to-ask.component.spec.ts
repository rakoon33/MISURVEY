import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionToAskComponent } from './question-to-ask.component';

describe('QuestionToAskComponent', () => {
  let component: QuestionToAskComponent;
  let fixture: ComponentFixture<QuestionToAskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionToAskComponent]
    });
    fixture = TestBed.createComponent(QuestionToAskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
