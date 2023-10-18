import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from '../../core/services/http.service';
import 'rxjs/add/operator/map';
@Injectable()
export class TestService {

    /**
     *
     *
     * @param {any} data
     * @returns {Observable<any>}
     *
     */

    constructor(private http: HttpService) {}
    // getTestById(){
    //     return [{
    //   "id": 1,
    //   "instituteId":"101",
    //   "testName" : "English Test"
    // },
    // {
    //   "id": 2,
    //   "instituteId":"102",
    //   "testName" : "Hindi Test"
    // },
    // {
    //   "id": 3,
    //   "instituteId":"103",
    //   "testName" : "Maths Test"
    // },
    // {
    //   "id": 4,
    //   "instituteId":"104",
    //   "testName" : "Apptitude Test"
    // },
    // {
    //   "id": 5,
    //   "instituteId":"105",
    //   "testName" : "Reasoning Test"
    // }]

    //      }

    private url: string = "assets/json/tests.json";
    getTestById() {
        return this.http.get(this.url)
            .map((response: Response) => response.json());
    }
}