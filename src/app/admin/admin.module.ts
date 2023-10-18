import {RouterModule,Routes} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'; 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

//Adding Component
import { AdminComponent } from './admin.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestSeriesListComponent } from './test-series-list/test-series-list.component';
import { NewTestDetailsComponent } from './new-test-details/new-test-details.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { StudentRegistrationComponent } from './student-registration/student-registration.component';
import { ViewComponent } from './view/view.component' ;
import { DashbordComponent } from './dashboard/dashbord.component';
import { StudentComponent } from './student/student.component';
import { SubjectComponent } from './subject/subject.component';
import { ViewTestSeriesComponent } from './view-test-series/view-test-series.component';
import { ProfileComponent } from './profile/profile.component';

//Adding Module
import { CoreModule } from '../core/index';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

//Adding Services
import { TestService } from './admin-services/test.service';
import { TestSeriesService } from './admin-services/test-series.service';
import { AddQuestionComponent } from './add-question/add-question.component';
import { CourseService } from './admin-services/course.service';


//Other
import { MyDatePickerModule } from 'mydatepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ModalModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { CourseListComponent } from './courseList/course-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { AddQuesPaperComponent } from './add-ques-paper/add-ques-paper.component';
import { PaginationModule } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { QuillEditorModule } from 'ngx-quill-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from '../core/guard/auth.guard';
import { FeedbackComponent } from './feedback/feedback.component';
import { ResultListComponent } from './result-list/result-list.component';
import { CouponComponent } from './coupon/coupon.component';
import { SeriesCouponListComponent } from './series-coupon-list/series-coupon-list.component';

TagInputModule.withDefaults({
    tagInput: {
        placeholder: 'Add new tag'
    }
});
const appRoutes: Routes = [

    {
        path: 'admin',
        component: AdminComponent,
        children: [{
                path: '',
                redirectTo: '/dashbord',
                canActivate:[AuthGuard],
                pathMatch: "full"
            },
            {
                path: 'testList',
                component: TestListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'testSeries',
                component: TestSeriesListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'newTestDetails',
                component: NewTestDetailsComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'newTestDetails/:tid',
                component: NewTestDetailsComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'addQuestion',
                component: AddQuestionComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'listQuestion',
                component: QuestionListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'courseList',
                component: CourseListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'addCourse/:crs',
                component: AddCourseComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'addPpr',
                component: AddQuesPaperComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'addPpr/:tid',
                component: AddQuesPaperComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'addQuestion/:qid',
                component: AddQuestionComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'registration',
                component: StudentRegistrationComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'registration/:sid',
                component: StudentRegistrationComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'view/:id',
                component: ViewComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'dashbord',
                component: DashbordComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'student',
                component: StudentComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'subject',
                component: SubjectComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'ViewTestSeriesComponent/:id',
                component: ViewTestSeriesComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'feedback',
                component: FeedbackComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'resultList',
                component: ResultListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'coupon',
                component: CouponComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            },
            {
                path: 'seriseCouponList',
                component: SeriesCouponListComponent,
                canActivate:[AuthGuard],
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    declarations: [
        AdminComponent,
        TestListComponent,
        NewTestDetailsComponent,
        TestSeriesListComponent,
        AddQuestionComponent,
        QuestionListComponent,
        CourseListComponent,
        AddCourseComponent,
        AddQuesPaperComponent,
        StudentRegistrationComponent,
        ViewComponent,
        DashbordComponent,
        StudentComponent,
        SubjectComponent,
        ViewTestSeriesComponent,
        ProfileComponent,
        FeedbackComponent,
        ResultListComponent,
        CouponComponent,
        SeriesCouponListComponent
        
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        MyDatePickerModule,
        CKEditorModule,
        // MultiselectDropdownModule,
        RouterModule.forChild(appRoutes),
        TimepickerModule.forRoot(),
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        ChartsModule,
        TagInputModule,
        BrowserAnimationsModule,
        QuillEditorModule

    ],
    entryComponents: [],
    exports: [
        AdminComponent,
        TestListComponent,
        TestSeriesListComponent,
        NewTestDetailsComponent,
        QuestionListComponent,
        AddQuestionComponent,
        CourseListComponent,
        StudentRegistrationComponent,
        ViewComponent,
        DashbordComponent,
        StudentComponent,
        SubjectComponent,
        ViewTestSeriesComponent,
        ProfileComponent,
        ChartsModule, NgForm
    ],
    providers: [TestService, TestSeriesService, CourseService, NgForm,AuthGuard],
})
export class AdminModule { }
