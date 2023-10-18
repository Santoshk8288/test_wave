import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd }  from '@angular/router';

import {AuthService} from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Validator } from '../core/services/validation.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
	public userPssword = {
		newPassword : '',
		confirmPassword : ''
	}
  loginUser:any;
  loading : boolean= true;
  passwordreset: FormGroup;
  params;
  currentUrl;
  private msg = 'Something Went wrong';
  constructor(private formBuilder: FormBuilder,private validator :Validator,private router: Router,private authService : AuthService,
   private commanService : CommanService) {
    router.events.filter(e => e instanceof NavigationEnd)
    .subscribe((e: NavigationEnd) => {
      this.currentUrl = e.url;
      setTimeout(callback=>{
        window.scrollTo(0, 0);    
      },100)
    });
  }

	ngOnInit() {

    this.passwordreset = this.formBuilder.group({
      newPassword : ['',[Validators.required,this.validator.validatePass]],
      confirmPassword : ['',[Validators.required]],
    },{validator:this.validator.validateConfirmPass('newPassword', 'confirmPassword')});
	}
	resetPassword(){
    let formdata = this.passwordreset.value;
    let id = this.currentUrl.split('=');
    this.params = {
      id : id[1],
      password : formdata.newPassword
    }
    this.authService.userPasswordReset(this.params).subscribe((result: any)=> { 
      if(result.status){  
        this.commanService.showAlert(result.message);
        window.location.href='#/Login';
      }else{
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
	}

}
