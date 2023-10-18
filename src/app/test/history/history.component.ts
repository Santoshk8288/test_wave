import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import { TestHistoryService } from '../../core/services/test-history.service';
import {CommanService} from '../../core/services/comman.service';
import {AuthService} from '../../core/services/auth.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
	constructor(private testSeriesList : TestHistoryService,private commanService : CommanService,private router: Router,private authService : AuthService) {
    this.previousUrlArray=this.commanService.getLastUrl();
    if(this.previousUrlArray){
      this.commanService.setData('prevUrl',this.previousUrlArray[0].url);
    }
    this.previousUrl=this.commanService.getData('prevUrl');
  }
  // var for get data of api
  previousUrl;
  previousUrlArray;
  historyList;
  params;
  loginUser;
  testData;
  gestUser;
  itemPerPageLimit = 10;
  private historyTotalItems: number;
  private maxSize: number = 5;
  private historyCurrentPage: number = 1;
  private msg = 'Something Went wrong';
	ngOnInit() {
    //call api and get data
    this.loginUser = this.commanService.getData('loginUser');
    let HR=this.commanService.getData('HR');
    let Sadmin =this.commanService.getData('Sadmin');
    this.gestUser = JSON.parse(localStorage.getItem('gestUser'));
    if(this.loginUser== null && Sadmin != null)
      this.loginUser= Sadmin;
    this.getHistoryList({
        page: HR == null ? 1 : HR.PN
    });
    
  }
  getHistoryList(event: any): void {
    this.commanService.setData('HR',{'PN' : event.page});
     let StuH=this.commanService.getData('StuH'); 
       if(!this.gestUser){
           this.params = {
            token : this.loginUser[0].usr_token,
            stuid : this.loginUser[0].stu_id ? this.loginUser[0].stu_id :  StuH.stu_id ,
            testid : '',
            start : (event.page - 1) * 10,
            end : 10,
            testtype : '',//this.loginUser[0].scmm_type,
            usrtype : this.loginUser[0].usr_type == 1 ? StuH.usr_type : this.loginUser[0].usr_type
          }
       }else{
         this.params = {
            token : this.gestUser[0].usr_token,
            stuid : this.gestUser[0].stu_id,
            testid : '',
            start : (event.page - 1) * 10,
            end : 10,
            usrtype : this.gestUser[0].usr_type,
            testtype : ''
          }
       }
    
    this.commanService.getHistoryTestList(this.params).subscribe((result: any)=> { 
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
    this.commanService.setData('res_id',details.res_id);
    this.router.navigate(['historyResult']);
  }
}
