import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from './http.service';
import 'rxjs/add/operator/map';


@Injectable()
export class UserdetailsService {

/**
   *
   *
   * @param {any} data
   * @returns {Observable<any>}
   *
   */

  constructor( private http: HttpService) { }
	private url : string ="assets/json/userdetails.json";
	getUserDetailsId(id){
  alert(id);
		return this.http.get(this.url)
		.map((response : Response)=>response.json());
	}
}