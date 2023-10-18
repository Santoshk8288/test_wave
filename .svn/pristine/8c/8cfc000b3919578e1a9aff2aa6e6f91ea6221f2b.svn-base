import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from '../../core/services/http.service';
import 'rxjs/add/operator/map';

@Injectable()
export class TestSeriesService {

  	constructor(private http: HttpService) { }

  	private url : string ="assets/json/testSeries.json";
	getSeriesById(){
		return this.http.get(this.url)
		.map((response : Response)=>response.json());
	}
}
