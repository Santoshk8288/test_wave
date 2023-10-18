import { Component, OnInit, TemplateRef,NgZone } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-add-course',
    templateUrl: './add-course.component.html',
    styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
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
    courseId: any;
    subjects = [];
    instCategory = {};
    sAdmin;
    courseName;
    shiftSubject = [];
    subjectObj = {};
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.sAdmin[0].usr_token;

        this.route.params.subscribe(params => {
            this.courseId = +params['crs'];
        });
        this.courseId = this.commanService.getData('cat');
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            catid: this.courseId
        }

        this.getCategorySubject(token);
        setTimeout(()=>{
			this.getSubjectList(token);  
		},100);
        
        if (this.shiftSubject)
            this.shiftSubject;
    }

    getCategorySubject(token) {
        this.course.getCategorySubject(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.shiftSubject = result.categoryData;
                    this.courseName = result.courseData[0].cm_name;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }

    getSubjectList(token) {
        this.course.getSubjectList(token)
            .subscribe((result: any) => {
                if (result.status) {
                    let sub = result.data;
                    let subj = result.data;
                    let subjs = subj.map(a => a.subid);
                    let ssub = this.shiftSubject.map(a => a.sub_id || a.subid);
                    let c = subjs.filter(function(item) {
                        return ssub.indexOf(item) === -1;
                    });
                    let j = 0;
                    for (var i = 0; i < sub.length; ++i) {

                        if (c[j] == sub[i].subid) {
                            this.subjects.push(sub[i])
                            j++
                        }
                    }
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    //add subject in course
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
                    this.commanService.showAlert('Subject added successfully.');
                    this.subjects = result.data;
                    this.reload();
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }

    //shift subject left to rigth
    shiftLeftToRight(index) {
        for (var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[index] == this.subjects[i]) {
                this.shiftSubject.push({
                    sub_name: this.subjects[i].sub_name,
                    subid: this.subjects[i].subid
                });
                this.subjects.splice(index, 1);
            }
        }
    }
    //shift subject right to left
    shiftRightToLeft(index) {
        for (var i = 0; i < this.shiftSubject.length; i++) {
            if (this.shiftSubject[index] == this.shiftSubject[i]) {

                this.subjects.push({
                    sub_name: this.shiftSubject[i].sub_name,
                    subid: this.shiftSubject[i].subid
                });

                this.shiftSubject.splice(index, 1);
            }
        }
    }
    //add selected subject in course
    addSelectedSubInCourse() {
        let selectedSub = [];
        for (var i = 0; i < this.shiftSubject.length; ++i) {
            if (this.shiftSubject[i].subid)
                selectedSub.push({
                    subid: this.shiftSubject[i].subid
                });
            else if (this.shiftSubject[i].sub_id)
                selectedSub.push({
                    subid: this.shiftSubject[i].sub_id
                });
        }

        let token = {
            token: this.sAdmin[0].usr_token,
            catid: this.courseId
        }
        this.instCategory = {
            token: this.sAdmin[0].usr_token,
            catid: this.courseId,
            subject: selectedSub
        }
        if (this.shiftSubject.length != 0) {
            this.course.addSubjectInCourse(this.instCategory)
                .subscribe((result: any) => {
                    if (result.status) {
                        this.commanService.showAlert('Subject added successfully.');
                        this.router.navigate(['/admin/courseList']);
                    } else {
                        this.commanService.checkToken(result);
                    }
                }, error => {
                    this.commanService.showAlert(this.msg);
                });
        }
    }
    //remove subject from crouse
    removeSubjectFromCourse(sub, index) {
        if (sub.subid) {
            this.shiftRightToLeft(index);
        } else {
            let instSub = {
                token: this.sAdmin[0].usr_token,
                smid: sub.smid
            }
            // this.shiftRightToLeft(index);
            this.course.deleteSubjectFromCourse(instSub)
                .subscribe((result: any) => {
                    if (result.status) {

                        this.shiftRightToLeft(index);
                        this.subjects = [];
                        this.getSubjectList({
                            token: this.sAdmin[0].usr_token,
                            insid: this.sAdmin[0].ins_id,
                            catid: this.courseId
                        });
                    } else {
                        this.commanService.checkToken(result);
                    }
                }, error => {
                    this.commanService.showAlert(this.msg);
                });
        }
    }

    gotoManageCrs() {
        this.router.navigate(['/admin/manageCourse', this.courseId]);
    }
}