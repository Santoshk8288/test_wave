import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {CommanService} from '../../core/services/comman.service';
@Component({
	selector: 'app-testseries',
	templateUrl: './testseries.component.html',
	styleUrls: ['./testseries.component.scss']
})
export class TestseriesComponent implements OnInit {
	constructor(private router: Router, private commanService: CommanService) {

	this.previousUrlArray=this.commanService.getLastUrl();
    if(this.previousUrlArray){
      this.commanService.setData('prevUrl',this.previousUrlArray[0].url);
    }
    this.previousUrl=this.commanService.getData('prevUrl');

	}
	// var for get Api data
	previousUrlArray;
	previousUrl;
	testList = '';
	params: object;
	params1: object;
	loginUser: object;
	practiceTest: any = '';
	precticeTestItemPerPageLimit = 5;
	SpeedTestItemPerPageLimit = 5;
	gestUser;
	private precticeTestTotalItems: number;
	private SpeedTestTotalItems: number;
	private maxSize: number = 5;
	private precticeTestCurrentPage: number = 1;
	private SpeedTestCurrentPage: number = 1;
	private msg = 'Something Went wrong';
	ngOnInit() {
		// call api and get testList
		this.loginUser = this.commanService.getData('loginUser');
		this.gestUser = this.commanService.getData('gestUser');
		localStorage.removeItem('HR');
		if(this.loginUser){
			this.getTestListParms({
				page: 1
			});
		}else{
			this.getGestTestListParms({
				page: 1
			});
		}
	}
	/* user Test list Params */
	getTestListParms(event: any): void {
		this.params = {
			token: this.loginUser[0].usr_token,
			stuid: this.loginUser[0].stu_id,
			testtype: '0',
			start: (event.page - 1) * 5,
			end: 5,
			type :this.loginUser[0].scmm_type.toString()
		};
		this.params1 = {
			token: this.loginUser[0].usr_token,
			stuid: this.loginUser[0].stu_id,
			testtype: '1',
			start: (event.page - 1) * 5,
			end: 5,
			type: this.loginUser[0].scmm_type.toString()
		};
		this.getTestList(this.params);
		this.getTestList(this.params1);
	}
	/* Get user test List */
	getTestList(param) {
		this.commanService.getTestList(param).subscribe((result: any) => {
			if (result.status) {
				if (param.testtype == '0') {
					this.practiceTest = result.data[0];
					this.precticeTestTotalItems = result.data[1][0].totalCount;
				} else if (param.testtype == '1') {
					this.testList = result.data[0];
					this.SpeedTestTotalItems = result.data[1][0].totalCount;
				}
			} else {
				//this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
	}
	/* gestUser Test list Params */
	getGestTestListParms(event: any): void {
		this.params = {
			token: this.gestUser[0].usr_token,
			gstid: this.gestUser[0].stu_id,
			testtype: '0',
			start: (event.page - 1) * 5,
			end: 5,
			usrtype : this.gestUser[0].usr_type.toString()
		};
		this.params1 = {
			token: this.gestUser[0].usr_token,
			gstid: this.gestUser[0].stu_id,
			testtype: '1',
			start: (event.page - 1) * 5,
			end: 5,
			usrtype: this.gestUser[0].usr_type.toString()
		};
		this.getGestTestList(this.params);
		this.getGestTestList(this.params1);
	}
	/* Get user test List */
	getGestTestList(param) {
		this.commanService.getGestTestList(param).subscribe((result: any) => {
			if (result.status) {
				if (param.testtype == '0') {
					this.practiceTest = result.data[0];
					this.precticeTestTotalItems = result.data[1][0].totalCount;
				} else if (param.testtype == '1') {
					this.testList = result.data[0];
					this.SpeedTestTotalItems = result.data[1][0].totalCount;
				}
			} else {
				//this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
	}
	/*End test List*/
	// move to instruction
	goTest(details) {
		var redirectInstruction = window.open('', "popup", "width=auto,height=auto");
		this.commanService.setData('status', false);
		if(this.gestUser){
			this.loginUser = this.gestUser;
		}
		let params = {
			token: this.loginUser[0].usr_token,
			testid: details.test_id,
			usrtype: this.loginUser[0].usr_type,
			stuid: this.loginUser[0].stu_id,
			testtype: details.test_type == 0 ? '0' : details.test_type
		}
		this.commanService.getInstruction(params).subscribe((result: any) => {
			if (result.status) {
				if (result.data[0].res_status === 0) {
					details.res_id = result.data[0].res_id;
					details.res_status = '0';
					this.resumTest(details, redirectInstruction);
				} else if (result.data[0].res_status === 1) {
					redirectInstruction.close();
					this.commanService.showAlert('This test has been submitted already.');
					location.reload();
				} else {
					details.res_status = '1';
					this.commanService.setData('testDetails', details);
					this.commanService.setData('question', []);
					redirectInstruction.location.replace("#/test/instruction");
				}
			} else {
				redirectInstruction.close();
				this.commanService.checkToken(result);
			}
		}, error => {
			redirectInstruction.close();
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
	}
	resumTest(details, redirectExam) {
		//this.commanService.showAlert('This page is under construction.');
		localStorage.removeItem('question');
		this.commanService.setData('question', []);
		this.commanService.setData('Resid', details.res_id);
		this.commanService.setData('testDetails', details);
		redirectExam.location.replace("#/test/exam");
	}
}
