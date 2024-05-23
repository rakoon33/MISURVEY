import { UserActivityLogRoutingModule } from './modules/user-activity-log/user-activity-log-routing.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './shared';
import { Page404Component } from './shared/page404/page404.component';
import { Page500Component } from './shared/page500/page500.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ApiDocumentationsComponent } from '@docs-components/api-documentations/api-documentations.component';
import { CustomerSurveyComponent } from './modules/customer-survey/customer-survey.component';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'company-management',
        loadChildren: () =>
          import('./modules/company-management/company-management.module').then(
            (m) => m.CompanyManagementModule
          ),
      },
      {
        path: 'company-role-management',
        loadChildren: () =>
          import('./modules/company-roles-management/company-roles-management.module').then(
            (m) => m.CompanyRolesManagementModule
          ),
      },
      {
        path: 'survey-management',
        loadChildren: () =>
          import('./modules/survey-management/survey-management.module').then(
            (m) => m.SurveyManagementModule
          ),
      },
      {
        path: 'question-template',
        loadChildren: () =>
          import('./modules/question-template/question-template.module').then(
            (m) => m.QuestionTemplateModule
          ),
      },
      {
        path: 'customer-management',
        loadChildren: () =>
          import('./modules/customer-management/customer-management.module').then(
            (m) => m.CustomerManagementModule
          ),
      },
      {
        path: 'user-activity',
        loadChildren: () =>
          import('./modules/user-activity-log/user-activity-log.module').then(
            (m) => m.UserActivityLogModule
          ),
      },
      {
        path: 'survey-management/survey-method',
        loadChildren: () =>
          import(
            './modules/survey-management/survey-option/survey-option.module'
          ).then((m) => m.SurveyOptionModule),
      },
      {
        path: 'survey-management/question',
        loadChildren: () =>
          import(
            './modules/survey-management/question-to-ask/question-to-ask.module'
          ).then((m) => m.QuestionToAskModule),
      },
      {
        path: 'survey-management/survey-detailed/:id',
        loadChildren: () =>
          import(
            './modules/survey-management/survey-detailed/survey-detailed.module'
          ).then((m) => m.SurveyDetailedModule)
      },
      {
        path: 'survey-management/question/configure',
        loadChildren: () =>
          import(
            './modules/survey-management/question-configure/question-configure.module'
          ).then((m) => m.QuestionConfigureModule),
      },
      {
        path: 'survey-management/survey',
        loadChildren: () =>
          import(
            './modules/survey-management/survey-info/survey-info.module'
          ).then((m) => m.SurveyInfoModule)
      },
      {
        path: 'survey-report',
        loadChildren: () =>
          import(
            './modules/survey-report/survey-report.module'
          ).then((m) => m.SurveyReportModule)
      },
      {
        path: 'survey-report/survey-report-detail/:surveyId',
        loadChildren: () =>
          import('./modules/survey-report/survey-report-detail/survey-report-detail.module').then((m) => m.SurveyReportDetailModule) //,
      },
      {
        path: 'subscription-plans',
        loadChildren: () =>
          import('./modules/subscription-plans/subscription-plans.module').then((m) => m.SubscriptionPlansModule)
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./modules/user-profile/user-profile.module').then((m) => m.UserProfileModule)
      }
    ],
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'c/f/:SurveyLink',
    component: CustomerSurveyComponent,
    data: {
      title: 'Customer Survey Page',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  { path: 'api-docs', component: ApiDocumentationsComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
