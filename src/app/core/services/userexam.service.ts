import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';
import * as moment from 'moment';


@Injectable()
export class UserExamService {

/**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   */
    private getTestApi = 'getTest';
    private getTestQuestions = 'getTestQuestion';
    private getUniqQuestion = 'getQuestion';
    private getResult = 'showResult';


  	constructor( private http: HttpService) { }

  	//get test Api
    getUserTest(param){
      return this.http.post(this.getTestApi,param).map((response : Response)=>response.json());
    }
    // get questions
    getQuestions(param){
		return this.http.post(this.getTestQuestions,param).map((response : Response)=>response.json());
	}
	// get questions
    getSelectQuestion(param){
		return this.http.post(this.getUniqQuestion,param).map((response : Response)=>response.json());
	}
	// get restult
    getStudentResult(param){
		return this.http.post(this.getResult,param).map((response : Response)=>response.json());
	}
	getAddTimeToCurrentTime(time){
		let momentFormate=moment().add(time.test_duration, 'minutes').format('MMM D,YYYY H:mm:ss');
		let countDownDate=new Date(momentFormate).getTime();
		localStorage.setItem('countDownDate',String(countDownDate));
  }

	getTestTime(){
		return localStorage.getItem('countDownDate');
	}

	setTestStatus(status){
		localStorage.setItem('status',status); 
	}
	getTestStatus(){
		let stau=localStorage.getItem('status');
		return stau;
	}
	startTest(param){
    return this.http.post('startTest',param).map((response : Response)=>response.json());
  }
  updateAnswer(param){
    return this.http.post('updateAnswer',param).map((response : Response)=>response.json());
  }
  submitTest(param){
    return this.http.post('submitTest',param).map((response : Response)=>response.json());
  }
  getTestQuestionAnswer(param){
    return this.http.post('getTestQuestionAnswer',param).map((response : Response)=>response.json());
  }
  getTestQuestionDetail(param){
    return this.http.post('getTestQuestionDetail',param).map((response : Response)=>response.json());
  }
  getTestResultDetail(param){
    return this.http.post('getTestResultDetail',param).map((response : Response)=>response.json());
  }
  addTestFeedbackAnswer(param){
    return this.http.post('addTestFeedbackAnswer',param).map((response : Response)=>response.json());
  }
  addTestFeedback(param){
    return this.http.post('addTestFeedback',param).map((response : Response)=>response.json());
  }
}
