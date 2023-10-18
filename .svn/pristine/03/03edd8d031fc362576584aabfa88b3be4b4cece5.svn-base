import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import {CommanService} from '../core/services/comman.service';
import {AuthService} from '../core/services/auth.service';
@Component({
  selector: 'app-history-result',
  templateUrl: './history-result.component.html',
  styleUrls: ['./history-result.component.scss']
})
export class HistoryResultComponent implements OnInit {
	loginUser;
	params;
	resut;
	previousUrlArray;
	previousUrl;
	resultCount=1;
	studentDetails;
	gestUser;
	private msg = 'Something Went wrong';
    constructor( private router: Router,private commanService : CommanService,private authService : AuthService) {
    	router.events.subscribe((url: any) => url);
    	this.previousUrlArray=this.commanService.getLastUrl();
    	if(this.previousUrlArray){
    		this.commanService.setData('prevUrl',this.previousUrlArray[0].url);
    	}
    	this.previousUrl=this.commanService.getData('prevUrl');
    }
    tempOutInstance;
    ngOnInit() {
	  	//call api and get data
	  	this.loginUser =this.commanService.getData('loginUser');
	  	let Sadmin =this.commanService.getData('Sadmin');
		let resId =this.commanService.getData('res_id');
		this.studentDetails = this.commanService.getData('StuH');
		this.gestUser = this.commanService.getData('gestUser');
		if(this.loginUser== null && Sadmin != null || this.gestUser != null)
			this.loginUser = Sadmin == null ? this.gestUser : Sadmin;
		this.params = {
			token : this.loginUser[0].usr_token,
			resid : resId,
        		usrtype: this.loginUser[0].usr_type
		}
		//this.resut={"res_id":102,"res_testid":35,"res_stuid":1,"res_total_attempt":0,"res_correct_answer":0,"res_marks_abtain":0,"res_status":1,"res_time":"560303","res_createdate":"1514273012","res_updatedate":"1514273052","test_name":"test","test_total_questions":10,"test_duration":10,"test_max_marks":10,"test_min_marks":5,"test_type":0,"subject":[{"tsmm_id":179,"tsmm_testid":35,"tsmm_smid":1,"tsmm_total_questions":4,"tsmm_total_marks":4,"tsmm_negative_marks":0,"sub_name":"Hindi","attemptQues":2,"rightAns":1}]}
		this.commanService.showResult(this.params).subscribe((result: any)=> { 
			if(result.status){
				this.resultCount=1;
			  this.resut = result.data[0];
			}else{
				this.resultCount=0;
				this.commanService.checkToken(result);
			}
		},error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
    }
}
