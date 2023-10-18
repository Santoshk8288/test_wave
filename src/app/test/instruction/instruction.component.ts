import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import {AuthService} from '../../core/services/auth.service';
import {CommanService} from '../../core/services/comman.service';
import { UserExamService } from '../../core/services/userexam.service';
@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.scss']
})
export class InstructionComponent implements OnInit {
  btnCheck : boolean;
  params : object;
  loginUser : object;
  testData : any;
  instruction;
  gestUser;
  loginUserData : object;
  private msg = 'Something Went wrong';
	constructor(private router: Router,private authService : AuthService,private commanService : CommanService,
  private userExamService:UserExamService) { 
    if(authService.getData() != false){
      this.btnCheck = authService.getData() == undefined ? false : true;
    }else{
      this.btnCheck = false;
    }

	}
  //move to exam
	next(){
    this.params = {
      token : this.loginUser[0].usr_token,
      testid : this.testData.test_id,
      stuid: this.loginUser[0].stu_id,
      usrtype:this.loginUser[0].usr_type
    }
    this.startTest(this.params);
  }
  Back(){
    this.authService.setData(false);
    this.router.navigate(['/test/exam']);
  }
	ngOnInit() {
    this.loginUser = this.commanService.getData('loginUser');
    this.testData = this.commanService.getData('testDetails');
    this.gestUser = this.commanService.getData('gestUser');
    if(this.gestUser){
      this.loginUser = this.gestUser;
    }
    this.loginUserData = this.loginUser[0];
    this.params = {
      token : this.loginUser[0].usr_token,
      testid : this.testData.test_id,
      stuid: this.loginUser[0].stu_id,
      testtype:this.testData.test_type == 0 ? '0':this.testData.test_type,
      usrtype:this.loginUser[0].usr_type
    }
    this.commanService.getInstruction(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.instruction = result.data[0];
      }else{
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
	}
  startTest(token){
    this.params = {
      token : this.loginUser[0].usr_token,
      testid : this.testData.test_id,
      stuid: this.loginUser[0].stu_id,
      usrtype : this.loginUser[0].usr_type
    }
    this.userExamService.startTest(this.params).subscribe((result: any)=> { 
      if(result.status){
        window.open("#/test/exam", "popup", "width=auto,height=auto");
        localStorage.removeItem('question');
        this.commanService.setData('Resid',result.resid);
      }else{
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }
}
