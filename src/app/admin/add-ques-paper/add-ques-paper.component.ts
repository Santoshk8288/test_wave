import { Component, OnInit,NgZone } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { Router ,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
	selector: 'app-add-ques-paper',
	templateUrl: './add-ques-paper.component.html',
	styleUrls: ['./add-ques-paper.component.scss']
})
export class AddQuesPaperComponent implements OnInit {

	constructor(private testlist: TestSeriesService,
		private router: Router, private route: ActivatedRoute,
		private location: Location, private zone: NgZone, private commanService: CommanService,private authService : AuthService) {
		router.events.subscribe((url: any) => url);
		this.commanService.setData('previousRoute', router.url);
	}
	public reload(): any {
		return this.zone.runOutsideAngular(() => {
			this.ngOnInit();
		});
	}
	public msg = "Something went wrong"
	sAdmin;
	questions;
	testId;
	shiftSubject = [];
	testSubjects;
	totalQuestion;
	subjectQues = [];
	selectSIds = [];
	chooseId;
	quesDesc = [];
	maxSize: number = 5;
	bigTotalItems: number = 30;
	bigCurrentPage: number = 1;
	numPages: number = 0;
	desc;
    	questionSearch = '0';
	quesFilter=[];
	pageNo;
	ngOnInit() {
		this.route.params.subscribe(params => {
			this.testId = +params['tid'];
		});
		this.sAdmin = this.commanService.getData('Sadmin');
		this.pageChanged({
			page: 1,
			itemsPerPage: 10
		});
		this.searchId='all';
		if (this.testId) {
			setTimeout(()=>{
				this.getViewTestData({
					token: this.sAdmin[0].usr_token,
					testid: this.testId
				});
			},100);
			
		}
	}
    clearTestId(){
        this.authService.setData('');
    }
    srchQues = '';
	searchQuestion(srchQues) {
		this.searchId = this.searchId == 'all' ? '' : this.searchId;
		this.desc=srchQues;
		let token={token: this.sAdmin[0].usr_token,
		insid: this.sAdmin[0].ins_id,
		start: 0 ,
		end: 10,
		subid:this.searchId,
		desc:this.desc,
        searchBy: this.questionSearch
	}
		 
		this.getFiterQuestions(token);
		setTimeout(()=>{
			this.bigCurrentPage = 1;
		},100)
	}
	selectQuestionArr:any=[{
	    id:'',
	    ques:''
	}]
	//shift subject left to right
	shiftLeftToRight(index) {
		for (let i = 0; i < this.questions.length; i++) {
			if (this.questions[index] == this.questions[i]) {
				for (var k = 0; k < this.testSubjects.length; ++k) {
					if(this.testSubjects[k].tsmm_id == this.chooseId){
						if(this.testSubjects[k].tsmm_total_questions >this.shiftSubject.length){
							this.shiftSubject.push(this.questions[i]);
							this.questions.splice(index, 1);
						}else if(this.testSubjects[k].tsmm_total_questions == this.shiftSubject.length)
							this.commanService.showAlert('Question limit exceeded for this subject.');
					}
				}
				for (var j = 0; j < this.testSubjects.length; ++j) {
					if (this.testSubjects[j].tsmm_id == this.chooseId) {
						this.testSubjects[j].quesCount = this.shiftSubject.length;
					}
				}
			}
		}
	this.setTempQues();


	}
	//shift subject right to left
	shiftRightToLeft(index, ques) {
		for (let i = 0; i < this.shiftSubject.length; i++) {
			if (this.shiftSubject[index] == this.shiftSubject[i]) {
				this.shiftSubject.splice(index, 1);
				this.questions.push(ques);
			}
		}
		for (let i = 0; i < this.testSubjects.length; ++i) {
			// code...
			if (this.testSubjects[i].tsmm_id == this.chooseId) {
				this.testSubjects[i].quesCount = this.shiftSubject.length;
			}
		}
		this.setTempQues();
	}
	setTempQues(){
		if(this.selectQuestionArr[0].id ==""){
		    this.selectQuestionArr[0]={
		        id:this.chooseId,
		        ques:this.shiftSubject
		    }
		}
		let test = this.selectQuestionArr.map(a => a.id);
		if(!test.length){
			this.selectQuestionArr.push({
        id:this.chooseId,
        ques:this.shiftSubject
    	})
		}
		else{
			if(test.indexOf(this.chooseId) ==-1){
				this.selectQuestionArr.push({
	        id:this.chooseId,
	        ques:this.shiftSubject
	    	})
			}
			else{
				console.log(123)
			}
		}
	}
	//remove question
	removeQues(index, ques) {
		let token = {
			token: this.sAdmin[0].usr_token,
			tqmid: ques.tqm_id
		}
		var addQues = confirm("Want to delete question from subject ?");
		if (addQues == true) {
			this.testlist.deleteTestSubjectQuestion(token)
				.subscribe((result: any) => {
					if (result.status) {
					   // this.reload();
						this.shiftSubject.splice(index,1);
						this.questions.push(ques);
				   	for (let j = 0; j < this.testSubjects.length; ++j) {
							if (this.testSubjects[j].tsmm_id == this.chooseId) {
								this.testSubjects[j].quesCount = this.shiftSubject.length;
								//this.shiftSubject = sQues;
							}
						} 
					} 
					else {
						this.commanService.checkToken(result);
					}
				}, error => {
					this.commanService.showAlert(this.msg);
				});
		}
	}

	//get question data
	getViewTestData(token) {

		this.testlist.getTest(token)
			.subscribe((result: any) => {
				if (result.status) {
					 let count=0;
					this.totalQuestion = result.data[0].test_total_questions
					this.testSubjects = result.data[0].subjects;
					this.chooseId =this.testSubjects[0].tsmm_id;
					this.getTestQuestion({token: this.sAdmin[0].usr_token,tsmmid: this.chooseId,
								start: '',end: ''});
					for (var i = 0; i < this.testSubjects.length; ++i) {
						// code...
						if(this.testSubjects[i].questions.length !=0)
						this.testSubjects[i].quesCount = this.testSubjects[i].questions.length;
						else
						   this.testSubjects[i].quesCount=0; 
					}
				  
				} else {
					this.commanService.checkToken(result);
				}
			}, error => {
				this.commanService.showAlert(this.msg);
			});
	}

	getSubjectId(id,index) {
		this.chooseId = id;
		let subQues = {
			token: this.sAdmin[0].usr_token,
			tsmmid: id,
			start: '',
			end: ''
		}

		this.getTestQuestion(subQues);
		if (this.selectSIds.includes(id)) {
			var testID = this.quesDesc.filter(test => test.tsmmid === id);
			this.shiftSubject = testID[0].question;
			

		}

	}

	saveQuestion(){
		let id = [];
		let selectQuesWithSid = {};
		for (var i = 0; i < this.selectQuestionArr.length; ++i) {
			for (let j = 0; j < this.selectQuestionArr[i].ques.length; ++j) {
				
				id.push(this.selectQuestionArr[i].ques[j].que_id)
				
			}
						this.subjectQues.push({
							tsmmid: this.selectQuestionArr[i].id,
							queid: [{
								id: id
							}]
					});
				selectQuesWithSid = {
				token: this.sAdmin[0].usr_token,
				questions: this.subjectQues
			}
			if(this.selectQuestionArr[i].ques.length == id.length)
					id=[];
	}

	if(this.selectQuestionArr[0].id == ""){
		this.router.navigate(['/admin/testList']);
		this.authService.setData(this.testId);
	}else{
	 	this.addTestSubjectQuestion(selectQuesWithSid);
	 	this.authService.setData(this.testId);
	}
}
	//add question in subject
	addTestSubjectQuestion(token) {
	   this.testlist.addTestSubjectQuestion(token)
					.subscribe((result: any) => {
						if (result.status) {
							this.commanService.showAlert(result.message);
							this.router.navigate(['/admin/testList']);
						} else {
							this.commanService.checkToken(result);

						}
					}, error => {
						this.commanService.showAlert(this.msg);
					});
	}
	
	//get question of subject
	getTestQuestion(token) {
		this.testlist.getTestQuestion(token)
			.subscribe((result: any) => {
				if (result.status) {
					let sQues =result.data;
					
					let quesid = this.quesFilter.map(a => a.que_id);
					let squeid = sQues.map(a => a.que_id || a.queid);
					let c = quesid.filter(function(item) {
						return squeid.indexOf(item) === -1;
					});
					let k = 0;
					this.questions=[];
					for (let i = 0; i < this.quesFilter.length; ++i) {

						if (c[k] == this.quesFilter[i].que_id) {
							this.questions.push(this.quesFilter[i])
							k++
						}

					}

					  for (let j = 0; j < this.testSubjects.length; ++j) {
						if (this.testSubjects[j].tsmm_id == this.chooseId) {
							this.testSubjects[j].quesCount = sQues.length;
							this.shiftSubject = sQues;
							for(let j=0; j<sQues.length; j++){
					            this.shiftSubject[j] = {
					                que_answer : this.shiftSubject[j].que_answer,
					                que_description : decodeURI(this.shiftSubject[j].que_description),
					                que_id : this.shiftSubject[j].que_id,
					                que_optionA : decodeURI(this.shiftSubject[j].que_optionA),
					                que_optionB : decodeURI(this.shiftSubject[j].que_optionB),
					                que_optionC : decodeURI(this.shiftSubject[j].que_optionC),
					                que_optionD : decodeURI(this.shiftSubject[j].que_optionD),
					                que_optionE : this.shiftSubject[j].que_optionE == "" ? "" : decodeURI(this.shiftSubject[j].que_optionE),
					                que_remark : this.shiftSubject[j].que_remark,
					                que_subid : this.shiftSubject[j].que_subid,
					                sub_name : this.shiftSubject[j].sub_name,
					                tag_id : this.shiftSubject[j].tag_id,
					                tag_name : this.shiftSubject[j].tag_name,
					            }
					        }
						}
					}
					this.getTempSubject();
					
				} else {
					this.commanService.checkToken(result);
				}
			}, error => {
				this.commanService.showAlert(this.msg);
			});
	}
	getTempSubject(){
		if(this.selectQuestionArr.length !=0){
			for (let j = 0; j < this.selectQuestionArr.length; ++j) {
						if (this.selectQuestionArr[j].id == this.chooseId) {
							this.shiftSubject = this.selectQuestionArr[j].ques;
							//this.quesFilter=this.selectQuestionArr[j].ques;
							this.quesFilter=this.quesFilter;
							this.testSubjects[j].quesCount=this.shiftSubject.length;
							let quesid = this.quesFilter.map(a => a.que_id);
							let sQues;
							for (let j = 0; j < this.selectQuestionArr.length; ++j) {
								if ((this.selectQuestionArr[j].id == this.chooseId)) {
									sQues = this.selectQuestionArr[j].ques;
								}
							}
							let squeid = sQues.map(a => a.que_id || a.queid);
							let c = quesid.filter(function(item) {
								return squeid.indexOf(item) === -1;
							});
							let k = 0;
							this.questions=[];
							for (let i = 0; i < this.quesFilter.length; ++i) {
	
								if (c[k] == this.quesFilter[i].que_id) {
									this.questions.push(this.quesFilter[i])
									k++
								}
	
							}
						}
					}
			}
	}
	//pagination
	pageChanged(event: any): void {
		let token = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			start: (event.page - 1) * 10,
			end: 10,
			subid:'',
			desc:'',
			searchBy: this.questionSearch
		}
		if(this.searchId !='all' && (this.pageNo !=0 || this.pageNo ==0)){
			token={token: this.sAdmin[0].usr_token,insid: this.sAdmin[0].ins_id,
			start: (event.page - 1) * 10 ,end: 10, subid:this.searchId,desc:this.srchQues,searchBy: this.questionSearch}
		this.getFiterQuestions(token);
		this.pageNo=(event.page - 1) * 10;
		}else{
			this.getQuestionList(token);
			this.pageNo=(event.page - 1) * 10;
			}
	}
	decodeQuestions(ques){
        for(let j=0; j<ques.length; j++){
            this.quesFilter[j] = {
                que_answer : this.quesFilter[j].que_answer,
                que_description : decodeURI(this.quesFilter[j].que_description),
                que_id : this.quesFilter[j].que_id,
                que_optionA : decodeURI(this.quesFilter[j].que_optionA),
                que_optionB : decodeURI(this.quesFilter[j].que_optionB),
                que_optionC : decodeURI(this.quesFilter[j].que_optionC),
                que_optionD : decodeURI(this.quesFilter[j].que_optionD),
                que_optionE : this.quesFilter[j].que_optionE == "" ? "" : decodeURI(this.quesFilter[j].que_optionE),
                que_remark : this.quesFilter[j].que_remark,
                que_subid : this.quesFilter[j].que_subid,
                sub_name : this.quesFilter[j].sub_name,
                tag_id : this.quesFilter[j].tag_id,
                tag_name : this.quesFilter[j].tag_name,
            }
        }
    }
	getQuestionList(token){
		this.testlist.getQuestionList(token)
			.subscribe((result: any) => {
				if (result.status) {
					this.quesFilter =result.data;
					//this.questions = result.data;
					this.bigTotalItems = result.totalCount[0].totalCount;
					this.decodeQuestions(this.quesFilter);
				   this.filterQuestions()
				} else {
					this.commanService.checkToken(result);
				}
			}, error => {
				this.commanService.showAlert(this.msg);
			});
	}
	searchId = '';
	searchBySubject(id){
		this.searchId=id;
		let token;
		if(id == 'all'){
			token={token: this.sAdmin[0].usr_token,insid: this.sAdmin[0].ins_id,
			start: 0 ,end: 10,subid:'',desc: this.srchQues,searchBy: this.questionSearch}
			
		}else{
			token={token: this.sAdmin[0].usr_token,insid: this.sAdmin[0].ins_id,
			start: 0 ,end: 10, subid:this.searchId,desc:this.srchQues,searchBy: this.questionSearch}
		 }
		 if(this.pageNo != 0){
		 	this.bigCurrentPage = 1;
		 	this.pageChanged({page:1})
		 	this.getTempSubject()
		 }else{
	 		 	this.getFiterQuestions(token);
	 		 	//

		 		 }

	}
	getFiterQuestions(token){
		this.testlist.getQuestionList(token)
			.subscribe((result: any) => {
				if (result.status) {
					this.quesFilter =result.data;
					this.bigTotalItems = result.totalCount[0].totalCount;
					this.decodeQuestions(this.quesFilter);
					this.filterQuestions()
				} else {
					this.commanService.checkToken(result);
				}
			}, error => {
				this.commanService.showAlert(this.msg);
			});
	}
	goBack() {
		this.location.back();
	}
	filterQuestions(){
		let c;
		let quesid = this.quesFilter.map(a => a.que_id);
		let sQues;
		if(this.testSubjects){
				for (let j = 0; j < this.testSubjects.length; ++j) {
					if ((this.testSubjects[j].tsmm_id == this.chooseId)) {
						this.testSubjects[j].questions=this.shiftSubject
						sQues = this.testSubjects[j].questions;
					}
				}

			let squeid = sQues.map(a => a.que_id || a.queid);
			 c = quesid.filter(function(item) {
				return squeid.indexOf(item) === -1;
			});
		
			let k = 0;
			this.questions=[];
			for (let i = 0; i < this.quesFilter.length; ++i) {

				if (c[k] == this.quesFilter[i].que_id) {
					this.questions.push(this.quesFilter[i])
					k++
				}

			}
		}  
	}
}
