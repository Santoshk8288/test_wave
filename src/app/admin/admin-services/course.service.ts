import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService} from '../../core/services/http.service';
import 'rxjs/add/operator/map';
@Injectable()
export class CourseService {

    /**
     *
     *
     * @param {any} data
     * @returns {Observable<any>}
     *
     */

    constructor(private http: HttpService) {}

    //private url : string ="assets/json/test-series.json";

    getDefaultCourse(param): Observable < any > {
        return this.http.post('getCourseList', param)
            .map((res: Response) => res.json());
    }


    addCourse(param): Observable < any > {
        return this.http.post('addCourse', param)
            .map((res: Response) => res.json());
    }

    getInstituteCourse(param): Observable < any > {
        return this.http.post('getInstituteCourse', param)
            .map((res: Response) => res.json());
    }

    // getDefaultSubject(param): Observable<any>{
    //   return this.http.post(
    //      'getSubjectList', param
    //     )
    //   .map((res : Response)=>res.json());
    // }

    addSubject(param): Observable < any > {
        return this.http.post('addSubject', param)
            .map((res: Response) => res.json());
    }
    editSubject(param): Observable < any > {
        return this.http.post('editSubject', param)
            .map((res: Response) => res.json());
    }
    // getInstituteSubject(param): Observable<any>{
    //   return this.http.post('getCategorySubject', param)
    //   .map((res : Response)=>res.json() );
    // }


    getSubjectList(param): Observable < any > {
        return this.http.post('getSubjectList', param)
            .map((res: Response) => res.json());
    }

    addSubjectInCourse(param): Observable < any > {
        return this.http.post('addSubjectInCourse', param)
            .map((res: Response) => res.json());
    }
    getCategorySubject(param): Observable < any > {
        return this.http.post('getCategorySubject', param)
            .map((res: Response) => res.json());
    }
    deleteCourse(param): Observable < any > {
        return this.http.post('deleteCourse', param)
            .map((res: Response) => res.json());
    }
    deleteSubjectFromCourse(param): Observable < any > {
        return this.http.post('deleteSubjectFromCourse', param)
            .map((res: Response) => res.json());
    }
    getStudentList(param): Observable < any > {
        return this.http.post('getStudentList', param)
            .map((res: Response) => res.json());
    }
    activeOrDeactiveStudent(param): Observable < any > {
        return this.http.post('activeOrDeactiveStudent', param)
            .map((res: Response) => res.json());
    }
    getStudentDetail(param): Observable < any > {
        return this.http.post('getStudentDetail', param)
            .map((res: Response) => res.json());
    }
    deleteSubject(param): Observable < any > {
        return this.http.post('deleteSubject', param)
            .map((res: Response) => res.json());
    }
    getInstituteTagList(param): Observable < any > {
        return this.http.post('getTagList', param)
            .map((res: Response) => res.json());
    }
    addTestFeedbackQuestion(param): Observable < any > {
        return this.http.post('addTestFeedbackQuestion', param)
            .map((res: Response) => res.json());
    }
    getTestFeedback(param): Observable < any > {
        return this.http.post('getTestFeedback', param)
            .map((res: Response) => res.json());
    }
    editCourse(param): Observable < any > {
        return this.http.post('editCourse', param)
            .map((res: Response) => res.json());
    }
    generateCoupon(param): Observable < any > {
        return this.http.post('generateCouponForSeries', param)
            .map((res: Response) => res.json());
    }
    getSeriesCouponList(param): Observable < any > {
        return this.http.post('getSeriesCouponList', param)
            .map((res: Response) => res.json());
    }
    getCouponList(param): Observable < any > {
        return this.http.post('getCoupons', param)
            .map((res: Response) => res.json());
    }
    removeCouponList(param): Observable < any > {
        return this.http.post('deleteCoupons', param)
            .map((res: Response) => res.json());
    }
}
