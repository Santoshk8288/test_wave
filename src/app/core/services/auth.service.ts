import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {

/**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   */
   private loginApi = 'login';
   private registrationApi = 'addStudent';
   private forgotApi = 'forgotPassword';
   private checkUserNameApi = 'isUsernameAvl';
   private chengePasswordApi = 'changePassword';
   private instituteRegiApi = 'addInstitute';
   private studentModfyApi = 'updateStudent';
   private studentLogout = 'logout';
   private gestLogout = 'guestUserLogout';
   private getStudentInfo = 'getStudentDetail';
   private resetPassword = 'resetPassword';
   private verifyCoupon = 'verifyGuestCoupon';
   private gestLogin = 'guestLoginOrRegister';

   loginUser;
   sharedData;
    
  constructor( private http: HttpService) { }
    //login Api
    doLogin(param){
      return this.http.post(this.loginApi,param).map((response : Response)=>response.json());
    }
    //user Name avalibility check
    verifyUserName(param){
      
      return this.http.post(this.checkUserNameApi,param).map((response : Response)=>response.json());
    }
    //student registration Api
    doRegistration(param){
      return this.http.post(this.registrationApi,param).map((response : Response)=>response.json());
    }
    //student forgotPassword Api
    doforgot(param){
      return this.http.post(this.forgotApi,param).map((response : Response)=>response.json());
    }
    //change password API
    doChangePassword(param){
      return this.http.post(this.chengePasswordApi,param).map((response : Response)=>response.json());
    }
    //institute registration
    doInstituteRegistration(param){
      return this.http.post(this.instituteRegiApi,param).map((response : Response)=>response.json());
    }
    //student modify
    doModifyStudent(param){
      return this.http.post(this.studentModfyApi,param).map((response : Response)=>response.json());
    }
    //student logout
    doStudentLogout(param){
      return this.http.post(this.studentLogout,param).map((response : Response)=>response.json());
    }
    //gest logout
    doGestLogout(param){
      return this.http.post(this.gestLogout,param).map((response : Response)=>response.json());
    }
    // get student details
    getStudentDetails(param){
      return this.http.post(this.getStudentInfo,param).map((response : Response)=>response.json());
    }
    // reset password
    userPasswordReset(param){
      return this.http.post(this.resetPassword,param).map((response : Response)=>response.json());
    }
    // Verify coupon code
    verifyCouponCode(param){
      return this.http.post(this.verifyCoupon,param).map((response : Response)=>response.json());
    }
    // Verify coupon code
    gestCouponLogin(param){
      return this.http.post(this.gestLogin,param).map((response : Response)=>response.json());
    }
    setData (data) {
      this.sharedData = data;
    }
    getData () {
      return this.sharedData;
    }
    isLogin(){
      this.loginUser = JSON.parse(localStorage.getItem('loginUser'));
      let loginAdmin = JSON.parse(localStorage.getItem('Sadmin'));
      let gestUser = JSON.parse(localStorage.getItem('gestUser'));
      if(this.loginUser == null)
        this.loginUser = loginAdmin == null ? gestUser : loginAdmin;

      if(this.loginUser != null ){

        if(this.loginUser[0].usr_type){
          return true;
        }
      }else{
        return false;
      }
    }
    getLoginUserData(){
      if(JSON.parse(localStorage.getItem('loginUser')) != null){
        return JSON.parse(localStorage.getItem('loginUser'))[0];
      }else if(JSON.parse(localStorage.getItem('Sadmin'))){
        return JSON.parse(localStorage.getItem('Sadmin'))[0];
      }else if(JSON.parse(localStorage.getItem('gestUser')))
        return JSON.parse(localStorage.getItem('gestUser'))[0];
    }
    updateStudent(param){
      return this.http.post('updateStudent',param).map((response : Response)=>response.json());
    }
    
}
