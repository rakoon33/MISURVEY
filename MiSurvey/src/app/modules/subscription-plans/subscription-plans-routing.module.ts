import { SubscriptionPlansComponent } from './subscription-plans.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionPlansComponent,
    data: {
      title: 'Subscription Plans Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionPlansRoutingModule {}
