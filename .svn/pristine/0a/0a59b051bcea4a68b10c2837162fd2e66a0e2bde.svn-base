import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import { TestHistoryService } from '../core/services/test-history.service';
import {CommanService} from '../core/services/comman.service';
import {AuthService} from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
previousUrlArray;
  previousUrl;
  private msg = 'Something Went wrong';
	constructor(private router: Router,private commanService : CommanService,private authService : AuthService) {
    router.events.subscribe((url: any) => url);
    this.commanService.setData('previousRoute',router.url);
    this.previousUrlArray=this.commanService.getLastUrl();
    if(this.previousUrlArray){
      this.commanService.setData('prevUrl',this.previousUrlArray[0].url);
    }
    this.previousUrl=this.commanService.getData('prevUrl');
  }
  tempLabels: any = [];
	report:object;
  params;
  loginUser;
  testList;
  historyList;
  count;
  testAttempt;
  totalTest;
  passTest;
  averageScore;
  seriesName;
  itemPerPageLimit = 5;
  private historyTotalItems: number = 10;
  private maxSize: number = 5;
  private historyCurrentPage: number = 1;
  series={
    ser:''
  }
	ngOnInit() {
    this.loginUser = this.commanService.getData('loginUser');
    localStorage.removeItem('HR');
    this.getHistoryList({
        page: 1
    });

    //get letest Avalable test List
    this.params = {
      token:this.loginUser[0].usr_token,
      stuid : this.loginUser[0].stu_id,
      start : 0,
      end : 15,
      testtype: "",
      type: this.loginUser[0].scmm_type.toString()
    }
    this.commanService.getTestList(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.testList = result.data[0];
      }else{
        //this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
    //get Dashboard count
    this.params = {
      token : this.loginUser[0].usr_token,
      stuid : this.loginUser[0].stu_id,
      type : this.loginUser[0].scmm_type.toString()
    }
    this.commanService.getDashboardCount(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.count = result.data;
        this.testAttempt = this.count[0].testAttempt;
        this.totalTest = this.count[3].totalTest;
        this.passTest = this.count[2].passTest;
        this.averageScore = this.count[1].averageScore;
      }else{
        this.commanService.checkToken(result);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
    this.getStudentTestData();
    //this.getStudentSeries(this.params);
    this.getStudentMonthlyTestData();
	}
  //get 10 test History List
  getHistoryList(event: any): void{
    
      this.params = {
        token : this.loginUser[0].usr_token,
        stuid : this.loginUser[0].stu_id,
        testid : '',
        start : (event.page - 1) * 5,
        end : 15,
        usrtype: this.loginUser[0].usr_type,
        testtype:'1'
      }
      this.commanService.getHistoryTestList(this.params).subscribe((result: any)=> { 
        if(result.status){
          this.historyList = result.data[0];
          this.historyTotalItems = result.data[1][0].totalCount;
 
          this.historyTotalItems =result.data[1][0].totalCount <5 ? 5 : result.data[1][0].totalCount <10 ? 10 : 15 ;
        }else{
          this.commanService.checkToken(result);
        }
      },error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
      });
  }
  // view report
  viewReport(details){
    this.authService.setData(details.res_id);
    this.commanService.setData('res_id',details.res_id);
    this.router.navigate(['historyResult']);
  }
  goMytest(){
    this.router.navigate(['/test/testSeries']);
  }
  /*getStudentSeries(param){
    this.commanService.getStudentTestSeriesList(param).subscribe((result: any)=> { 
    if(result.status){
     this.seriesName = result.data;
     // for(let data in resLabels)
     //   for(var i = 0 ; i < resLabels.length; i ++){
     //   dates[i]=(((moment(resLabels[i] * 1000)).format('DD-MM-YYYY')).toString());
     // }
         
      //      this.tempLabels=dates; 
      //     this.lineChartLabels.length = 0;
      //   for(let i=0;i<this.tempLabels.length;i++){
      //   this.lineChartLabels.push(this.tempLabels[i]);
      // }
      /*if(this.seriesName!= undefined && this.seriesName.length !=0){
        this.series.ser=this.seriesName[0].ser_id;
        this.selectedSeries(this.seriesName[0].ser_id)
      } */
    //  this.getStudentTestData();

  //     else{
  //       this.lineChartData=[
  //     {data: ["","","","","","","","",""], label: 'Test Record'}
  // ];;
  //       this.barChartData=[
  //   {data: ["","","","","","","","",""], label: 'Monthly Test Record'}
  // ];
  //       this.lineChartLabels=["","","","","","","","",""];;
  //       this.barChartLabels=["","","","","","","","",""];
  //     }
   /* }
    else{
      this.commanService.checkToken(result);
    }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  } */
  getStudentTestData(){
    let param={
      token:this.loginUser[0].usr_token,
      stuid:this.loginUser[0].stu_id
    }
    this.commanService.getStudentTestData(param).subscribe((result: any)=> { 
    if(result.status){
      if(result.data.length !=0){
          let tempLabels:any=[];
             tempLabels=result.data[0].testName;
             let resLabels = result.data[1].score;
             this.lineChartLabels.length = 0;
             this.lineChartData.length=0;
          for(let i=0;i<tempLabels.length;i++){
            if(i <= 6){
              this.lineChartLabels.push(tempLabels[i]);
            }
          }
          this.lineChartData=resLabels;
        }
    }else{
      this.commanService.checkToken(result);
    }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }

  getStudentMonthlyTestData(){
    let param={
      token:this.loginUser[0].usr_token,
      stuid:this.loginUser[0].stu_id
    }
    this.commanService.getStudentMonthlyTestData(param).subscribe((result: any)=> { 
    if(result.status){
      this.barChartData = result.data[1].avgScore;
      //this.barChartData =["0","0","0","0","0","0","0","0","0","0","-20","-10"];
      this.tempLabels = result.data[0].month;
      this.barChartLabels.length = 0;
      for (let i = 0; i < this.tempLabels.length; i++) {
          this.barChartLabels.push(this.tempLabels[i]);
      } 
    }else{
      this.commanService.checkToken(result);
    }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }
  //bar Chart
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left'}]
      }
  };
  public barChartLabels:string[] = []  
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
	  {data: [], label: 'Monthly Test Record'}
  ]  
  
  public barChartColors:Array<any> = [
  	{	
  		backgroundColor: 'rgba(255, 255, 255, 0.8)',	 		
  		Color: 'rgba(255, 255, 255, 1)',
          borderWidth: 12,
  		borderColor: ' rgba(0, 0, 0, 0)',
  		fillColor:"rgba(224, 108, 112, 1)",
  	    strokeColor: "rgba(207,100,103, 1)",
  	    pointColor: "rgba(220,220,220, 1)",
  	    pointStrokeColor: "#fff",
  	    pointHighlightFill: "#fff",
  	    pointHighlightStroke: 'rgba(255, 255, 255, 1)',
          hoverBackgroundColor: "rgba(255, 255, 255, 0.95)",
          hoverBorderColor: 'rgba(0, 0, 0, 0)',
  		
  	}
  ]
  // events
  public chartClicked(e:any):void {
  }
 
  public chartHovered(e:any):void {
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;

    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }
  //line Chart
  public lineChartData:Array<any> = [
      {data: [], label: 'Test Record'}
  ];

  public lineChartLabels:Array<any> = [];
  public lineChartOptions:any = {
      responsive: true,
      scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left'}] //, ticks: {min: 0, max:100}
      }
    };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(72, 164, 76,0)',	 
      borderColor: 'rgba(255, 255, 255, 1)',
	  Color: 'rgba(255, 255, 255, 1)',
	  borderWidth: 3, 
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(255, 255, 255, 1)',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(76, 175, 80, 0.5)',
	  pointBorderWidth: 5,
		pointHoverRadius: 5,
		pointHoverBorderWidth: 1,
		 borderCapStyle: 'butt'
    },
    { // dark grey
      backgroundColor: 'rgba(72, 164, 76,0)',
      borderColor: 'rgba(255, 255, 255, 1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(72, 164, 76,0)',
      borderColor: 'rgba(255, 255, 255, 1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

}
