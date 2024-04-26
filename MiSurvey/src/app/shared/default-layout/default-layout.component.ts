import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { navItems as originalNavItems } from './_nav';
import { userSelector } from 'src/app/core/store/selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: any[] | undefined; // Mảng các mục điều hướng

  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.store.select(userSelector.selectCurrentUser).subscribe((user) => {
      if (user && user.UserRole === 'SuperAdmin') {
        // Lọc ra các mục 'Survey Management' và 'Company Role Management' nếu người dùng là 'SuperAdmin'
        this.navItems = originalNavItems.filter(item => item.name !== 'Survey Management' && item.name !== 'Role Management' && item.name !== 'User Management');
      } else {
        // Nếu người dùng không phải là 'SuperAdmin'
        this.navItems = originalNavItems.filter(item => item.name !== 'Question Management');;
      }
    });
  }
}
