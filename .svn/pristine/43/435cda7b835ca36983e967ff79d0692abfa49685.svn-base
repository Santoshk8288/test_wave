import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';
import swal from 'sweetalert2';
import { Http } from '@angular/http';
import { Router,NavigationEnd,ActivatedRoute,RoutesRecognized }  from '@angular/router';


@Injectable()
export class CommanService {
	/**
	*
	*
	* @param {any} data
	* @returns {Observable<any>}
	*
	*/
	private Instruction = 'getTestInstruction';
	private testList = 'getStudentTestList';
	private getStudentHistoryList = 'getStudentResultHistory';
	private getDashBoardCount = 'getStudentDashboardCounts';
	private questionImageUploads = 'uploadQuestionImage';
	private gestTestList = 'getGuestUserTestList';
	public previousUrlArray;

	constructor(private http: HttpService, private _http: Http, private router: Router) {}
	//get instruction of test exam
	getInstruction(param) {
		return this.http.post(this.Instruction, param).map((response: Response) => response.json());
	}
	//get getTestList of test exam
	getTestList(param) {
		return this.http.post(this.testList, param).map((response: Response) => response.json());
	}
	//get getGestTestList of test exam
	getGestTestList(param) {
		return this.http.post(this.gestTestList, param).map((response: Response) => response.json());
	}
	//get getHistoryTestList of test exam
	getHistoryTestList(param) {
		return this.http.post(this.getStudentHistoryList, param).map((response: Response) => response.json());
	}
	//get getDashBoardCount
	getDashboardCount(param) {
		return this.http.post(this.getDashBoardCount, param).map((response: Response) => response.json());
	}
	showAlert(msg) {
		swal(msg);
	}
	getStudentTestSeriesList(param): Observable < any > {
		return this.http.post('getStudentTestSeriesList', param)
		.map((res: Response) => res.json());
	}
	getStudentTestData(param): Observable < any > {
		return this.http.post('getStudentSevenTestData', param)
		.map((res: Response) => res.json());
	}
	getStudentMonthlyTestData(param): Observable < any > {
		return this.http.post('getStudentTestData', param)
		.map((res: Response) => res.json());
	}
	
	showResult(param): Observable < any > {
		return this.http.post('showResult', param)
		.map((res: Response) => res.json());
	}
	getCountryJson(): Observable < any > {
		return this._http.get('assets/json/countries.json').map((res) => res.json());
	}
	getStateJson(): Observable < any > {
		return this._http.get('assets/json/states.json').map((res) => res.json());
	}
	checkToken(result) {
		this.showAlert(result.message);
		if (result.message == 'Token expired.') {
			localStorage.clear();
			this.router.navigate(['/Login']);
		}
	}
	questionImageUpload(param): Observable < any > {
		return this.http.post(this.questionImageUploads, param)
		.map((res: Response) => res.json());
	}
	checkPreviousUrl() {
		this.router.events
		.filter((e: any) => e instanceof RoutesRecognized)
		.pairwise()
		.subscribe((e: any) => {
			if (e) {
				this.previousUrlArray = [];
				this.previousUrlArray.push(e[0]);
				return this.previousUrlArray;
			}
			return this.previousUrlArray;
		});
	}

	getLastUrl() {
		return this.previousUrlArray;
	}
	/*Localstorage*/
	setData(key: string, value: any) {
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    getData(key: string){
        let value: string = localStorage.getItem(key);

        if (value && value != "undefined" && value != "null") {
            return JSON.parse(value);
        }
        else{
        	return null;
        }
    }
    removeLSData(keyQB:any,keyTL:any,keyTS:any,keyStu:any,keyFB:any,keyStuH:any,keyTest:any,keyHR:any){
    	localStorage.removeItem(keyQB);
    	localStorage.removeItem(keyTL);
    	localStorage.removeItem(keyTS);
    	localStorage.removeItem(keyStu);
    	localStorage.removeItem(keyFB);
    	localStorage.removeItem(keyStuH);
    	localStorage.removeItem(keyTest);
    	localStorage.removeItem(keyHR);
    	
    }
	/*End of Localstorage function*/
}
