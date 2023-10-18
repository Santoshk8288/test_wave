import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from '../../core/services/http.service';
import 'rxjs/add/operator/map';
@Injectable()
export class TestSeriesService {

    /**
     *
     *
     * @param {any} data
     * @returns {Observable<any>}
     *
     */

    constructor(private http: HttpService) {}

    private url: string = "assets/json/test-series.json";
    getTestById() {
        return this.http.get(this.url)
            .map((response: Response) => response.json());
    }


    addQuestion(data): Observable < any > {
        return this.http.post('addQuestion', data)
            .map((res: Response) => res.json());
    }

    addTestDetail(data): Observable < any > {
        return this.http.post('createTest', data)
            .map((res: Response) => res.json());
    }
    updateTest(param): Observable < any > {
        return this.http.post('updateTest', param)
            .map((res: Response) => res.json());
    }
    addTestSubjectQuestion(param): Observable < any > {
        return this.http.post('addTestSubjectQuestion', param)
            .map((res: Response) => res.json());
    }
    getTestQuestion(param): Observable < any > {
        return this.http.post('getTestQuestion', param)
            .map((res: Response) => res.json());
    }
    getQuestionList(param): Observable < any > {
        return this.http.post('getQuestionList', param)
            .map((res: Response) => res.json());
    }
    getTestList(param): Observable < any > {
        return this.http.post('getTestList', param)
            .map((res: Response) => res.json());
    }
    addTestInSeries(param): Observable < any > {
        return this.http.post('addTestInSeries', param)
            .map((res: Response) => res.json());
    }
    addSeries(param): Observable < any > {
        return this.http.post('addSeries', param)
            .map((res: Response) => res.json());
    }
    getSeriesList(param): Observable < any > {
        return this.http.post('getSeriesList', param)
            .map((res: Response) => res.json());
    }
    getTest(param): Observable < any > {
        return this.http.post('getTest', param)
            .map((res: Response) => res.json());
    }
    getTestSeries(param): Observable < any > {
        return this.http.post('getTestSeries', param)
            .map((res: Response) => res.json());
    }
    getQuestion(param) {
        return this.http.post('getQuestion', param)
            .map((res) => {
                return res.json()
            });
    }
    udateQuestion(param): Observable < any > {
        return this.http.post('updateQuestion', param)
            .map((res: Response) => res.json());
    }
    deleteTest(param): Observable < any > {
        return this.http.post('deleteTest', param)
            .map((res: Response) => res.json());
    }
    deleteQuestion(param): Observable < any > {
        return this.http.post('deleteQuestion', param)
            .map((res: Response) => res.json());
    }

    deleteSeries(param): Observable < any > {
        return this.http.post('deleteSeries', param)
            .map((res: Response) => res.json());
    }
    deleteTestSubjectQuestion(param): Observable < any > {
        return this.http.post('deleteTestSubjectQuestion', param)
            .map((res: Response) => res.json());
    }
    getAdminDashboardCounts(param): Observable < any > {
        return this.http.post('getAdminDashboardCounts', param)
            .map((res: Response) => res.json());
    }
    getUpcomingTestData(param): Observable < any > {
        return this.http.post('getUpcomingTestData', param)
            .map((res: Response) => res.json());
    }
    lastYearStudentData(param): Observable < any > {
        return this.http.post('lastYearStudentData', param)
            .map((res: Response) => res.json());
    }
    getInstituteDetail(param): Observable < any > {
        return this.http.post('getInstituteDetail', param)
            .map((res: Response) => res.json());
    }
    updateInstitute(param): Observable < any > {
        return this.http.post('updateInstitute', param)
            .map((res: Response) => res.json());
    }
    editSeries(param): Observable < any > {
        return this.http.post('editSeries', param)
            .map((res: Response) => res.json());
    }
    changeTestStaus(param): Observable < any > {
        return this.http.post('changeTestStaus', param)
            .map((res: Response) => res.json());
    }
	getResultsOfTest(param): Observable < any > {
        return this.http.post('getResultsOfTest', param)
            .map((res: Response) => res.json());
    }
}
