import { Component, OnInit,TemplateRef,NgZone  } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { CourseService } from '../admin-services/course.service';
import { Router,ActivatedRoute }  from '@angular/router';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import {CommanService} from '../../core/services/comman.service';
@Component({
  selector: 'app-add-course',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

public modalRef: BsModalRef;
constructor(private modalService: BsModalService,
    private course: CourseService,
    private router: Router, private zone: NgZone, private route: ActivatedRoute,
     private location: Location,private commanService:CommanService) {
    router.events.subscribe((url: any) => url);
    this.commanService.setData('previousRoute', router.url);
}
public msg="Something went wrong"
public openModal(template: TemplateRef < any > ) {
    this.getDefaultCrs();
    this.modalRef = this.modalService.show(template);

}
courses = [];
courseAddByIns = [];
sAdmin;
token;
crs = {
    crs: ''
}
editCor;
editCourseName;
showDefault :boolean=false;
itemPerPageLimit = 5;
pageNo=1;
private courseTotalItems: number;
private maxSize: number = 5;
private courseCurrentPage: number = 1;
//reload function
public reload(): any {
    return this.zone.runOutsideAngular(() => {
        this.ngOnInit();
    });
}
ngOnInit() {
    this.commanService.removeLSData('QB','TL','TS','Stu','FB','StuH','Test','HR');
    this.sAdmin = this.commanService.getData('Sadmin');
    this.sAdmin[0].usr_token;
    let userToken = {
        token: this.sAdmin[0].usr_token
    }
    this.instituteCourse({
        page: 1
    });
}
//getInstitute course
instituteCourse(event: any): void{
    this.pageNo=event.page;
    let instCourse = {
        insid: this.sAdmin[0].ins_id,
        token: this.sAdmin[0].usr_token,
        start : (event.page - 1) * 5,
        end : 5
    };
    this.course.getInstituteCourse(instCourse)
    .subscribe((result: any) => {
        if (result.status) {
            this.courseAddByIns = result.data;
            this.courseTotalItems = result.totalCount[0].totalCount;
        } else {
            this.commanService.checkToken(result);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
    });
}

//getDefaultCourse
getDefaultCrs() {
    this.showDefault=true;
    this.course.getDefaultCourse({
            token: this.sAdmin[0].usr_token,
            insid:this.sAdmin[0].ins_id
        })
        .subscribe((result: any) => {
            if (result.status) {
                this.courses = result.data;
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
}
//show cusstom 
addCustomForm(){
    this.showDefault=false;
}
//add course in institute
addCourse(course) {
    let courseObj;
    if (course.crs) {
        courseObj = {
            insid: this.sAdmin[0].ins_id,
            crsname: course.crs,
            token: this.sAdmin[0].usr_token
        }
    } else {
        let defaultCrs: any = [];
        for (var i = 0; i < course.length; ++i) {
            defaultCrs.push({
                cmid: course[i]
            })
        }
        courseObj = {
            insid: this.sAdmin[0].ins_id,
            cmids: JSON.stringify(defaultCrs),
            token: this.sAdmin[0].usr_token
        }
    }

    this.course.addCourse(courseObj)
        .subscribe((result: any) => {
            if (result.status) {
                this.crs = {
                    crs: ''
                }
                this.commanService.showAlert('Course addded successfully.');
                this.instituteCourse({
                    page: this.pageNo
                });
                //this.reload();
                this.router.navigate(['/admin/addCourse', result.catid]);
                this.commanService.setData('cat', result.catid);
                
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
}
gotoChooseSubject(catId) {
    this.router.navigate(['/admin/addCourse', catId]);
    this.commanService.setData('cat', catId);
}
//remove subject from crouse
removeCourse(crsId, index) {
    let courseRemove = {
        insid: this.sAdmin[0].ins_id,
        crsid: crsId,
        token: this.sAdmin[0].usr_token
    }
    swal({
        title: 'Are you sure?',
        text: 'Want to delete test ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            this.course.deleteCourse(courseRemove)
            .subscribe((result: any) => {
                if (result.status) {
                    this.courseAddByIns.splice(index, 1);
                   // this.reload();
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
        }
    })
    this.courseAddByIns;
}
     openEditCourseModel(index){
        for (var i = 0; i < this.courseAddByIns.length; i++) {
            if (this.courseAddByIns[index] == this.courseAddByIns[i]) {
                this.editCourseName = this.courseAddByIns[i];
            }
        }
    }
    editCourse(course){
    this.course.editCourse({
            token: this.sAdmin[0].usr_token,
            crsname: course.cm_name,
            cmid: course.crs_cmid
        }).subscribe((result: any) => {
             if (result.status) {
                this.instituteCourse({
                    page:this.pageNo
                });
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    editCancel(){
        this.editCor=''
        this.instituteCourse({
        page: this.pageNo
    });
    }
}
