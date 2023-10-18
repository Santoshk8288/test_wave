import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';


@Injectable()
export class ForgotpasswordService {

/**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   */
  constructor( private http: HttpService) { }
	private apiUrl : string ="assets/json/country.json";
   forgotPassword(email){
    return this.http.get(this.apiUrl)
    .map((response : Response)=>response.json());
  }
}