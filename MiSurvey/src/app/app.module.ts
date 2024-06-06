import { NgModule } from '@angular/core';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { ShareModule } from './shared/share.module';

import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { NotificationsSidebarComponent } from './shared/components/notifications-sidebar/notifications-sidebar.component';
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './shared';
import { Page404Component } from './shared/page404/page404.component';
import { Page500Component } from './shared/page500/page500.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ForgetPasswordComponent } from './modules/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
  TooltipModule,
  ModalModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';

// date time
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// store
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { reducers, metaReducers } from './core/store/storage-sync.reducer';

import {
  AuthEffects,
  UserEffects,
  UserManagementEffects,
  CompanyManagementEffects,
  CompanyEffects,
  SurveyManagementEffects,
  CustomerSurveyEffects,
  CompanyRolesManagementEffects,
  ModuleEffects,
  CompanyUserManagementEffects,
  CustomerFeedbackEffects, 
  QuestionTemplateEffects,
  CustomerManagementEffects
} from './core/store/effects';

import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

// api

import { ApiDocumentationsComponent } from '@docs-components/api-documentations/api-documentations.component';

// lottie

import { LottieModule } from 'ngx-lottie';

// Function required for ngx-lottie
export function playerFactory() {
  return import('lottie-web');
}

// customer survey
import { CustomerSurveyComponent } from './modules/customer-survey/customer-survey.component';


//chart
import { ChartjsModule } from '@coreui/angular-chartjs';

//qr code
import { QRCodeModule } from 'angularx-qrcode';


//socket 
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.BACKEND_BASE_URL, options: {} };



import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
  Page404Component,
  Page500Component,
  LoginComponent,
  RegisterComponent,
  ApiDocumentationsComponent,
  CustomerSurveyComponent,
  NotificationsSidebarComponent,
  ForgetPasswordComponent,
  ResetPasswordComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    FormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ShareModule,
    MatDialogModule,
    CommonModule,
    ChartjsModule,
    ModalModule,
    QRCodeModule,
    SocketIoModule.forRoot(config),
    LottieModule.forRoot({ player: playerFactory }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000,
      closeButton: true,
      newestOnTop: true,
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot([
      AuthEffects,
      UserEffects,
      UserManagementEffects,
      CompanyManagementEffects,
      CompanyEffects,
      SurveyManagementEffects,
      CustomerSurveyEffects,
      CompanyRolesManagementEffects,
      ModuleEffects,
      CompanyUserManagementEffects,
      CustomerFeedbackEffects,
      QuestionTemplateEffects,
      CustomerManagementEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    IconSetService,
    Title,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
