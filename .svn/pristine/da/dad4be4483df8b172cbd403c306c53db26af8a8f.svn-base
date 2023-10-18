import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import {CommanService} from '../../core/services/comman.service';
import {AuthService} from '../../core/services/auth.service';
import { TestSeriesService } from '../admin-services/test-series.service';


@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
	constructor(private commanService : CommanService,private router: Router,private authService : AuthService, private testSeriesService : TestSeriesService) {
    router.events.subscribe((url: any) => url);
	this.commanService.setData('previousRoute', router.url);
  }
  // var for get data of api
  previousUrl;
  previousUrlArray;
  historyList: any=[];
  params;
  Sadmin;
  testData;
  itemPerPageLimit = 10;
  stuData;
  resultCount:any;
  resut:any;
  private historyTotalItems: number;
  private maxSize: number = 5;
  private historyCurrentPage: number = 1;
  private msg = 'Something Went wrong';
	ngOnInit() {
    //call api and get data
	this.Sadmin = this.commanService.getData('Sadmin');
  this.testData=this.commanService.getData('Test');
  if(this.testData !=null)
   this.getHistoryList({page: 1})
 else
   this.router.navigate(['/admin/testList']);
  }
  getHistoryList(event: any): void {
       
    this.params = {
      token : this.Sadmin[0].usr_token,
      testid : this.testData.test_id,
      start : (event.page - 1) * 10,
      end : 10
    }
    this.testSeriesService.getResultsOfTest(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.historyList = result.data[0];
        this.historyTotalItems = result.data[1][0].totalCount;
        setTimeout(()=>{
          this.historyCurrentPage = event.page
        },100)
      }else{
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);            
    });
  }
  viewReport(details){
    this.stuData = details
    this.params = {
      token : this.Sadmin[0].usr_token,
      resid : details.res_id
    }
    this.commanService.showResult(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.resultCount=1;
        this.resut = result.data[0];
      }else{
        this.resultCount=0;
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
    }
  
}

