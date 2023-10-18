import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { TestUserService } from '../../core/services/test-user.service';
import { UserExamService } from '../../core/services/userexam.service';
import {CommanService} from '../../core/services/comman.service';

@Component({
	selector: 'app-result',
	templateUrl: './result.component.html',
	styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

	constructor(private router: Router, private resultList: TestUserService, public userExamService: UserExamService, private commanService: CommanService) {}
	//var for get Api data
	users:any;
	loginUser;
	testDetails;
	gestUser;
	private msg = 'Something Went wrong';
	ngOnInit() {
		// call api and get data
		this.loginUser =this.commanService.getData('loginUser');
		let Resid = this.commanService.getData('Resid');
		this.testDetails=this.commanService.getData('testDetails');
	    this.gestUser = this.commanService.getData('gestUser');
	    if(this.gestUser){
	      this.loginUser = this.gestUser;
	    }
		let params = {
			token: this.loginUser[0].usr_token,
			resid: Resid,
        		usrtype: this.loginUser[0].usr_type
		}
		this.userExamService.getStudentResult(params).subscribe((result: any) => {
			if (result.status) {
				if(result.data)
				this.users = result.data[0];
			} else {
				this.users=0;
			}
		}, error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
	}
	// move to testSeries
	home() {
		window.close();
		window.opener.location.reload();
	}
}
