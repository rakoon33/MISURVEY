import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { ShareModule } from './shared/share.module';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './shared';
import { Page404Component } from './shared/page404/page404.component';
import { Page500Component } from './shared/page500/page500.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
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
  SurveyManagementEffects
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
const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
  Page404Component,
  Page500Component,
  LoginComponent,
  RegisterComponent,
  ApiDocumentationsComponent,
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
      SurveyManagementEffects
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
