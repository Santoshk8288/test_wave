import { Component, OnInit,TemplateRef,NgZone } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router }  from '@angular/router';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {CommanService} from '../../core/services/comman.service';
import * as moment from 'moment';
@Component({
    selector: 'app-test-series-list',
    templateUrl: './test-series-list.component.html',
    styleUrls: ['./test-series-list.component.scss']
})

export class TestSeriesListComponent implements OnInit {
    public msg = "Something went wrong";
    public modalRef: BsModalRef;
    public openModal(template: TemplateRef < any > ) {
        this.modalRef = this.modalService.show(template);
    }

    testData;
    seriesName;
    itemPerPageLimit = 10;
    pageNo;
    listEndLimit = 10;
    endLimit= 10;
    searchSer='';
    private testSeriesTotalItems: number;
    private maxSize: number = 5;
    private testSeriesCurrentPage: number = 1;
    openModalView(template: TemplateRef < any > , index, srsName) {
        this.modalRef = this.modalService.show(template);
        let seriesID = this.testSeries.filter(series => series.ser_id === index.ser_id);
        let token = {
            token: this.sAdmin[0].usr_token,
            serid: seriesID[0].ser_id
        }
        this.seriesName = srsName;
        this.testlist.getTestSeries(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.testData = result.data;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    constructor(private modalService: BsModalService,
        private testlist: TestSeriesService, private zone: NgZone, private router: Router,
        private location: Location, private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute',router.url);
    }
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }
    testSeries;
    sAdmin;
    editSeriesName;
    editSer;
    series={
        sname: '',
        opendate : '',
        closedate: '' 
    }
    editSeriesDetail={
        sname: '',
        opendate : '',
        closedate: ''
    }
    ngOnInit() {
        this.commanService.removeLSData('QB','TL','','Stu','FB','StuH','Test','HR');
        this.sAdmin = this.commanService.getData('Sadmin');
        let TS=this.commanService.getData('TS');
        TS = TS == null ? {'QL' : 10, 'PN' : 1 } : TS;
        let limit = TS.QL;
        let pageNo = TS.PN;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);

        this.getTestSeries({
            page: pageNo != null || pageNo > 1 ?pageNo : 1,
            endLimit : limit == null ? 10 : limit!=10? limit : 10
        });
    }
    setPage(pageNo: number): void {
        this.testSeriesCurrentPage = pageNo;
      }
    getTestSeries(event: any): void{
        this.pageNo= event.page;
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: (event.page - 1) * 10,
            end: event.endLimit,
            name : this.searchSer
        }
        this.commanService.setData('TS',{'PN' : event.page,'QL' : event.endLimit})
        this.testlist.getSeriesList(token)
        .subscribe((result: any) => {
            if (result.status) {
                this.testSeries = result.data;
                this.testSeriesTotalItems = result.totalCount[0].totalCount;
            setTimeout(() => {this.testSeriesCurrentPage = event.page}, 100)
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }

    addSeries(name) {
        if (name.sname == '' || name.sname == undefined) {
            this.commanService.showAlert('Please enter test series name.');
            return false;
        }else if ((name.opendate)== '') {
            this.commanService.showAlert("Please enter open date.");
            return false;
        }else if ((name.closedate) == '') {
            this.commanService.showAlert("Please enter close date.");
            return false;
        }else if ((name.opendate) >= (name.closedate)) {
            this.commanService.showAlert("Open date must be less than end date.");
            return false;
        }

        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            sername: name.sname,
            opendate : moment(new Date(name.opendate), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
            closedate: moment(new Date(name.closedate), 'DD-MM-YYYY HH:mm:ss').utc().format('X')
        }
        this.testlist.addSeries(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.commanService.showAlert(result.message );
                    this.series={
                        sname: '',
                        opendate : '',
                        closedate: '' 
                    }
                    this.modalRef.hide();
                    this.getTestSeries({
                        page: this.pageNo
                    })
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    removeSeries(test) {
        let token = {
            token: this.sAdmin[0].usr_token,
            serid: test.ser_id
        }
        swal({
            title: 'Are you sure?',
            text: 'Want to delete test ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.testlist.deleteSeries(token)
                .subscribe((result: any) => {
                    if (result.status) {
                        this.commanService.showAlert('Test series deleted successfully.');
                        this.getTestSeries({
                        page: this.pageNo
                    })
                    } else {
                        this.commanService.checkToken(result);
                    }
                }, error => {
                    this.commanService.showAlert(this.msg);
                });
            }
        })
    }
    goToSeriesTest(test) {
        this.router.navigate(['/admin/ViewTestSeriesComponent', test.ser_id]);
    }

    searchTestSeries(name) {
        this.searchSer= name;
        this.getTestSeries({
            page: this.pageNo
        })
        
    }
    openEditSeriesModel(index){
        for (var i = 0; i < this.testSeries.length; i++) {
            if (this.testSeries[index] == this.testSeries[i]) {
                this.editSeriesName = this.testSeries[i];
                this.editSeriesDetail={
                    sname:  this.testSeries[i].ser_name,
                    opendate : moment (new Date(this.testSeries[i].ser_opendate * 1000)).format('YYYY-MM-DD'),
                    closedate: moment (new Date(this.testSeries[i].ser_closedate * 1000)).format('YYYY-MM-DD')
                }
                console.log(this.editSeriesDetail)
            }
        }
    }
    editSeries(series){
        if (series.sname == '' || series.sname == undefined) {
            this.commanService.showAlert('Please enter test series name.');
            return false;
        }else if ((series.opendate) >= (series.closedate)) {
            this.commanService.showAlert("Open date must be less than end date.");
            return false;
        }
    this.testlist.editSeries({
            token: this.sAdmin[0].usr_token,
            sername: series.sname,
            serid: this.editSeriesName.ser_id,
            opendate: moment(new Date(series.opendate), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
            closedate:moment(new Date(series.closedate), 'DD-MM-YYYY HH:mm:ss').utc().format('X')
        }).subscribe((result: any) => {
            if (result.status) {
                this.commanService.showAlert(result.message);
                this.editSeriesDetail={
                    sname: '',
                    opendate : '',
                    closedate: ''
                }
                this.modalRef.hide();
                this.getTestSeries({
                        page: this.pageNo
                    })
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    editCancel(){
        this.editSeriesDetail={
                    sname: '',
                    opendate : '',
                    closedate: ''
                }
        this.getTestSeries({
            page: this.pageNo
        })
    }
    endLimitChange(limit){
        this.endLimit=limit;
        this.commanService.setData('TS',{'PN' : 1,'QL' : limit})
        this.setPage(1);
        this.itemPerPageLimit = limit;
        this.getTestSeries({
            page: 1,
            endLimit : limit
        });
    }
    goToGenerateCoupon(ser){
        this.commanService.setData('TS',{'PN' : this.pageNo,'QL' : this.endLimit,'ser_name' : ser.ser_name})
        this.commanService.setData('couponDetail',ser);
        this.router.navigate(['/admin/seriseCouponList']);
    }
}
