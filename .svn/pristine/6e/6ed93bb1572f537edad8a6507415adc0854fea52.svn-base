import { NgModule } from '@angular/core';
import { HttpModule, XHRBackend, RequestOptions, Http } from '@angular/http';

// Components

// Services
 import { CommanService } from './services/comman.service';
 import { ForgotpasswordService } from './services/forgotpassword.service';
 import { UserdetailsService } from './services/userdetails.service';
// import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { TestUserService } from './services/test-user.service';
import { TestSeriesService } from './services/test-series.service';
import { TestHistoryService } from './services/test-history.service';
import { AuthService } from './services/auth.service';
import { UserExamService } from './services/userexam.service';
// import { CommonService } from './services/common.service';

/* pipes*/
import { FilterByCountry } from './pipes/filter-by-country.pipe';
import { SafeHtmlPipe } from './pipes/filet-editor-tags';
// import { ProductDummyService } from './services/product-dummy.service';


export function httpInterceptor(
  backend: XHRBackend,
  defaultOptions: RequestOptions,
) {
  return new HttpService(backend, defaultOptions); 
}

@NgModule({
  declarations: [
    // components
    // DummyService,
    // pipes
    FilterByCountry,
    SafeHtmlPipe
    
  ],
  exports: [
    // components
    // DummyService,
    FilterByCountry,
    SafeHtmlPipe

  ],
  imports: [
  ],
  providers: [
    CommanService,
    ForgotpasswordService,
    UserdetailsService,
    TestUserService,
    TestSeriesService,
    TestHistoryService,
    AuthService,
    UserExamService,
    // UserService,
    // AuthService,
    // Validator,
    // CommonService,
    {
      provide: HttpService,
      useFactory: httpInterceptor,
      deps: [ XHRBackend, RequestOptions]
    }
  ]
})
export class CoreModule {}
