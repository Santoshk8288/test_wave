import { Component, OnInit, TemplateRef,NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
import {AuthService} from '../../core/services/auth.service';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
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
    sAdmin;
    coupons:any=[];
    pageNo=1;
    private couponTotalItems: number;
    private maxSize: number = 5;
    private couponCurrentPage: number = 1;
    itemPerPageLimit = 10;
    couponDetails;
    listEndLimit=10;
    endLimit = 10;
    listPage;
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.sAdmin[0].usr_token;
        this.couponDetails = this.commanService.getData('couponDetail');
        //this.serId = this.serId.ser_id == undefined ? this.serId.cd_serid : this.serId.ser_id;
        this.sAdmin[0].usr_token;
        this.listPage=this.commanService.getData('TS');
        this.listPage.ser_name=this.listPage.ser_name
        this.listPage = (this.listPage == null || this.listPage.CLPN == (null || undefined)) ? {'QL' : 10, 'PN' : 1 ,'SCLPN' : 1,'SCLQL' : 10,'CLPN' : 1,'CLQL' : 10,'ser_name':this.listPage.ser_name} :  this.listPage;
        let limit = this.listPage.CLQL;
        let pageNo = this.listPage.CLPN;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
       if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);
        
        this.getCouponListDetail({page : pageNo });
        
        
	}

     setPage(pageNo: number): void {
        this.couponCurrentPage = pageNo;
      }
    getCouponListDetail(event: any): void{
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        this.pageNo = event.page;
        let token = {
            token: this.sAdmin[0].usr_token,
            serid: this.couponDetails.cd_serid,
            startIndex:this.couponDetails.cd_start_index,
            endIndex: this.couponDetails.cd_end_index,
            start : (event.page - 1) * 10,
            end : event.endLimit
        }
        this.commanService.setData('TS',{'PN' :this.listPage.PN,'QL' : this.listPage.QL,'SCLPN' :this.listPage.SCLPN,'SCLQL' : this.listPage.SCLQL,'CLPN' : event.page,'CLQL' : event.endLimit,'ser_name':this.listPage.ser_name})
        this.course.getCouponList(token)
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
    gotoSeriesCoupon(){
        this.router.navigate(['/admin/seriseCouponList']);
    }
    endLimitChange(limit){
       this.endLimit=limit;
       this.listEndLimit = limit;
       this.couponCurrentPage = 1;
       this.setPage(1);
        this.itemPerPageLimit = limit;
        this.getCouponListDetail({
            page: 1,
            endLimit : limit
        });
}
}
