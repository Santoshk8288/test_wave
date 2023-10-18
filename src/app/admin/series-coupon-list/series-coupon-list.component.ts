import { Component, OnInit, TemplateRef,NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-series-coupon-list',
  templateUrl: './series-coupon-list.component.html',
  styleUrls: ['./series-coupon-list.component.scss']
})
export class SeriesCouponListComponent implements OnInit {

	public modalRef: BsModalRef;
    public openModal(template: TemplateRef < any > ) {
        this.modalRef = this.modalService.show(template);
    }
    constructor(private modalService: BsModalService,
        private course: CourseService, private router: Router,
        private route: ActivatedRoute, private location: Location,
        private zone: NgZone, private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);
    }
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }
    public msg = "Something went wrong";
    cpn={
    	cname : '',
    	cedate : '',
    	climit : ''
    }
    serId;
    sAdmin;
    coupons:any=[];
    pageNo=1;
    private couponTotalItems: number;
    private maxSize: number = 5;
    private couponCurrentPage: number = 1;
    itemPerPageLimit = 10;
    listEndLimit = 10;
    endLimit = 10;
    listPage;
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.listPage=this.commanService.getData('TS');
        this.serId  = this.commanService.getData('couponDetail');
            
        this.serId.ser_id = this.serId.ser_id == undefined ? this.serId.cd_serid : this.serId.ser_id;
        this.sAdmin[0].usr_token;
        this.listPage.ser_name=this.listPage.ser_name
        this.listPage = (this.listPage == null || this.listPage.SCLPN == (null || undefined)) ? {'QL' : 10, 'PN' : 1 ,'SCLPN' : 1,'SCLQL' : 10,'ser_name':this.listPage.ser_name} :  this.listPage;
        let limit = this.listPage.SCLQL;
        let pageNo = this.listPage.SCLPN;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);
        
        this.getCouponList({page : pageNo });
        
	}
     setPage(pageNo: number): void {
        this.couponCurrentPage = pageNo;
      }
    getCouponList(event: any): void{
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        this.pageNo = event.page;
        let token = {
            token: this.sAdmin[0].usr_token,
            serid: this.serId.ser_id,
            start : (event.page - 1) * 10,
            end : event.endLimit
        }

        this.commanService.setData('TS',{'PN' :this.listPage.PN,'QL' : this.listPage.QL,'SCLPN' : event.page,'SCLQL' : event.endLimit,'ser_name':this.listPage.ser_name})
        this.course.getSeriesCouponList(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.coupons=result.date[0];
                    this.couponTotalItems = result.date[1][0].totalCount;
                   let setPage = (this.couponTotalItems / event.endLimit ) <(event.page) ? 1 : event.page; 
                    setPage = this.couponCurrentPage<=event.page?this.couponTotalItems:setPage;
                    setTimeout(() => {this.couponTotalItems = setPage}, 100)
                   
                    //setTimeout(() => {this.couponCurrentPage = event.page}, 100)
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    addCoupon(cpn){
        if(cpn.climit == ('' || undefined) )
        {
            this.commanService.showAlert("Please enter total coupon");
            return;
        }
    	let token={
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            serid: this.serId.ser_id,
    		insname: this.sAdmin[0].ins_name,
    		count:cpn.climit
    	}
    	this.course.generateCoupon(token)
            .subscribe((result: any) => {
                if (result.status) {
                   this.commanService.showAlert(result.message);
                   cpn.climit = '';
                   this.getCouponList({page : this.pageNo }); 
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    removeCoupons(couponList){
        let token={
            token: this.sAdmin[0].usr_token,
            cdid: couponList.cd_id,
            serid: this.serId.ser_id,
            startIndex: couponList.cd_start_index,
            endIndex:couponList.cd_end_index
        }
        swal({
            title: 'Are you sure?',
            text: 'Want to delete Coupon ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.course.removeCouponList(token)
            .subscribe((result: any) => {
                if (result.status) {
                   this.commanService.showAlert(result.message);
                   this.getCouponList({page : this.pageNo }); 
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
            }
        })
        
    }
    goToCouponDetails(couponDetail){
        this.commanService.setData('couponDetail',couponDetail);
        this.router.navigate(['/admin/coupon']);
    }
    endLimitChange(limit){
       this.endLimit=limit;
       this.listEndLimit = limit;
        this.itemPerPageLimit = limit;
        this.getCouponList({
            page: 1,
            endLimit : limit
        });
    }
}
