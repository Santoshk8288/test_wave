import { Component, OnInit } from '@angular/core';
import { ForgotpasswordService } from '../core/services/forgotpassword.service';
import { Router }  from '@angular/router';

import {AuthService} from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  user: any = {};
  params:any={};
  status;
  loading:boolean=true;
  private msg = 'Something Went wrong';
  constructor(private forgotpwd : ForgotpasswordService,private router: Router,private authService : AuthService,
   private commanService : CommanService) { }

  ngOnInit() {
  }
  forgotpassword(){
    this.params = {
      username : this.user.userName
    }
    this.authService.doforgot(this.params).subscribe((result: any)=> { 
      if(result.status){
        result.data;
        this.commanService.showAlert(result.message);
        this.router.navigate(['/Login']);
      }else{
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }
  goBack(){
    this.router.navigate(['/Login']);
  }
  goreset(){
    this.router.navigate(['/passwordReset']);
  }
}
