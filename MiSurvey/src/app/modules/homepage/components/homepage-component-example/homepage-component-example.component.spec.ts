import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponentExampleComponent } from './homepage-component-example.component';

describe('HomepageComponentExampleComponent', () => {
  let component: HomepageComponentExampleComponent;
  let fixture: ComponentFixture<HomepageComponentExampleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageComponentExampleComponent]
    });
    fixture = TestBed.createComponent(HomepageComponentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
