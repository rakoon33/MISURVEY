import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; 

import { CardModule, GridModule, NavModule, UtilitiesModule, TabsModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';

import { DropdownModule } from '@coreui/angular';
import { ModalModule } from '@coreui/angular';
import { ButtonGroupModule } from '@coreui/angular';

@NgModule({
  imports: [
    DropdownModule,
    UserManagementRoutingModule,
    CommonModule,
    UserManagementRoutingModule,
    CardModule,
    GridModule,
    UtilitiesModule,
    IconModule,
    NavModule,
    TabsModule,
    FormsModule,
    ModalModule,
    ButtonGroupModule
  ],
  declarations: [
    UserManagementComponent,
  ]
})
export class UserManagementModule {
}
