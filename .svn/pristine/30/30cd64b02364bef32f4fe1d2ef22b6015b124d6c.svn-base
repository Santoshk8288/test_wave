import { Component, OnInit, TemplateRef ,ChangeDetectorRef,NgZone} from '@angular/core';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import * as moment from 'moment';
import { IMultiSelectOption, IMultiSelectTexts  } from 'angular-2-dropdown-multiselect';
import { TestSeriesService } from '../admin-services/test-series.service';
import { CourseService } from '../admin-services/course.service';
import { Router ,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import swal from 'sweetalert2';

import {AuthService} from '../../core/services/auth.service';
export function getTimepickerConfig(): TimepickerConfig {
	return Object.assign(new TimepickerConfig(), {
		secondsStep: 1,
		minuteStep: 1,
		showMeridian: false,
		readonlyInput: false,
		mousewheel: true
	});
}
@Component({
    selector: 'app-new-test-details',
    templateUrl: './new-test-details.component.html',
    styleUrls: ['./new-test-details.component.scss'],
    providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class NewTestDetailsComponent implements OnInit {

	constructor(private testlist: TestSeriesService,
		private course: CourseService, private router: Router,
		private route: ActivatedRoute, private location: Location,
		private commanService: CommanService, private cdRef: ChangeDetectorRef,
		private zone: NgZone, private authService: AuthService) {
		router.events.subscribe((url: any) => url);
		this.commanService.setData('previousRoute', router.url);

	}
	public todaysDate = new Date();
	public myTime: Date = new Date();
	public showSec: boolean = true;
	ismeridian: boolean = true;
	isValidTime: boolean;
	/**Initialize DatePicker Options */
	private myDatePickerOptions: IMyDpOptions = {
		dateFormat: 'dd/mm/yyyy',
		editableDateField: false,
		openSelectorOnInputClick: true,
		markCurrentDay: true,

	};
	public msg = "Something went wrong"
		//public currentDate = new Date();
		date = {
		startDate: moment().format('MM-DD-YYYY'),
		endDate: moment().format('MM-DD-YYYY'),
		appearDate: moment().format('MM-DD-YYYY'),
		startDateChng: false,
		endDateChng: false,
		appearDateChng: false
	}

	detailsTestForm = {
		token: '',
		insid: '',
		name: '',
		totalques: '',
		instructions: '',
		duration: '',
		maxmarks: '',
		minmarks: '',
		//totalMarks: '',
		type: '',
		startDate: '',
		endDate: '',
		appearDate: '',
		startTime: new Date(),
		endTime: new Date(),
		appearTime: new Date(),
		negMarks: true,
		course: '',
		subject: [{
				subid: '',
				totalMarks: '',
				negMarks: ''
			}
		]

	}
	public modelS: any = {
		date: {
			year: this.todaysDate.getFullYear(),
			month: this.todaysDate.getUTCMonth() + 1,
			day: this.todaysDate.getUTCDate()
		}
	};
	public modelE: any = {
		date: {
			year: this.todaysDate.getFullYear(),
			month: this.todaysDate.getUTCMonth() + 1,
			day: this.todaysDate.getUTCDate()
		}
	};
	public modelA: any = {
		date: {
			year: this.todaysDate.getFullYear(),
			month: this.todaysDate.getUTCMonth() + 1,
			day: this.todaysDate.getUTCDate()
		}
	};
	insCourse = []
	show: boolean = true;
	sAdmin;
	//Multiple option selection
	optionsModel: number[];
	//myOptions: IMultiSelectOption[];
	myOptions = [];
	isValid: boolean = false;
	myTexts: IMultiSelectTexts = {
		checkAll: 'Select all',
		uncheckAll: 'Unselect all',
		checked: 'item selected',
		defaultTitle: 'Select Subject',
		allSelected: 'All selected',
	};
	sDate;
	showEdit: boolean = false;
	testId;
	selectSub: any = [];
	creatTestId
	showDynamicSub: boolean = false;
	resId;
	editSubject:any=[];
	onStartDateChanged(event: IMyDateModel) {
		this.date.startDate = moment(event.jsdate).format("MM-DD-YYYY");
		this.date.startDateChng = true;

	}
	onEndDateChanged(event: IMyDateModel) {
		this.date.endDate = moment(event.jsdate).format("MM-DD-YYYY");
		this.date.endDateChng = true;

	}
	onAppearDateChanged(event: IMyDateModel) {
		this.date.appearDate = moment(event.jsdate).format("MM-DD-YYYY");
		this.date.appearDateChng = true;

	}

	ngOnInit() {
		this.insCourse;
		this.sAdmin = this.commanService.getData('Sadmin');
		let tokenIns = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id
		}
		this.route.params.subscribe(params => {
			this.testId = +params['tid'];
		});
		this.getInsCourse(tokenIns);

		// if (!this.testId) {
		// 	this.testId = this.authService.getData();
		// }
		if (this.testId) {
			this.getUpdateTestData({
				token: this.sAdmin[0].usr_token,
				testid: this.testId
			});
			this.showEdit = true;
			this.showDynamicSub = true;
		}
	}
	clearTestId() {
		this.authService.setData('');
	}
	getSubjectList(tokenIns) {
		this.course.getSubjectList(tokenIns)
		.subscribe((result: any) => {
			if (result.status) {
				this.myOptions = result.data;
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});

	}
	allCourseList: any = [];
	getInsCourse(tokenIns) {
		this.course.getInstituteCourse(tokenIns)
		.subscribe((result: any) => {
			if (result.status) {
				this.insCourse = result.data;
				for (let i = 0; i < this.insCourse.length; i++) {
					this.allCourseList.push({
						cat_id: this.insCourse[i].category[0].cat_id,
						cm_name: this.insCourse[i].cm_name,
						crs_id: this.insCourse[i].crs_id
					});
				}
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});

	}
	onChange(event) {
		// this.getSubject(event);
	}
	changeCourse;
	onCourseChange(val) {
		this.showDynamicSub = false;
		let tokenIns = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			catid: 0
		}
		if (val) {
			if (val == '0')
				this.getSubjectList(tokenIns);
			else {
				tokenIns = {
					token: this.sAdmin[0].usr_token,
					insid: this.sAdmin[0].ins_id,
					catid: val
				}
				this.getCategorySubject(tokenIns);

			}
		} else {
			if (val == '0')
				this.getSubjectList(tokenIns);
			else {
				tokenIns = {
					token: this.sAdmin[0].usr_token,
					insid: this.sAdmin[0].ins_id,
					catid: val
				}
				this.showDynamicSub = false;

				this.getCategorySubject(tokenIns);
			}
		}
	}
	getCategorySubject(tokenIns) {
		this.course.getCategorySubject(tokenIns)
		.subscribe((result: any) => {
			if (result.status) {
				this.myOptions = result.categoryData;
				this.getSubject();
			} else {
				this.commanService.checkToken(result);
				//this.commanService.showAlert(result.message);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	validateDeatils(details) {
		let dateOne;
		let dateTwo;
		let dates;
		if(this.testId ){
		 dates = {
			start: new Date(details.startDate + " " + moment(details.startTime).format("hh:mm:ss a")),
			end: new Date(details.endDate + " " + moment(details.endTime).format("hh:mm:ss a")),
		}
		 dateOne = new Date(dates.start.getFullYear(), dates.start.getMonth(), dates.start.getDate(), dates.start.getHours(), dates.start.getMinutes(), dates.start.getSeconds());
		 dateTwo = new Date(dates.end.getFullYear(), dates.end.getMonth(), dates.end.getDate(), dates.end.getHours(), dates.end.getMinutes(), dates.end.getSeconds());
	
	}else{
		 dates = {
			start: new Date(this.date.startDate + " " + moment(details.startTime).format("hh:mm:ss a")),
			end: new Date(this.date.endDate + " " + moment(details.endTime).format("hh:mm:ss a")),
		}
		 dateOne = new Date(dates.start.getFullYear(), dates.start.getMonth(), dates.start.getDate(), dates.start.getHours(), dates.start.getMinutes(), dates.start.getSeconds());
		 dateTwo = new Date(dates.end.getFullYear(), dates.end.getMonth(), dates.end.getDate(), dates.end.getHours(), dates.end.getMinutes(), dates.end.getSeconds());

	}
		
		if (details.name == "" || details.name == undefined) {
			this.commanService.showAlert("Please enter test name.");
			return false;
		} else if (details.duration == "" || details.duration == undefined) {
			this.commanService.showAlert("Please enter test duration.");
			return false;
		} else if (details.totalques == "" || details.totalques == undefined) {
			this.commanService.showAlert("Please enter test total question.");
			return false;
		} else if (details.type == "" || details.type == undefined) {
			this.commanService.showAlert("Please enter test type.");
			return false;
		} else if (details.minmarks == "" || details.minmarks == undefined) {
			this.commanService.showAlert("Please enter test minimum marks.");
			return false;
		} else if (details.maxmarks == "" || details.maxmarks == undefined) {
			this.commanService.showAlert("Please enter test total marks.");
			return false;
		} else if (details.minmarks >= details.maxmarks) {
			this.commanService.showAlert("Minimum marks must be less than total marks.");
			return false;
		} else if (details.course == "" || details.course == undefined) {
			this.commanService.showAlert("Please select course.");
			return false;
		} else if (this.date.appearDate == '' || this.date.appearDate == undefined) {
			this.commanService.showAlert("Please enter appear date.");
			return false;
		} else if (this.date.startDate == '' || this.date.startDate == undefined) {
			this.commanService.showAlert("Please enter start date.");
			return false;
		} else if (this.date.endDate == '' || this.date.endDate == undefined) {
			this.commanService.showAlert("Please enter end date.");
			return false;
		} else if (this.date.startDate != '' && (this.date.endDate == '' || this.date.endDate == undefined)) {
			this.commanService.showAlert("Please enter end date.");
			return false;
		} else if (this.date.endDate != '' && (this.date.startDate == '' || this.date.startDate == undefined)) {
			this.commanService.showAlert("Please enter start date.");
			return false;
		} else if (new Date(dates.start.getFullYear(), dates.start.getMonth(), dates.start.getDate()) > new Date(dates.end.getFullYear(), dates.end.getMonth(), dates.end.getDate())) {
			this.commanService.showAlert("Start date must be less than end date.");
			return false;
		} else if ((details.startTime != undefined) && (details.endTime == '' || details.endTime == undefined)) {
			this.commanService.showAlert("Please enter end time.");
			return false;
		} else if ((details.startTime == "" || details.startTime == undefined) && details.endTime != undefined) {
			this.commanService.showAlert("Please enter start time.");
			return false;
		} else if ((details.endTime == "" || details.endTime == undefined) && details.startTime != undefined) {
			this.commanService.showAlert("Please enter end time.");
			return false;
		} else if ((details.endTime != undefined) && (details.startTime == '' || details.startTime == undefined)) {
			this.commanService.showAlert("Please enter start time.");
			return false;
		} else if (this.date.appearDate != '' && (details.appearTime == '' || details.appearTime == undefined)) {
			this.commanService.showAlert("Please enter appear time.");
			return false;
		}
		//  else if (moment(details.startTime).format("hh:mm:ss") > moment(details.endTime).format("hh:mm:ss")) {
		//     this.commanService.showAlert("Start time must be less than end time.");
		//     return false;
		// }
		else if ((dateOne) >= (dateTwo)) {
			this.commanService.showAlert("Start time must be less than end time.");
			return false;
		} else if (this.selectSub) {
			let sub = this.selectSub;
			let markscount: number = 0;
			let quescount: number = 0;
			for (var i = 0; i < sub.length; ++i) {
				// code...
				if ((sub[i].totalMarks == '' || sub[i].totalMarks == undefined) || (sub[i].totalQues == '' || sub[i].totalQues == undefined)) {
					sub[i].totalMarks = 0;
					sub[i].totalQues = 0;
				}
				markscount += sub[i].totalMarks;
				quescount += sub[i].totalQues;
				// if (this.selectSub[i].totalMarks == '' || this.selectSub[i].totalMarks == undefined) {
				//     this.commanService.showAlert("Please enter total marks of subject.");
				//     return false;
				// } else if (this.selectSub[i].totalQues == '' || this.selectSub[i].totalQues == undefined) {

				//     this.commanService.showAlert("Please enter total question of subject.");
				//     return false;
				// }
				if (this.show == true) {
					if (sub[i].negMarks == '' || sub[i].negMarks == undefined) {
						sub[i].negMarks = 0;
						// this.commanService.showAlert("Please enter negative marks of subject.");
						// return false;
					}
					//this.checkNegativeMarks(sub[i]);
					let ratioNeg = sub[i].totalMarks / sub[i].totalQues
						if (ratioNeg < sub[i].negMarks) {
							this.commanService.showAlert(sub[i].sub_name + " Negative marks ratio is greater ");
							this.isValid = false;
							return false;
						}
				}

			}
			if (details.totalques != quescount) {
				this.commanService.showAlert("Total question must be equal to total subject question.");
				return false
			} else if (details.maxmarks != markscount) {
				this.commanService.showAlert("Total marks must be equal to total subject marks.");
				return false;
			}
			this.isValid = true;
		} else
			this.isValid = true;

	}
	// checkNegativeMarks(sub) {
	//     let ratioNeg = sub.totalMarks / sub.totalQues
	//     if (ratioNeg < sub.negMarks) {
	//         this.commanService.showAlert(sub.sub_name + " Negative marks ratio is greater ");
	//         this.isValid = false;
	//         return false;
	//     }

	// }
	submarksArr = [];
	getSubjectArray() {
		for (var i = 0; i < this.selectSub.length; ++i) {
			// code...
			let submarksObj = {};

			if (this.selectSub[i].negMarks) {
				submarksObj = {
					totalMarks: this.selectSub[i].totalMarks,
					totalQues: this.selectSub[i].totalQues,
					negMarks: this.selectSub[i].negMarks,
					smid: this.selectSub[i].smid
				}
			} else {
				submarksObj = {
					totalMarks: this.selectSub[i].totalMarks,
					totalQues: this.selectSub[i].totalQues,
					negMarks: '0',
					smid: this.selectSub[i].smid
				}
			}
			this.submarksArr.push(submarksObj);
		}
	}
	getDetails(details) {
		let dates = {
			start: (this.date.startDate + " " + moment(details.startTime).format("hh:mm:ss a")),
			end: (this.date.endDate + " " + moment(details.endTime).format("hh:mm:ss a")),
			appear: (this.date.appearDate + " " + moment(details.appearTime).format("hh:mm:ss a"))
		}
		details.startTime = dates.start;
		details.endTime = dates.end;
		details.appearTime = dates.appear;
		this.validateDeatils(details);
		if (this.isValid == false)
			return false;
		for (let i = 0; i < this.allCourseList.length; i++) {
			if (this.allCourseList[i].cat_id == details.course) {
				this.selectedCourseId = this.allCourseList[i].crs_id;
			}
		}
		this.getSubjectArray()
		let detail = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			name: details.name,
			crsid: this.selectedCourseId,
			totalques: details.totalques,
			instructions: details.instructions,
			duration: details.duration,
			maxmarks: details.maxmarks,
			minmarks: details.minmarks,
			type: details.type,
			opendate: moment(new Date(dates.start), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			closedate: moment(new Date(dates.end), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			appeardate: moment(new Date(dates.appear), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			subject: this.submarksArr,

		}
		this.testlist.addTestDetail(detail)
		.subscribe((result: any) => {
			if (result.status) {
				this.detailsTestForm = {
					token: '',
					insid: '',
					name: '',
					totalques: '',
					instructions: '',
					duration: '',
					maxmarks: '',
					minmarks: '',
					//totalMarks: '',
					type: '',
					startDate: '',
					endDate: '',
					appearDate: '',
					startTime: new Date(),
					endTime: new Date(),
					appearTime: new Date(),
					negMarks: false,
					course: '',
					subject: [{
							subid: '',
							totalMarks: '',
							negMarks: ''
						}
					]
				};
				this.commanService.showAlert('Test Created successfully')
				this.router.navigate(['/admin/addPpr', result.testid]);
				//this.router.navigate(['/admin/testList'])
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}

	enableNegativeMarking(value) {
		if (value == true)
			this.show = true;
		else
			this.show = false;
	}

	getSubject() {
		let subjs = [];
		for (var i = 0; i < this.myOptions.length; i++) {
			if (subjs.indexOf(this.myOptions[i]) == -1) {
				this.myOptions[i].negMarks = 0;
				subjs.push(this.myOptions[i]);
				this.selectSub = subjs;
				JSON.stringify(this.selectSub)
			}
		}
	}

	selectedCourse: any = [];
	getUpdateTestData(token) {

		this.testlist.getTest(token)
		.subscribe((result: any) => {
			if (result.status) {
				this.resId =result.data[0].res_id;
				this.modelS = {
					date: {
						year: moment(new Date(result.data[0].test_opendate * 1000)).format('YYYY'),
						month: moment(new Date(result.data[0].test_opendate * 1000)).format('M'),
						day: moment(new Date(result.data[0].test_opendate * 1000)).format('D')
					}
				};
				this.modelE = {
					date: {
						year: moment(new Date(result.data[0].test_closedate * 1000)).format('YYYY'),
						month: moment(new Date(result.data[0].test_closedate * 1000)).format('M'),
						day: moment(new Date(result.data[0].test_closedate * 1000)).format('D')
					}
				};
				this.modelA = {
					date: {
						year: moment(new Date(result.data[0].test_appeardate * 1000)).format('YYYY'),
						month: moment(new Date(result.data[0].test_appeardate * 1000)).format('M'),
						day: moment(new Date(result.data[0].test_appeardate * 1000)).format('D')
					}
				};

				var a = this;

				this.insCourse = result.data[0].course;
				let dynamicSubject = [];
				if (result.data[0].subjects[0].tsmm_negative_marks != 0) {
					this.detailsTestForm.negMarks = true;
					this.show = true;
					let resSubject = result.data[0].subjects;
					for (let data in resSubject) {
						dynamicSubject.push({
							totalQues: resSubject[data].tsmm_total_questions,
							totalMarks: resSubject[data].tsmm_total_marks,
							negMarks: resSubject[data].tsmm_negative_marks,
							sub_name: resSubject[data].sub_name,
							smid: resSubject[data].tsmm_smid
						});

					}
					this.editSubject =result.data[0].subjects;;
					this.selectSub = dynamicSubject;
				} else {
					this.show = false;
					let resSubject = result.data[0].subjects;
					for (let data in resSubject) {
						dynamicSubject.push({
							totalQues: resSubject[data].tsmm_total_questions,
							totalMarks: resSubject[data].tsmm_total_marks,
							negMarks: resSubject[data].tsmm_negative_marks,
							sub_name: resSubject[data].sub_name,
							smid: resSubject[data].tsmm_smid
						});

					}
					this.editSubject =result.data[0].subjects;;
					this.selectSub = dynamicSubject;

					this.detailsTestForm.negMarks = false;
				}
				this.detailsTestForm = {
					token: '',
					insid: '',
					name: result.data[0].test_name,
					totalques: result.data[0].test_total_questions,
					instructions: result.data[0].test_instructions,
					duration: result.data[0].test_duration,
					maxmarks: result.data[0].test_max_marks,
					minmarks: result.data[0].test_min_marks,
					//totalMarks: result.data[0].test_max_marks,
					type: result.data[0].test_type,
					startDate: '',
					endDate: '',
					appearDate: '',
					startTime: new Date(result.data[0].test_opendate * 1000),
					endTime: new Date(result.data[0].test_closedate * 1000),
					appearTime: new Date(result.data[0].test_appeardate * 1000),
					negMarks: this.detailsTestForm.negMarks,
					course: result.data[0].course[0].cat_id,
					subject: this.selectSub
				};
				this.selectedCourse = result.data[0].course;
				this.insCourse = result.data[0].course;
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	selectedCourseId;
	afterConfiremUpadateUser(testDetails) {
		for (let i = 0; i < this.allCourseList.length; i++) {
			if (this.allCourseList[i].cat_id == testDetails.course) {
				this.selectedCourseId = this.allCourseList[i].crs_id;
			}
		}
		let dates = {
			start: (testDetails.startDate + " " + moment(testDetails.startTime).format("hh:mm:ss a")),
			end: (testDetails.endDate + " " + moment(testDetails.endTime).format("hh:mm:ss a")),
			appear: (testDetails.appearDate + " " + moment(testDetails.appearTime).format("hh:mm:ss a"))
		}
		testDetails.startTime = dates.start;
		testDetails.endTime = dates.end;
		testDetails.appearTime = dates.appear;
		if (testDetails.type == 0)
			testDetails.type = '0'
				this.validateDeatils(testDetails);
		if (this.isValid == false)
			return false;

		let course;
		if(this.selectedCourse[0].cat_id != testDetails.course)
			this.changeCourse = '1';
		else{
			for (let i = 0; i < this.selectSub.length; i++) {
					if((this.selectSub[i].totalQues !=this.editSubject[i].tsmm_total_questions)|| (this.selectSub[i].totalMarks !=this.editSubject[i].tsmm_total_marks) || (this.selectSub[i].negMarks !=this.editSubject[i].tsmm_negative_marks))
						this.changeCourse = '1';
						
			}
		}
		if (this.selectedCourseId) {
			course = this.selectedCourseId
				this.getSubjectArray();
			this.selectSub = this.submarksArr;
		} else {
			course = this.selectedCourseId;
		}
		let details = {
			token: this.sAdmin[0].usr_token,
			crsid: course,
			testid: this.testId,
			name: testDetails.name,
			totalques: testDetails.totalques,
			instructions: testDetails.instructions,
			duration: testDetails.duration,
			maxmarks: testDetails.maxmarks,
			type: testDetails.type,
			opendate: moment(new Date(dates.start), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			closedate: moment(new Date(dates.end), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			appeardate: moment(new Date(dates.appear), 'DD-MM-YYYY HH:mm:ss').utc().format('X'),
			subject: this.selectSub,
			deleteAll: this.changeCourse
		}
		this.testlist.updateTest(details)
		.subscribe((result: any) => {
			if (result.status) {
				this.commanService.showAlert('Test updated successfully.')
				this.router.navigate(['/admin/testList'])
				this.clearTestId();
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	updateTest(testDetails) {
		testDetails.startDate = this.date.startDateChng == false ? (moment(testDetails.startTime).format("MM-DD-YYYY")) : this.date.startDate;
		testDetails.endDate = this.date.endDateChng == false ? (moment(testDetails.endTime).format("MM-DD-YYYY")) : this.date.endDate;
		testDetails.appearDate = this.date.appearDateChng == false ? (moment(testDetails.appearTime).format("MM-DD-YYYY")) : this.date.appearDate;
		if (this.selectedCourse[0].cat_id != testDetails.course) {
			let msg = 'If you change course then already set question paper will remove. Are you agree to remove it?';
			swal({
				title: 'Are you sure?',
				text: msg,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes'
			}).then((result) => {
				if (result.value) {
					let status = result.value == undefined ? false : true;
					this.changeCourse = status == true ? '1' : '0';
					this.afterConfiremUpadateUser(testDetails);
				}
				if (!status) {
					let status = result.value == undefined ? false : true;
					this.changeCourse = status == true ? '1' : '0';
					this.afterConfiremUpadateUser(testDetails);
				}
			})
		} else {
			this.changeCourse = this.changeCourse == undefined ? '0' : this.changeCourse == '0' ? '0' : '1';
			//this.changeCourse = 1;
			this.afterConfiremUpadateUser(testDetails);
		}
	}
	gotoAddQues() {
		this.router.navigate(['/admin/addPpr', this.testId]);
	}
	goToFeedbackQues(){
		this.router.navigate(['/admin/feedbackQues', this.testId]);
	}
}