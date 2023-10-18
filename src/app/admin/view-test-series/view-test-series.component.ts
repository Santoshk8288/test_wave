import { Component, OnInit,TemplateRef } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { Router, ActivatedRoute }  from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-view-test-series',
    templateUrl: './view-test-series.component.html',
    styleUrls: ['./view-test-series.component.scss']
})
export class ViewTestSeriesComponent implements OnInit {
    test;
    public msg = 'Something Went wrong';

    constructor(private testSeries: TestSeriesService,
        private router: Router, private route: ActivatedRoute, private location: Location,
        private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute',router.url);
    }
    tests;
    sAdmin;
    seriesList;
    SerId;
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.route.params.subscribe(params => {
            this.SerId = +params['id'];
        });
        let token = {
            token: this.sAdmin[0].usr_token,
            serid: this.SerId
        }

        this.testSeries.getTestSeries(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.tests = result.data;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }

    goToView(id) {
        this.router.navigate(['/admin/view', id]);
    }
}