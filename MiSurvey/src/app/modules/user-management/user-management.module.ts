import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

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

import { IconModule } from '@coreui/icons-angular';

import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    DropdownModule,
    UserManagementRoutingModule,
    CommonModule,
    CardModule,
    GridModule,
    UtilitiesModule,
    IconModule,
    NavModule,
    TabsModule,
    FormsModule,
    ModalModule,
    ButtonGroupModule,
    TableModule, 
    AvatarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    
  ],
  declarations: [
    UserManagementComponent,  
  ]
})
export class UserManagementModule {
}
