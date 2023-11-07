import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; 

import { CardModule, GridModule, NavModule, UtilitiesModule, TabsModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { CompanyManagementComponent } from './company-management.component';
import { CompanyManagementRoutingModule } from './company-management-routing.module';

import { DropdownModule } from '@coreui/angular';
import { ModalModule } from '@coreui/angular';
import { ButtonGroupModule } from '@coreui/angular';

@NgModule({
  imports: [  
    CommonModule,
    CompanyManagementRoutingModule,
    CardModule,
    GridModule,
    UtilitiesModule,
    IconModule,
    NavModule,
    TabsModule,
    FormsModule,
    DropdownModule,
    ModalModule,
    ButtonGroupModule,
  ],
  declarations: [
    CompanyManagementComponent,
  ]
})
export class CompanyManagementModule {
}
