import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyManagementComponent } from './company-management.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyManagementComponent,
    data: {
      title: 'Company Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyManagementRoutingModule {}
