import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HashLocationStrategy, Location, LocationStrategy,} from '@angular/common';

import { Http, HttpModule } from "@angular/http";
//Adding components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

import { TestModule } from './test/test.module';

//Adding Module
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/index';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
//Adding services

// adding rx operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';
import { ForgotComponent } from './forgot/forgot.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { InstituteRegistrationComponent } from './institute-registration/institute-registration.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { HistoryResultComponent } from './history-result/history-result.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { Validator } from './core/services/validation.service';
import { AuthGuard } from './core/guard/auth.guard';

const appRoutes: Routes = [
    { path: '', component : WelcomePageComponent , pathMatch:"full"},
    { path: 'Login', component : LoginComponent , pathMatch:"full" },
    { path: 'Admin', loadChildren: './admin/admin.module#AdminModule'},
    { path: 'test', loadChildren: './test/test.module#TestModule'},
    { path: 'Forgotpassword', component : ForgotComponent , pathMatch:"full" },
    { path: 'Dashboard', component : DashboardComponent ,canActivate:[AuthGuard], pathMatch:"full" },
    { path: 'changePassword', component : ChangePasswordComponent ,canActivate:[AuthGuard], pathMatch:"full" },
    { path: 'institute', component : InstituteRegistrationComponent  , pathMatch:"full"},
    { path: 'passwordReset', component : PasswordResetComponent },
    { path: 'historyResult', component : HistoryResultComponent ,canActivate:[AuthGuard], pathMatch:"full" },
    
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotComponent,
    DashboardComponent,
    ChangePasswordComponent,
    InstituteRegistrationComponent,
    PasswordResetComponent,
    WelcomePageComponent,
    HistoryResultComponent,
    LoadingIndicatorComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    TestModule,
    CoreModule,
    ChartsModule,
    RouterModule.forRoot(appRoutes, { useHash: false }),
    ModalModule.forRoot(),
    PaginationModule.forRoot()
  ],
  providers: [
  Validator,
  {provide: LocationStrategy, useClass: HashLocationStrategy},
  AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
