import { Component, OnInit,NgZone } from '@angular/core';
import { TestSeriesService } from '../admin-services/test-series.service';
import { CourseService } from '../admin-services/course.service';
import { ActivatedRoute,Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {CommanService} from '../../core/services/comman.service'

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
@Component({
    selector: 'app-add-question',
    templateUrl: './add-question.component.html',
    styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
    constructor(private course: CourseService, private testlist: TestSeriesService,
        private router: Router, private route: ActivatedRoute,
        private location: Location, private commanService: CommanService, private zone: NgZone) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);
    }
    public reload(): any {
        return this.zone.runOutsideAngular(() => {
            this.ngOnInit();
        });
    }
    public msg = "Something went wrong"
    addQuesForm = {
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
        subject: '',
        answer: '',
        tags : []
    }
    autocompleteItemsAsObjects = [];
    answers = [{
            name: 'A'
        },
        {
            name: 'B'
        },
        {
            name: 'C'
        },
        {
            name: 'D'
        },
    ];
    myProfileViewObj = {
        ImageUrl: "",
        uploadedFile: ""
    }
    token;
    subjects;
    sAdmin;
    quesId;
    params;
    host = '';
    show: boolean = true;
    isHidden: boolean = false;
    isValidate: boolean = false;
    ngOnInit() {
        this.answers;

        this.route.params.subscribe(params => {
            this.quesId = +params['qid'];
        });
        this.sAdmin = this.commanService.getData('Sadmin');
        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
            queid: this.quesId
        }
        if (this.quesId) {
            setTimeout(()=>{
                this.getQuestionDetails(token);
            },500);
        }
        this.getSubjectList(token);
        this.getTagList()
    }
    /* ckeditor*/
    
    quesImageUpload(image) {
        let fd = new FormData();
        fd.append('token', this.sAdmin[0].usr_token);
        fd.append('image', image);
        this.commanService.questionImageUpload(fd)
        .subscribe((result: any) => {
            if (result.status) {
                if(window.location.origin == 'http://www.testwave.in'){
                    this.host = "http://www.testwave.in";
                }else{
                    // this.host = "http://192.168.88.2:8434/testwave";
                    this.host = "http://192.168.88.73:8434/testwave";
                }
                this.myProfileViewObj.ImageUrl = this.host +"/services/server/"+result.imgName;
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    
    //File select and upload question image
    /*fileChange(event) {
        if (event && event.target && event.target.files && event.target.files.length) {
            this.myProfileViewObj.uploadedFile = event.target.files[0];
            this.quesImageUpload(this.myProfileViewObj.uploadedFile);
            var reader = new FileReader();
            reader.onload = (e: any) => {
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    } */

    //quill editor

    // public editor;
    // public editorOptions = {
    //     placeholder: "insert content...",
    // };
    // onEditorBlured(quill) {
    //     //console.log('editor blur!', quill);
    // }

    // onEditorFocused(quill) {
    //     //console.log('editor focus!', quill);
    // }

    // onEditorCreated(quill) {
    //     this.editor = quill;
    //     //console.log('quill is ready! this is current quill instance object', quill);
    // }
    // onContentChanged({ quill, html, text }) {
    //     //console.log('quill content is changed!', quill, html, text);
    // }


    //add 5th field 
    adField() {
        this.isHidden = true;
        this.answers.push({
            name: 'E'
        })
    }
    //get tags
    allTagList = [];
    getTagList() {
        this.params ={
            token : this.sAdmin[0].usr_token,
            insid : this.sAdmin[0].ins_id,
        } 
        this.course.getInstituteTagList(this.params)
        .subscribe((result: any) => {
            if (result.status) {
                // for(let i=0; i<result.data.length; i++){
                //     this.allTagList.push({
                //         tag_id: result.data[i].tag_id,
                //         value: result.data[i].tag_name
                //     });
                // }
                this.autocompleteItemsAsObjects = result.data;
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    //get subject
    getSubjectList(token) {
        this.course.getSubjectList(token)
            .subscribe((result: any) => {

                if (result.status) {
                    this.subjects = result.data;
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    //get question details
    getQuestionDetails(token) {
        if (this.quesId) {
            this.show = false;
            this.testlist.getQuestion(token).subscribe(result => {
                if (result.status) {
                    var a = this;
                    a.addQuesForm = {
                        option1 : decodeURI(result.data[0].que_optionA),
                        option2 : decodeURI(result.data[0].que_optionB),
                        option3 : decodeURI(result.data[0].que_optionC),
                        option4 : decodeURI(result.data[0].que_optionD),
                        option5 : result.data[0].que_optionE == "" ? "" : decodeURI(result.data[0].que_optionE),
                        question: decodeURI(result.data[0].que_description),
                        //question: result.data[0].que_description,
                        // option1: result.data[0].que_optionA,
                        // option2: result.data[0].que_optionB,
                        // option3: result.data[0].que_optionC,
                        // option4: result.data[0].que_optionD,
                        // option5: result.data[0].que_optionE,
                        subject: result.data[0].sub_id,
                        answer: result.data[0].que_answer,
                        tags : result.data[0].tagResult
                    }
                    if (result.data[0].que_optionE != '') {
                        this.adField();
                    }
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
        }
    }
    //validate question paper
    validateQues(ques) {
        if (ques.question == undefined || ques.question == '') {
            this.commanService.showAlert('Please enter question.');
            this.isValidate = false
            return false;
        } else if ((ques.question != '') && (((ques.option2 == "" || ques.option2 == undefined) || (ques.option3 == "" || ques.option3 == undefined) || (ques.option4 == "" || ques.option4 == undefined) || (ques.option1 == "" || ques.option1 == undefined)))) {
            this.commanService.showAlert('Please enter options.');
            this.isValidate = false
            return false;
        } else if (ques.subject == '' || ques.subject == undefined) {
            this.commanService.showAlert('Please select subject.');
            this.isValidate = false
            return false;
        } else if (ques.answer == '' || ques.answer == undefined) {
            this.commanService.showAlert('Please select answer option.');
            this.isValidate = false
            return false;
        } else if (ques.option5 != undefined) {
            if ((ques.option5 == "" || ques.option5 == undefined)) {
                this.commanService.showAlert('Please enter options.');
                this.isValidate = false
                return false;
            }
        }
        this.isValidate = true;
    }
    //add question
    taglist = [];
    addQuestions(ques) {
        for(let i=0; i<ques.tags.length; i++){
            this.taglist.push({
                tagname: ques.tags[i].tag_name,
                tagid: ques.tags[i].tag_id == undefined ? '' : ques.tags[i].tag_id 
            });
        }
        this.validateQues(ques);
        if (this.isValidate == false) {
            return false;
        }
        let quesObj = {
            token: this.sAdmin[0].usr_token,
            subid: ques.subject,
            desc: encodeURI(ques.question),
            optionA: encodeURI(ques.option1),
            optionB: encodeURI(ques.option2),
            optionC: encodeURI(ques.option3),
            optionD: encodeURI(ques.option4),
            optionE: ques.option5 == undefined ? ques.option5 : encodeURI(ques.option5),
            ans: ques.answer,
            remark: '',
            insid: this.sAdmin[0].ins_id,
            tag: this.taglist
        }

        this.testlist.addQuestion(quesObj).subscribe((result: any) => {
            if (result.status) {
                this.addQuesForm = {
                    question: '',
                    option1: '',
                    option2: '',
                    option3: '',
                    option4: '',
                    option5: '',
                    subject: '',
                    answer: '',
                    tags : []
                };
                this.commanService.showAlert(result.message);
                this.router.navigate(['/admin/listQuestion']);
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    //update question
    updateTaglist = [];
    updateQues(ques) {
        this.updateTaglist = [];
        for(let i=0; i<ques.tags.length; i++){
            this.updateTaglist.push({
                tagname: ques.tags[i].tag_name,
                tagid: ques.tags[i].con_tagid == undefined ? ques.tags[i].tag_id == undefined ? '' : ques.tags[i].tag_id : ques.tags[i].con_tagid 
            });
        }
        this.validateQues(ques);
        if (this.isValidate == false) {
            return false;
        }
        let quesObj = {
            queid: this.quesId,
            token: this.sAdmin[0].usr_token,
            subid: ques.subject,
            desc: encodeURI(ques.question),
            optionA: encodeURI(ques.option1),
            optionB: encodeURI(ques.option2),
            optionC: encodeURI(ques.option3),
            optionD: encodeURI(ques.option4),
            optionE: ques.option5 == undefined ? ques.option5 : encodeURI(ques.option5),
            // desc: ques.question,
            // optionA: ques.option1,
            // optionB: ques.option2,
            // optionC: ques.option3,
            // optionD: ques.option4,
            // optionE: ques.option5,
            ans: ques.answer,
            remark: '',
            insid: this.sAdmin[0].ins_id,
            tag: this.updateTaglist
        }
        this.testlist.udateQuestion(quesObj).subscribe((result: any) => {
            if (result.status) {
                this.commanService.showAlert('Question updated successfully.');
                this.router.navigate(['/admin/listQuestion'])
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    goBack(){
        this.router.navigate(['/admin/listQuestion'])
    }
}
