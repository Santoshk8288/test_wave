import { Component, OnInit,TemplateRef } from '@angular/core';
import { Router,NavigationEnd }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import { ActivatedRoute } from '@angular/router';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-manageCourse',
    templateUrl: './manage-course.component.html',
    styleUrls: ['./manage-course.component.scss']
})
export class ManageCourseComponent implements OnInit {
    public modalRef: BsModalRef;
    public openModal(template: TemplateRef < any > ) {
        this.modalRef = this.modalService.show(template);
    }
    constructor(private modalService: BsModalService,
        private course: CourseService, private route: ActivatedRoute,
        private commanService: CommanService) {

    }
    sAdmin;
    subjects;
    courseId;
    courseName;
    insSubjects;
    public msg = "Something went wrong"
    ngOnInit() {
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

        this.course.getSubjectList({
                token: this.sAdmin[0].usr_token
            })
            .subscribe((result: any) => {
                if (result.status) {
                    this.subjects = result.data;

                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });

        this.course.getCategorySubject(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.insSubjects = result.data;
                    this.courseName = this.insSubjects[0].cat_name;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });


    }
    subjectObj = {};
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
                    location.reload();
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
            smid: sub.smid,

        }
        var addQues = confirm("Want to delete subject ?");
        if (addQues == true) {
            this.course.deleteSubjectFromCourse(instSub)
                .subscribe((result: any) => {
                    if (result.status) {

                    } else {
                        alert(result.message);
                    }
                }, error => {
                    console.log(error);
                });
        }

    }
    subject;
    openEditSubjectModel(index) {
        for (var i = 0; i < this.insSubjects.length; i++) {
            if (this.insSubjects[index] == this.insSubjects[i]) {
                this.subject = this.insSubjects[i];
            }
        }
    }
    editSubject(sub) {
        this.course.editSubject({
                token: this.sAdmin[0].usr_token,
                subname: sub.sub_name,
                subid: sub.sub_id
            })
            .subscribe((result: any) => {
                if (result.status) {
                    for (var i = 0; i < result.data.length; i++)
                        this.subjects.push(result.data[i]);
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
}