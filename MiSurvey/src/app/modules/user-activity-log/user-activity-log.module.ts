import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserActivityLogRoutingModule } from './user-activity-log-routing.module';
import { UserActivityLogComponent } from './user-activity-log.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '@coreui/icons-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  DropdownModule,
  FormModule,
  ModalModule,
  ProgressModule,
  TableModule,
  CardModule,
  GridModule,
  NavModule,
  UtilitiesModule,
  TabsModule,
} from '@coreui/angular';

@NgModule({
  declarations: [UserActivityLogComponent],
  imports: [
    CommonModule,
    UserActivityLogRoutingModule,
    ReactiveFormsModule,
    IconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    AvatarModule,
    ButtonGroupModule,
    ButtonModule,
    DropdownModule,
    FormModule,
    ModalModule,
    ProgressModule,
    TableModule,
    CardModule,
    GridModule,
    NavModule,
    UtilitiesModule,
    TabsModule,
    FormsModule,
  ],
})
export class UserActivityLogModule {}
