import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSidebarComponent } from './notifications-sidebar.component';

describe('NotificationsSidebarComponent', () => {
  let component: NotificationsSidebarComponent;
  let fixture: ComponentFixture<NotificationsSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSidebarComponent]
    });
    fixture = TestBed.createComponent(NotificationsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
