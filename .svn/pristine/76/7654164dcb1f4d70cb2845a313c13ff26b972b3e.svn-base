import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TestSeriesService } from '../admin-services/test-series.service';
import * as moment from 'moment';
import {CommanService} from '../../core/services/comman.service';

@Component({
    selector: 'app-dashbord',
    templateUrl: './dashbord.component.html',
    styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
	constructor(private testSeriesService: TestSeriesService,
		private router: Router, private commanService: CommanService) {
		router.events.subscribe((url: any) => url);
		this.commanService.setData('previousRoute', router.url);

	}
	sAdmin;
	tabName;
	showCount = {
		courseCount: 0,
		testCount: 0,
		studentCount: 0,
		practiceCount:0,
		speedCount:0
	};
	speedTest: any = [];
	public msg = "Something went wrong";
		upcomingTest: any = [];
	lstYrStudentData: any = [];
	report = [];
	tempLabels: any = [];
	public barChartLabels: string[] = [];
	ngOnInit() {
		this.commanService.removeLSData('QB','TL','TS','Stu','FB','StuH','Test','HR');
		this.sAdmin = this.commanService.getData('Sadmin');
		this.sAdmin[0].usr_token;
		let userToken = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id
		}

		this.testSeriesService.getAdminDashboardCounts(userToken)
		.subscribe((result: any) => {
			if (result.status) {
				this.showCount = {
					courseCount: result.data[1].courseCount,
					testCount: result.data[4].testCount,
					studentCount: result.data[0].studentCount,
					practiceCount:result.data[3].PracticeTestCount,
					speedCount:result.data[2].speedTestCount
				};
				if(this.showCount.courseCount == 0){
					setTimeout(()=>{
                    location.reload();
                    this.router.navigate(['/admin/courseList']);
                },100)
					
				}
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
		this.testSeriesService.getUpcomingTestData(userToken)
		.subscribe((result: any) => {
			if (result.status) {
				/*dynamic graph*/
				let dates: any = [];
                    this.lineChartData = result.data[1].testCount;
                    let resLabels = result.data[0];
                    // for(let data in resLabels)
                    for (var i = 0; i < resLabels.length; i++) {
                        dates[i] = (((moment(resLabels[i] * 1000)).format('DD-MM-YYYY')).toString());
                    }
                this.tempLabels = dates;
                this.lineChartLabels.length = 0;
                for (let i = 0; i < this.tempLabels.length; i++) {
                    this.lineChartLabels.push(this.tempLabels[i]);
                }
				/*End of code*/
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
		this.testSeriesService.lastYearStudentData(userToken)
		.subscribe((result: any) => {
			if (result.status) {
                    this.barChartData = result.data[1].studentCount;
                    this.tempLabels = result.data[0].month;
				    this.barChartLabels.length = 0;
				    for (let i = 0; i < this.tempLabels.length; i++) {
				        this.barChartLabels.push(this.tempLabels[i]);
				    } 
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});

		this.getOnlineTest({
			page: 1
		});
	}
	getOnlineTest(event: any): void {
		let token = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			start: (event.page - 1) * 10,
			end: 15,
			testtype: "1"
		}
		this.testSeriesService.getTestList(token)
		.subscribe((result: any) => {
			if (result.status) {
				this.speedTest = result.data;
				
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	//bar Chart
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [{
			data: [],
			label: 'Student Record'
		}
	]

	public barChartColors: Array <any>  = [{
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			Color: 'rgba(255, 255, 255, 1)',
			borderWidth: 18,
			borderColor: ' rgba(0, 0, 0, 0)',
			fillColor: "rgba(224, 108, 112, 1)",
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
	public chartClicked(e: any): void {}

	public chartHovered(e: any): void {}

	public randomize(): void {
		// Only Change 3 values
		let data = [
			Math.round(Math.random() * 100),
			59,
			80,
			(Math.random() * 100),
			56,
			(Math.random() * 100),
			40
		];
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

	// lineChart
	public lineChartData: Array <any>  = [{
			data: [],
			label: 'Upcoming Test Record'
		}
	];
	public lineChartLabels: Array <any>  = [];
	public lineChartOptions: any = {
		responsive: true,
		scales: {
			yAxes: [{
					id: 'y-axis-1',
					type: 'linear',
					position: 'left',
					/*ticks: {
						min: 0,
						max: 100
					}*/
				}
			]
		}
	};
	public lineChartColors: Array <any>  = [{ // grey
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
		}, { // dark grey
			backgroundColor: 'rgba(72, 164, 76,0)',
			borderColor: 'rgba(255, 255, 255, 1)',
			pointBackgroundColor: 'rgba(77,83,96,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(77,83,96,1)'
		}, { // grey
			backgroundColor: 'rgba(72, 164, 76,0)',
			borderColor: 'rgba(255, 255, 255, 1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		}
	];
	public lineChartLegend: boolean = true;
	public lineChartType: string = 'line';

	goToTest(id) {
		this.router.navigate(['/admin/view', id]);
	}
}