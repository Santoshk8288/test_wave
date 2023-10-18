import { Component, OnInit,TemplateRef,NgZone } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Router }  from '@angular/router';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-test-list',
    templateUrl: './test-list.component.html',
    styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
    public modalRef: BsModalRef;
    public msg = "Something went wrong"
    test;
    testData;
    tests;
    sAdmin;
    seriesList;
    selectTestType = 'All';
    itemPerPageLimit = 10;
    searchName;
    pageNo;
    listEndLimit = 10;
    endLimit;
    private courseTotalItems: number;
    private maxSize: number = 5;
    private courseCurrentPage: number = 1;
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }
    public openModal(template: TemplateRef < any > , test) {

        this.modalRef = this.modalService.show(template);
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id
        }
        this.test = test;
        this.testSeries.getSeriesList(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.seriesList = result.data;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }


    openModalView(template: TemplateRef < any > , index) {
        this.modalRef = this.modalService.show(template);
        var testID = this.tests.filter(test => test.test_id === index.test_id);
        let token = {
            token: this.sAdmin[0].usr_token,
            testid: testID[0].test_id
        }
        this.testSeries.getTest(token)
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
        private testSeries: TestSeriesService,
        private router: Router, private location: Location,
        private zone: NgZone, private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute',router.url);
    }


    ngOnInit() {
        this.commanService.removeLSData('QB','','TS','Stu','FB','StuH','','HR');
        this.sAdmin = this.commanService.getData('Sadmin');
        let TL=this.commanService.getData('TL');
        TL = TL == null ? {'QL' : 10, 'type': 'All', 'PN' : 1 } : TL;
        let limit = TL.QL;
        this.selectTestType = TL.type;
        let pageNo = TL.PN;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);

        this.getInstituteTestList({
            page: pageNo != null || pageNo > 1 ?pageNo : 1,
            endLimit : limit == null ? 10 : limit!=10? limit : 10
        });
    }
    setPage(pageNo: number): void {
        this.courseCurrentPage = pageNo;
      }
    getInstituteTestList(event: any): void{

        this.pageNo = event.page;
        let selectType = this.selectTestType == undefined ? '' : this.selectTestType;
            selectType = selectType == '1' ? '1' : selectType == 'All' ? '' : '0';
        let token;
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        if(event.name){
           token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: (event.page - 1) * 10,
            end: event.endLimit,
            testtype : selectType,
            name:event.name
            }
        }else{
            token={
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: (event.page - 1) * 10,
            end: event.endLimit,
            testtype : selectType,
            name:this.searchName

            }
        }
        this.commanService.setData('TL',{'type' : this.selectTestType== '' ? '0' : this.selectTestType,'PN' : event.page,'QL' : event.endLimit})
        this.testSeries.getTestList(token)
        .subscribe((result: any) => {
            if (result.status) {
                this.tests = result.data;
                this.courseTotalItems = result.totalCount[0].totalCount;
                setTimeout(()=>{
                    this.courseCurrentPage = event.page
                },100)
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    getSelectTestType(type){
        this.getInstituteTestList({
            page: 1,
            selectTestType : type
        });
    }
    addTestInSeries(ser) {
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            serid: ser,
            testid: this.test.test_id
        }
        this.testSeries.addTestInSeries(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.commanService.showAlert(result.message );
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    getTestIdForEdit(id) {
        this.router.navigate(['/admin/newTestDetails', id]);
    }
    deleteTest(id) {
        let token = {
            token: this.sAdmin[0].usr_token,
            testid: id
        }
        let TL =this.commanService.getData('TL');
        let limit=TL.QL
        let pageNo=TL.PN
        
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
                this.testSeries.deleteTest(token)
                .subscribe((result: any) => {
                    if (result.status) {
                        this.commanService.showAlert('Test deleted successfully.')
                        this.getInstituteTestList({
                            page: this.pageNo
                        });
                    } else {
                        this.commanService.checkToken(result);
                    }
                }, error => {
                    this.commanService.showAlert(this.msg);
                });
            }
        })
    }
    /*status update with conformation*/
    testStatusUpdateAlert(test){
        let message ='';
        if(test.test_status ==0 || test.test_status =='0'){
            message ="Do you still want to publish ?";
        }
        else{
             message ="Do you want to unpublish ?";   
        }
        let token = {
            token: this.sAdmin[0].usr_token,
            testid: test.test_id,
            status:test.test_status == '0' ? 1 : '0'
        }
        swal({
            title: 'Question paper is incomplete',
            text: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.testSeries.changeTestStaus(token)
                .subscribe((result: any) => {
                    if (result.status) {
                        this.commanService.showAlert(result.message);
                        this.reload();
                    } else {
                        this.commanService.checkToken(result);
                    }
                }, error => {
                    this.commanService.showAlert(this.msg);
                });
            }
        }) 
    }
    /*End of code*/
    testStatusUpdate(test){
        let token = {
            token: this.sAdmin[0].usr_token,
            testid: test.test_id,
            status:test.test_status == '0' ? 1 : '0'
        }
        
        this.testSeries.changeTestStaus(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.commanService.showAlert(result.message);
                    this.reload();
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
    searchTestList(name) {
        this.searchName=name;
        this.commanService.setData('TL',{'type' : this.selectTestType,'PN' : 1,'QL' : 10})
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            name: name,
            page: 1,
        }
        this.getInstituteTestList(token);
    }
    endLimitChange(limit){
        this.endLimit=limit;
        this.commanService.setData('TL',{'type' : this.selectTestType== '' ? '0' : this.selectTestType,'PN' : 1,'QL' : limit})
        this.setPage(1);
        this.itemPerPageLimit = limit;
        this.getInstituteTestList({
            page: 1,
            endLimit : limit
        });
}
    goToTestResult(test){
        localStorage.setItem('Test' , JSON.stringify(test))
       this.router.navigate(['/admin/resultList']);
    }
}
