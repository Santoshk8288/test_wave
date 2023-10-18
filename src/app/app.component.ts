import { Component , OnInit} from '@angular/core';
import { Router,NavigationEnd,RoutesRecognized }  from '@angular/router';
import { AuthService } from './core/services/auth.service';
import {CommanService} from './core/services/comman.service';
import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	title = 'TESTWAVE';
  loginDetails;
  //var for set tab active status
  tabName:string = '/Dashboard';
  currentUrl;
  loginUser;
  params;
  previousUrlArray;
  previousUrl;
  checkUrls = [
    '/test/exam',
    '/test/instruction',
    '/Forgotpassword',
    '/Login',
    '/test/feedback',
    '/test/result',
    '/passwordReset',
    /*'/institute',
    '/admin/testList',
    '/admin/newTestDetails',
    '/admin/addQuestion',
    '/admin/listQuestion',
    '/admin/courseList',
    '/admin/addCourse/Bank',
    '/admin/addPpr',
    '/admin/testSeries',
    '/admin/registration',
    */
    '/'
  ];
	sAdmin:any=[];
  currenturl1;
  routing;
  outInstance;
  tempOutInstance;
  settab='Dashboard';
  routeUrl;
  gestUser;
	private msg = 'Something Went wrong';
	constructor(public authService : AuthService,
    private router: Router,private commanService : CommanService) {
    this.tempOutInstance=this.commanService.checkPreviousUrl();
    if(this.tempOutInstance){
      this.commanService.setData('previousUrl', this.tempOutInstance);
    }
    this.loginUser = this.commanService.getData('loginUser');
    this.sAdmin = this.commanService.getData('Sadmin');
    this.gestUser = this.commanService.getData('gestUser');
		if(this.loginUser){
			this.loginDetails = this.loginUser[0];
		}
		router.events.filter(e => e instanceof NavigationEnd)
		.subscribe((e: NavigationEnd) => {
			this.currentUrl = e.url;
			setTimeout(callback=>{
				window.scrollTo(0, 0);    
			},100)
		});
	}
	isCheckRoute() {
		this.tabName = this.currentUrl;
		if (!this.currentUrl) {
			return false;
		}
		const index = this.checkUrls.indexOf(this.currentUrl);
		if (index >= 0) {
			return false;
		} else if(this.currentUrl.includes('passwordReset'))
        return false;
          else {
  		      return true;
  		    }

	}
  //go Dashboard
  goDashboard(){
    this.tabName = '/Dashboard';
    this.settab='Dashboard';
    this.router.navigate(['/Dashboard']);
  }
  //go Testseries
  goTestseries(){
    this.settab='';
    this.tabName = '/test/testSeries';
    this.router.navigate(['/test/testSeries']);
  }
  //go Testseries
  goHistory(){
    this.settab='history';
    this.tabName = '/test/history';
    this.router.navigate(['/test/history']);
  }
  // go goStudentRegistration
  goStudentRegistration(){
    this.tabName = '/Student';
    this.router.navigate(['/Student']);
  }
  logOut(){
    this.settab='Dashboard';
    this.tabName = '/Dashboard';
    this.loginUser = this.commanService.getData('loginUser');
    let loginAdmin = this.commanService.getData('Sadmin');
      if(this.loginUser == null)
        this.loginUser = loginAdmin;

      if(this.loginUser == null)
        this.commanService.checkToken({message : 'Token expired.' });
      else{
        this.params = {
          token : this.loginUser[0].usr_token,
          usrid : this.loginUser[0].usr_id,
        }

        this.authService.doStudentLogout(this.params).subscribe((result: any)=> { 
          if(result.status){
              result.data;
              localStorage.clear();
              this.router.navigate(['/Login']);
          }else{
            this.commanService.checkToken(result);
          }
        },error => {
          this.commanService.showAlert(this.msg);
          console.log(error);
        });
      }
  }
  gestLogout(){
    let gestUser = JSON.parse(localStorage.getItem('gestUser'));
    this.params = {
      token : gestUser[0].usr_token,
      gstid : gestUser[0].stu_id,
    }
    this.authService.doGestLogout(this.params).subscribe((result: any)=> { 
      if(result.status){
          result.data;
          localStorage.clear();
          this.router.navigate(['/Login']);
      }else{
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }
  goProfile(){
  //  this.settab='setting';
    this.tabName = '/profile';
    this.loginUser = this.commanService.getData('loginUser');
      if(this.loginUser == null)
        this.router.navigate(['/admin/profile']);
      else
       this.router.navigate(['/test/profile']);
    
    
  }
  ngOnInit() {
    this.previousUrlArray=this.commanService.getLastUrl();
    if(this.previousUrlArray){
      this.commanService.setData('prevUrl', this.previousUrlArray[0].url);
    }
    this.previousUrl = this.commanService.getData('prevUrl');
        this.currenturl1=window.location.hash;
        if (this.currenturl1) {
            if (this.currenturl1 == '')
                this.currenturl1 = 'dashbord';
            if (this.currenturl1.includes("history") || this.currenturl1.includes("historyResult")) {
                if(this.previousUrl == '"/Dashboard"'){
                  this.settab ='Dashboard';
                  this.tabName = '/Dashbord';
                }
                else if(this.currenturl1 == "#/test/history"){
                  this.settab='history';
                  this.tabName = '/test/history';
                }
                else if(this.previousUrl.includes("/test/history"))
                {
                  this.settab='history';
                  this.tabName = '/test/history';
                }
            }
             else if(this.currenturl1.includes("Dashboard")){
              this.settab ='Dashboard';
                  this.tabName = 'Dashbord';
            } else if(this.currenturl1.includes('/test/testSeries')){
                  this.settab='/test/testSeries';
                  this.tabName = '/test/testSeries';
                }
        }
  }
  changePass(){
  //  this.settab='setting';
    this.tabName = '/changePassword';
    this.router.navigate(['/changePassword']);
  }
}
