import { Component, OnInit,TemplateRef,NgZone } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { Router,ActivatedRoute }  from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap/modal'
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import { CourseService } from '../admin-services/course.service';
import {CommanService} from '../../core/services/comman.service';
@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
  
    constructor(private router: Router, private testlist: TestSeriesService,
        private route: ActivatedRoute, private location: Location,
        private modalService: BsModalService,
        private courseService: CourseService, 
        private zone: NgZone, private commanService: CommanService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);
    }
    public modalRef: BsModalRef;
    public msg = "Something went wrong"
    questionsList;
    subjects;
    sAdmin;
    endLimit;
    listEndLimit = 10;
    itemPerPageLimit;
    subject = '0';
    private bigTotalItems: number;
    private maxSize: number = 5;
    bigCurrentPage: number = 1;
    srch = {
        desc: '',
        subid: ''
    };
    questionSearch = '0';
    question: any = [];
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.commanService.removeLSData('','TL','TS','Stu','FB','StuH','Test','HR');
        let QBP=this.commanService.getData('QB');
        QBP = QBP == null ? {'QL' : 10, 'PN' : 1 } : QBP;
        let limit = QBP.QL;
        this.subject = QBP.sub;
        let pageNo = QBP.PN;
        this.subject =this.subject == null ? '0': this.subject;
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        if(pageNo !=null || pageNo > 1)
            this.setPage(pageNo);

        this.pageChanged({
            page: pageNo != null || pageNo > 1 ?pageNo : 1,
            endLimit : limit == null ? 10 : limit!=10? limit : 10
        });
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id

        }
        this.courseService.getSubjectList(token).subscribe((result: any) => {
            if (result.status) {
                this.subjects = result.data;
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }

    setPage(pageNo: number): void {
        this.bigCurrentPage = pageNo;
      }

    QestionData(question){

        this.question = question;
    
    }
    goToQestionView(ques) {
        this.router.navigate(['/admin/addQuestion', ques.que_id]);
    }
    removeQuesrion(qid) {
        let QBP =this.commanService.getData('QB');
        QBP = QBP == null ? {'QL' : 10, 'PN' : 1 } : QBP;
        let limit=QBP.QL
        let pageNo=QBP.PN
        this.listEndLimit=limit == null ? 10 : limit ;
        this.itemPerPageLimit = limit == null ? 10 : limit!=10? limit : 10;
        
        let token = {
            token: this.sAdmin[0].usr_token,
            queid: qid
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
                this.testlist.deleteQuestion(token).subscribe((result: any) => {
                if (result.status) {
                    this.commanService.showAlert('Question deleted successfully.');
                    this.pageChanged({
                    page: pageNo != null || pageNo > 1 ?pageNo : 1,
                    endLimit : limit == null ? 10 : limit!=10? limit : 10
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
    decodeQuestions(ques){
        for(let j=0; j<ques.length; j++){
            this.questionsList[j] = {
                que_answer : this.questionsList[j].que_answer,
                que_description : decodeURI(this.questionsList[j].que_description),
                que_id : this.questionsList[j].que_id,
                que_optionA : decodeURI(this.questionsList[j].que_optionA),
                que_optionB : decodeURI(this.questionsList[j].que_optionB),
                que_optionC : decodeURI(this.questionsList[j].que_optionC),
                que_optionD : decodeURI(this.questionsList[j].que_optionD),
                que_optionE : this.questionsList[j].que_optionE == "" ? "" : decodeURI(this.questionsList[j].que_optionE),
                que_remark : this.questionsList[j].que_remark,
                que_subid : this.questionsList[j].que_subid,
                sub_name : this.questionsList[j].sub_name,
                tag_id : this.questionsList[j].tag_id,
                tag_name : this.questionsList[j].tag_name,
            }
        }
    }
    pageChanged(event: any): void {
        if(!event.endLimit){
            event.endLimit = (this.listEndLimit == 10 ||  (this.endLimit != 10 || undefined || null)) ? this.endLimit : this.listEndLimit
            event.endLimit= event.endLimit == undefined ? 10 : event.endLimit;
            event.endLimit=this.listEndLimit != 10 ? this.listEndLimit : event.endLimit;
        }
        let sub =(this.srch.subid =='' ||(this.subject!='0' || undefined || null) )? this.subject : this.srch.subid
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            start: (event.page - 1) * this.listEndLimit,
            end: event.endLimit,
            desc: this.srch.desc,
            subid: sub == '0' ? '': sub ,
            searchBy: this.questionSearch == '0' ? 0: this.questionSearch
        }
        this.commanService.setData('QB',{'sub' : this.subject== '' ? '0' : this.subject,'PN' : event.page,'QL' : event.endLimit})
        this.testlist.getQuestionList(token).subscribe((result: any) => {
            if (result.status) {
                this.questionsList = result.data;
                this.bigTotalItems = result.totalCount[0].totalCount;
                this.decodeQuestions(this.questionsList);
                let setPage = (this.bigTotalItems / event.endLimit ) <(event.page) ? 1 : event.page; 
                setPage = this.bigCurrentPage<=event.page?this.bigCurrentPage:setPage;
                setTimeout(() => {this.bigCurrentPage = setPage}, 100)
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
        
    }
    searchQues(search) {
        this.srch.desc = search
        this.pageChanged({
            page: 1,
            endLimit : this.endLimit !=10 ? this.endLimit : this.listEndLimit
        });
    }
    public openModal(template: TemplateRef < any > , question) {
        this.modalRef = this.modalService.show(template);
        this.question = question;
    }
    onChange(sub) {
        this.commanService.setData('QB',{'sub' : sub,'PN' : 1,'QL' : 10})
        this.srch.subid = sub;
        this.pageChanged({
            page: 1,
            endLimit : this.endLimit !=10 ? this.endLimit : this.listEndLimit
        });
        this.reload();
    }
    endLimitChange(limit){
        this.endLimit=limit;
        this.commanService.setData('QB',{'sub' : this.subject== '' ? '0' : this.subject,'PN' : 1,'QL' : limit})
        this.setPage(1);
        this.itemPerPageLimit = limit;
        this.pageChanged({
            page: 1,
            endLimit : limit
        });
    }
}
