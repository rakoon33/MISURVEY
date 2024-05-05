import { SubscriptionPlansComponent } from './subscription-plans.component';

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
import { QRCodeModule } from 'angularx-qrcode';
import { IconModule } from '@coreui/icons-angular';
import { SubscriptionPlansRoutingModule } from './subscription-plans-routing.module';

@NgModule({
  imports: [
    DropdownModule,
    SubscriptionPlansRoutingModule,
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
    ReactiveFormsModule,
    QRCodeModule
  ],
  declarations: [
    SubscriptionPlansComponent
  ]
})
export class SubscriptionPlansModule {
}
