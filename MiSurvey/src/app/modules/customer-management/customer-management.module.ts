import { ReactiveFormsModule } from '@angular/forms';
import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { CustomerManagementComponent } from './customer-management.component';
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
  declarations: [
    CustomerManagementComponent,
  ],
  imports: [
    CommonModule,
    CustomerManagementRoutingModule,
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
  
  ]
})
export class CustomerManagementModule {}
