import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionConfigureComponent } from './question-configure.component';

describe('QuestionConfigureComponent', () => {
  let component: QuestionConfigureComponent;
  let fixture: ComponentFixture<QuestionConfigureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionConfigureComponent]
    });
    fixture = TestBed.createComponent(QuestionConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
