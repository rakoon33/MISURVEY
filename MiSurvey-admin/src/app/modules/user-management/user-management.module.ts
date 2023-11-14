import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; 

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
  TabsModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';


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
    
  ],
  declarations: [
    UserManagementComponent,
  ]
})
export class UserManagementModule {
}
