import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd, ActivatedRoute }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TestSeriesService } from '../admin-services/test-series.service';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService,
        private route: ActivatedRoute, private testSeriesService: TestSeriesService,
        private location: Location, private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute',router.url);
    }
    testData:any={
        tesName:'',
        testCourse:''
    }
    subject;
    public msg = "Something went wrong"
    sAdmin;
    testId;
    testdata=[];
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.route.params.subscribe(params => {
            this.testId = +params['id'];
        });
        let param = {
            token: this.sAdmin[0].usr_token,
            testid: this.testId,
            usrtype: 0
        }
        this.testSeriesService.getTest(param)
            .subscribe((result: any) => {
                if (result.status) {
                    this.subject = result.data[0].subjects;
                    let subjectLength = this.subject;
                    this.testData={
                        testName:result.data[0].test_name,
                        testCourse:result.data[0].course[0].cm_name
                    }

                    for(let j=0; j<subjectLength.length; j++){
                        for(let queCount=0; queCount<subjectLength[j].questions.length; queCount++){
                            this.subject[j].questions[queCount] = {
                                que_description : decodeURI(this.subject[j].questions[queCount].que_description),
                                que_id : this.subject[j].que_id,
                                que_optionA : decodeURI(this.subject[j].questions[queCount].que_optionA),
                                que_optionB : decodeURI(this.subject[j].questions[queCount].que_optionB),
                                que_optionC : decodeURI(this.subject[j].questions[queCount].que_optionC),
                                que_optionD : decodeURI(this.subject[j].questions[queCount].que_optionD),
                                que_optionE : this.subject[j].questions[queCount].que_optionE == "" ? "" : decodeURI(this.subject[j].questions[queCount].que_optionE),
                                que_remark : this.subject[j].questions[queCount].que_remark,
                                que_subid : this.subject[j].questions[queCount].que_subid,
                                tqm_id : this.subject[j].questions[queCount].tqm_id,
                            }
                        }
                    }
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
}
