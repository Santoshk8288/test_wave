import { Component, OnInit,TemplateRef, NgZone } from '@angular/core';
import { Router,NavigationEnd,ActivatedRoute }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {CommanService} from '../../core/services/comman.service';
@Component({
	selector: 'app-subject',
	templateUrl: './subject.component.html',
	styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {
	public modalRef: BsModalRef;
	public msg = "Something went wrong"
		public openModal(template: TemplateRef < any > ) {
		this.modalRef = this.modalService.show(template);
	}
	constructor(private modalService: BsModalService,
		private course: CourseService,
		private router: Router, private route: ActivatedRoute,
		private location: Location, private zone: NgZone, private commanService: CommanService) {
		router.events.subscribe((url: any) => url);
		this.commanService.setData('previousRoute', router.url);
	}
	sAdmin;
	subjects;
	courseId;
	courseName;
	insSubjects;
	subjectObj = {};
	subject;
	editSubjectName;
	itemPerPageLimit = 10;
	pageNo=1;
	private subjectTotalItems: number;
	private maxSize: number = 5;
	private subjectCurrentPage: number = 1;
	public reload(): any {
		return this.zone.runOutsideAngular(() => {
			this.ngOnInit();
		});
	}
	ngOnInit() {
		this.commanService.removeLSData('QB','TL','TS','Stu','FB','StuH','Test','HR');
		this.sAdmin = this.commanService.getData('Sadmin');
		this.sAdmin[0].usr_token;

		this.route.params.subscribe(params => {
			this.courseId = +params['crs'];
		});

		let token = {
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			catid: this.courseId
		}
		this.getInstituteSubjectList({
			page: 1
		});
	}
	getInstituteSubjectList(event: any): void {
		this.pageNo=event.page;
		this.course.getSubjectList({
			token: this.sAdmin[0].usr_token,
			insid: this.sAdmin[0].ins_id,
			start: (event.page - 1) * 10,
			end: 10
		})
		.subscribe((result: any) => {
			if (result.status) {
				this.subjects = result.data;
				this.subjectTotalItems = result.totalCount[0].totalCount;
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}

	addSubject(subject) {
		if (subject == '' || subject == undefined) {
			this.commanService.showAlert('Please enter subject.')
			return false;
		}

		this.subjectObj = {
			insid: this.sAdmin[0].ins_id,
			token: this.sAdmin[0].usr_token,
			subname: subject
		}

		this.course.addSubject(this.subjectObj)
		.subscribe((result: any) => {
			if (result.status) {
				this.subjects = result.data;
				this.commanService.showAlert(result.message);
				this.getInstituteSubjectList({
					page: this.pageNo
				});
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	removeSubjectFromCourse(sub, index) {
		let instSub = {
			token: this.sAdmin[0].usr_token,
			subid: sub.subid,
			insid: this.sAdmin[0].ins_id

		}
		swal({
            title: 'Are you sure?',
            text: 'Want to delete subject?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.course.deleteSubject(instSub)
				.subscribe((result: any) => {
					if (result.status) {
						this.commanService.showAlert('Subject deleted successfully')
						this.getInstituteSubjectList({
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

	openEditSubjectModel(index) {
		for (var i = 0; i < this.subjects.length; i++) {
			if (this.subjects[index] == this.subjects[i]) {
				this.editSubjectName = this.subjects[i];
			}
		}
	}
	editSubject(sub) {
		this.course.editSubject({
			token: this.sAdmin[0].usr_token,
			subname: sub.sub_name,
			subid: sub.subid
		})
		.subscribe((result: any) => {
			if (result.status) {;
				this.getInstituteSubjectList({
					page: this.pageNo
				});
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
		});
	}
	editCancel(){
		this.subject=''
		this.getInstituteSubjectList({
			page: this.pageNo
		});
	}
}
