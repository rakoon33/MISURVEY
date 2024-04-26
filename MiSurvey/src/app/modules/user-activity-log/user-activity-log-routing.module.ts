import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserActivityLogComponent } from './user-activity-log.component';

const routes: Routes = [
  {
    path: '',
    component: UserActivityLogComponent,
    data: {
      title: 'User Activity Log Management',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActivityLogRoutingModule {}
