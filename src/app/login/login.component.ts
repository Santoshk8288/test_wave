import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {AuthService} from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 	model: any = {};
  gestCheck : boolean = false;
  gestRegister : boolean = false;
  //couponDetail; 
  gestUserRegisterd : boolean = false;
  param;
  private msg = 'Something Went wrong';
  constructor(private router: Router,
   private authService : AuthService,
   private commanService : CommanService
  ) { }

  ngOnInit() {
    localStorage.clear();
  }

  couponDetail = {
    gest_id : '',
    gest_name : '',
    gest_email : ''
  }
  login() {
    this.authService.doLogin({username : this.model.username,password : this.model.password}).subscribe((result: any)=> { 
      if(result.status){
        result.data;
        if(result.data[0].usr_type == '2'){
          localStorage.clear();
          this.commanService.setData('loginUser',result.data);
          this.router.navigate(['/Dashboard']);
        }else if(result.data[0].usr_type == '1'){
          localStorage.clear();
          this.commanService.setData('Sadmin',result.data);
          this.router.navigate(['/admin/dashbord']);
        }else{
          localStorage.clear();
          this.commanService.setData('Sadmin',result.data);
          this.router.navigate(['/admin/dashbord']);
        }
      }else{
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
    });
  }
  /* Gest login by coupon*/
  gestLogin(){
    this.gestCheck = false;
    this.couponDetail;
    if(this.gestUserRegisterd){
      this.param = {
        name : "",
        email : "",
        coupon : this.model.verifyCoupon
      }
    }else{
      this.param = {
        name : this.couponDetail.gest_name,
        email : this.couponDetail.gest_email,
        coupon : this.model.verifyCoupon
      }
    }
    this.authService.gestCouponLogin(this.param).subscribe((result: any)=> { 
      if(result.status){
        let gest = [{  
            "usr_token":result.data[0].gst_token,
            "stu_id":result.data[0].gst_id,
            "stu_fname":result.data[0].gst_name,
            "stu_email":result.data[0].gst_email,
            "usr_type":result.data[0].usr_type,
            "ins_name":result.data[0].ins_name
        }];
        this.gestUserRegisterd = false;
        this.couponDetail = {
          gest_id : '',
          gest_name : '',
          gest_email : ''
        }
        this.commanService.setData('gestUser',gest);
        this.router.navigate(['/test/testSeries']);
      }else{
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
    });
  }
  /* Coupon verify*/
  checkCoupon(){
    this.authService.verifyCouponCode({coupon : this.model.verifyCoupon}).subscribe((result: any)=> { 
      if(result.status){
        if(result.data.length != 0){
          this.gestUserRegisterd = true;
            this.couponDetail = {
              gest_id : result.data[0].gst_id,
              gest_name : result.data[0].gst_name,
              gest_email : result.data[0].gst_email
            }
        }else{
          this.gestUserRegisterd = false;
        }

        this.gestRegister = true;
        this.gestCheck = false;
        //this.commanService.showAlert(result.message);
      }else{
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
    })
  }
  gestWindow(){
    this.model;
    this.gestCheck = true;
  }
  gestToLogin(){
    this.couponDetail = {
      gest_id : '',
      gest_name : '',
      gest_email : ''
    }
    this.model ={
      gestusername : '',
      gestEmail:'',
      verifyCoupon : ''
    } 
    this.gestRegister = false;
    this.gestCheck = false;
  }
}
