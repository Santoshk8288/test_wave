import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd }  from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    tabName:string = '/Dashboard';
    currentUrl;
    loginUser;
    params;
    routing;
    currenturl1;
    public msg = "Something went wrong";
  
    constructor(private router: Router, private authService: AuthService,private commanService: CommanService) {
        this.loginUser = this.commanService.getData('Sadmin');
        //this.loginUser = JSON.parse(localStorage.getItem('Sadmin'));
    }
     ngOnInit() {
       this.routing = this.commanService.getData('previousRoute');
       //this.routing = localStorage.getItem('previousRoute');
        let r = '"' + this.routing + '"';
        
        if (this.routing) {
            if (this.routing == '')
                this.routing = 'dashbord'
            if (this.routing.includes("testSeries") ) {
                this.tabName = '/admin/testSeries';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("test")|| this.routing.includes("addPpr")) {
                this.tabName = '/admin/testList';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("newTest")) {
                this.tabName = '/admin/testList';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("listQuestion") || this.routing.includes("addQuestion")) {
                this.tabName = '/admin/listQuestion';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("course")) {
                this.tabName = '/admin/courseList';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("addCourse")) {
                this.tabName = '/admin/courseList';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("registration")) {
                this.tabName = '/admin/student';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("subject")) {
                this.tabName = '/admin/subject';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("profile")) {
                this.tabName = '/admin/profile';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("dashbord")) {
                this.tabName = '/admin/dashbord';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("student")) {
                this.tabName = '/admin/student';
                this.router.navigate([this.tabName]);
            } else if (this.routing.includes("profile")) {
                this.tabName = '/admin/profile';
                this.router.navigate([this.tabName]);
            }else if (this.routing.includes("dashbord")) {
                this.tabName = '/admin/dashbord';
                this.router.navigate([this.tabName]);
            }else if (this.routing.includes("feedback")) {
                this.tabName = '/admin/feedback';
                this.router.navigate([this.tabName]);
            }else if (this.routing.includes("resultList")) {
                this.tabName = '/admin/resultList';
                this.router.navigate([this.tabName]);
            }else if (this.routing.includes("coupon")) {
                this.tabName = '/admin/testSeries';
                this.router.navigate(['/admin/coupon']);
            }else if (this.routing.includes("seriseCouponList")) {
                this.tabName = '/admin/testSeries';
                this.router.navigate(['/admin/seriseCouponList']);
            }
            else {
                this.tabName = '/admin/dashbord';
                this.router.navigate([this.tabName]);
            }
        }
    }
    logOut() {
        /*call api for logout*/
        if(!this.loginUser){
            this.router.navigate(['/Login']);
        }
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
              this.commanService.showAlert(result.message);
              this.router.navigate(['/Login']);
          }
        },error => {
          this.commanService.showAlert(this.msg);
          this.router.navigate(['/Login']);
          console.log(error);
        });
        
    }
    //go Dashboard
    goDashboard(){
      this.tabName = '/Dashboard';
      //this.settab='Dashboard';
      this.router.navigate(['/admin/dashbord']);
    }
    
}
