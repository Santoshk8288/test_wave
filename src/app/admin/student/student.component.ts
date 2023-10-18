import { Component, OnInit,TemplateRef,NgZone } from '@angular/core';
import { Router,NavigationEnd,ActivatedRoute }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import {Location} from '@angular/common';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
    public modalRef: BsModalRef;
    public msg = "Something went wrong"
    studentDetails;
    sAdmin;
    students;
    itemPerPageLimit = 10;
    pageNo;
    listEndLimit=10;
    endLimit;
    listStudent= 0;
    private studentTotalItems: number;
    private maxSize: number = 5;
    private studentCurrentPage: number = 1;
    public openModal(template: TemplateRef < any > , studentDetail) {
        this.modalRef = this.modalService.show(template);
        this.getStudentDetails(studentDetail.stu_id);
    }
    constructor(private modalService: BsModalService,
        private course: CourseService, private router: Router,
        private route: ActivatedRoute, private location: Location,
        private commanService: CommanService, private zone: NgZone) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);

    }
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }

    ngOnInit() {
        this.commanService.removeLSData('QB','TL','TS','','FB','','Test','');
        this.sAdmin = this.commanService.getData('Sadmin');
        
        // if(this.listStudent ==( '0' || '1'))
        // {
            let Stu=this.commanService.getData('Stu');
            Stu = Stu == null ? {'QL' : 10, 'PN' : 1 ,'SType' : '0'} : Stu;
            let limit = Stu.QL;
            let pageNo = Stu.PN;
            this.listEndLimit=limit == null ? 10 : limit ;
            this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
            if(pageNo !=null || pageNo > 1)
                this.setPage(pageNo);

            this.listStudent=Stu.SType == null ? '0' : Stu.SType;
            this.getStudentList({
                page: pageNo != null || pageNo > 1 ?pageNo : 1,
                endLimit : limit == null ? 10 : limit!=10? limit : 10
            });
        //}
    }
    setPage(pageNo: number): void {
        this.studentCurrentPage = pageNo;
      }
    getStudentList(event: any): void{
        this.pageNo= event.page;
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        this.commanService.setData('Stu',{'PN' : event.page,'QL' : event.endLimit,'SType' :this.listStudent.toString()});
        
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: (event.page - 1) * 10,
            end: event.endLimit,
            type : this.listStudent == 0 ? '0' : this.listStudent
        }
        this.course.getStudentList(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.students = result.data;
                    this.studentTotalItems = result.totalCount[0].totalCount;
                    let setPage = (this.studentTotalItems / event.endLimit ) <(event.page) ? 1 : event.page; 
                    setPage = this.studentCurrentPage<=event.page?this.studentTotalItems:setPage;
                    setTimeout(() => {this.studentTotalItems = setPage}, 100)
                   
                    //setTimeout(() => {this.studentCurrentPage = event.page}, 100)
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    changeStatus(student) {
        let statusAD;
        if (student.usr_isactive == 1)
            statusAD = '0';
        else
            statusAD = '1'

        let param = {
            token: this.sAdmin[0].usr_token,
            usrid: student.usr_id,
            isactive: statusAD
        }
        this.course.activeOrDeactiveStudent(param)
            .subscribe((result: any) => {
                if (result.status) {
                    this.getStudentList({
                        page: this.pageNo
                    });
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    getStudentIdForEdit(id) {
        this.router.navigate(['/admin/registration', id]);
    }
    searchStudent(search) {
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: '',
            end: '',
            name: search,
            type : this.listStudent == 0 ? '0' : this.listStudent
        }

        this.course.getStudentList(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.students = result.data;
                    this.studentTotalItems = result.totalCount[0].totalCount;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });

    }
    getStudentDetails(stuid) {
        let token = {
            token: this.sAdmin[0].usr_token,
            stuid: stuid
        }

        this.course.getStudentDetail(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.studentDetails = result.data;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
     endLimitChange(limit){
        this.endLimit=limit;
        this.commanService.setData('Stu',{'PN' : 1,'QL' : limit,'SType' :this.listStudent.toString()})
        this.setPage(1);
        this.itemPerPageLimit = limit;
        this.getStudentList({
            page: 1,
            endLimit : limit
        });
}
    goToStudentResult(student){
        student.usr_type = this.listStudent==1 ? 2 : this.listStudent;
        this.commanService.setData('StuH',student)
        this.router.navigate(['/test/history'])
    }
    studentListChange(val){
    this.listStudent = val;
    this.listEndLimit=10;
    this.studentCurrentPage = 1;
    this.commanService.setData('Stu',{'PN' : 1,'QL' : this.listEndLimit,'SType' : this.listStudent.toString()})
    console.log(this.listStudent);
        //if(this.listStudent){
            this.getStudentList({
                page:  1,
                endLimit : 10
            });
        //}
    }
}
