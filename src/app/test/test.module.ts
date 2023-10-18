import {RouterModule,Routes} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { RatingModule } from 'ngx-bootstrap';

import { TestComponent } from './test.component';
import { InstructionComponent } from './instruction/instruction.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ResultComponent } from './result/result.component';
import { HistoryComponent } from './history/history.component';
import { ProfileComponent } from './profile/profile.component';
import { ExamComponent } from './exam/exam.component';
import { TestseriesComponent } from './testseries/testseries.component';
import { CoreModule } from '../core/index';
import { PaginationModule } from 'ngx-bootstrap';
import { AuthGuard } from '../core/guard/auth.guard';

const appRoutes: Routes = [
     
    { path: 'test',
      component : TestComponent,
      children: [
        {path: '',redirectTo: '/test/testSeries',canActivate:[AuthGuard],pathMatch: "full"},
        { path: 'instruction', component:InstructionComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'feedback', component:FeedbackComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'result', component:ResultComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'history', component:HistoryComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'exam', component:ExamComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'profile', component:ProfileComponent,canActivate:[AuthGuard], pathMatch:"full" },
        { path: 'testSeries', component:TestseriesComponent,canActivate:[AuthGuard], pathMatch:"full" }
      ]
     }
];

@NgModule({
  declarations: [
   TestComponent,
   InstructionComponent,
   FeedbackComponent,
   ResultComponent,
   HistoryComponent,
   ProfileComponent,
   ExamComponent,
   TestseriesComponent
  ],
  imports: [
  BrowserModule,
  CommonModule,
  FormsModule,
  CoreModule,
  ReactiveFormsModule,
  RouterModule.forChild(appRoutes),
  PaginationModule.forRoot(),
  RatingModule.forRoot()

  ],
  entryComponents: [],
  exports:[
  TestComponent
    ],
  providers: [AuthGuard],
})
export class TestModule { }
