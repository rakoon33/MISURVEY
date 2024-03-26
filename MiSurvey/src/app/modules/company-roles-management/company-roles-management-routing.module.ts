import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyRolesManagementComponent } from './company-roles-management.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyRolesManagementComponent,
    data: {
      title: 'Company Role Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRolesManagementRoutingModule {}
