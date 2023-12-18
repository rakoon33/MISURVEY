import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoticonRatingComponent } from './emoticon-rating.component';

describe('EmoticonRatingComponent', () => {
  let component: EmoticonRatingComponent;
  let fixture: ComponentFixture<EmoticonRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmoticonRatingComponent]
    });
    fixture = TestBed.createComponent(EmoticonRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
