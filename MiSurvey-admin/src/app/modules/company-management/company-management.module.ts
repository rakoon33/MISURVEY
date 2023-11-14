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

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  declarations: [
    CompanyManagementComponent,
  ],
})
export class CompanyManagementModule {
}
