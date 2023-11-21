import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { DefaultLayoutService } from '../../../core/services/default-layout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private classToggler: ClassToggleService, 
    private defaultLayoutService: DefaultLayoutService,
    private toastr: ToastrService,
    private router: Router,
    ) {
    super();
  }

  logout(): void {
    this.defaultLayoutService.logout().subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error('Failed to log out');
        console.error('Logout error', error);
      }
    });
  }
}
