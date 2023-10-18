import { Component, OnInit } from '@angular/core';
import { CourseService } from '../admin-services/course.service';
import {CommanService} from '../../core/services/comman.service';
import { Router }  from '@angular/router';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  constructor(private courseService:CourseService, private commanService:CommanService,private router : Router) {
    router.events.subscribe((url: any) => url);
    this.commanService.setData('previousRoute', router.url);
     }
  sAdmin;
  feedback={
  	sAdmin: [],
  	feedLists:[]
  }
  maxSize: number = 5;
  bigTotalItems: number = 30;
  bigCurrentPage: number = 1;
  numPages: number = 0;
  listEndLimit = 10;
  endLimit;
  itemPerPageLimit = 10;
  ngOnInit() {
  	this.sAdmin = this.commanService.getData('Sadmin');
  	this.commanService.removeLSData('QB','TL','TS','Stu','','StuH','Test','HR');
  	    let FB=this.commanService.getData('FB');
        FB = FB == null ? {'QL' : 10, 'PN' : 1 } : FB;
        let limit = FB.QL;
        let pageNo = FB.PN;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);

        this.pageChanged({
            page: pageNo != null || pageNo > 1 ?pageNo : 1,
            endLimit : limit == null ? 10 : limit!=10? limit : 10
        });
  }
  setPage(pageNo: number): void {
        this.bigCurrentPage = pageNo;
      }
  pageChanged(event: any): void {
    if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        this.commanService.setData('FB',{'PN' : event.page,'QL' : event.endLimit});
       let token = {
          token: this.sAdmin[0].usr_token,
          insid: this.sAdmin[0].ins_id,
          start: (event.page - 1) * 10,
          end: event.endLimit
        }
    this.getFeedback(token);
    
  }
  getFeedback(token){
    this.courseService.getTestFeedback(token)
            .subscribe((result: any) => {

                if (result.status) {
                  this.feedback.feedLists=result.data[0];
                  let count = result.data[1]
                  this.bigTotalItems = count[0].totalCount;
                  } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert('Somethong went wrong.');
            });

  }
  endLimitChange(limit){
        this.endLimit=limit;
        this.commanService.setData('FB',{'PN' : 1,'QL' : limit})
        this.setPage(1);
        this.itemPerPageLimit = limit;
        this.pageChanged({
            page: 1,
            endLimit : limit
        });
}

}
