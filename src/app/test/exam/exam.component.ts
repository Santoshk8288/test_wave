import { Component, OnInit, NgZone,OnDestroy} from '@angular/core';
import { Router }  from '@angular/router';
import { UserExamService } from '../../core/services/userexam.service';
import {AuthService} from '../../core/services/auth.service';
import { ModalModule } from 'ngx-bootstrap';
import {CommanService} from '../../core/services/comman.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, OnDestroy {
countDownDate;
loginUser;
params: object;
testData: any;
userTestDetails;
question;
gender: boolean;
prop2map = [];
loginUserData;
subNegetiveMarks;
rightMark;
private value = 0;
user = {
    option: '',
    ans: ''
}
remainTime;
testDeatils = [];
resId;
gestUser;
private msg = 'Something Went wrong';
constructor(private router: Router, public zone: NgZone,
    public userExamService: UserExamService, private authService: AuthService, private commanService: CommanService) {
    window['ExamComponent'] = {
        component: this,
        zone: zone
    };
}
resumData:any=[]
ngOnInit() {
    this.loginUser =this.commanService.getData('loginUser');
    this.testData =this.commanService.getData('testDetails');
    this.resId =this.commanService.getData('Resid');
    this.gestUser = this.commanService.getData('gestUser');
    if(this.gestUser){
      this.loginUser = this.gestUser;
    }
    this.loginUserData = this.loginUser[0];

    this.params = {
        token: this.loginUser[0].usr_token,
        testid: this.testData.test_id,
        usrtype: this.loginUser[0].usr_type
    }
   //for resume test
    if(this.testData.res_id != null && this.testData.res_status == 0 ){
        this.userExamService.getTestResultDetail({token: this.loginUser[0].usr_token,resid:this.testData.res_id,usrtype: this.loginUser[0].usr_type}).subscribe((result: any) => {

        if (result.status) {
        	this.resumData=result.data[0];
            } else {
            this.commanService.showAlert(result.message);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });
    }
    this.userExamService.getUserTest(this.params).subscribe((result: any) => {

        if (result.status) {
            this.currentQue = {
                col: 0,
                row: 0,
                index: 1,
                subjectId: 0,
                queid: 0

            };

            this.userTestDetails = result.data[0];
            let subjectLength = this.userTestDetails.subjects;
            for(let j=0; j<subjectLength.length; j++){
                for(let queCount=0; queCount<subjectLength[j].questions.length; queCount++){
                    this.userTestDetails.subjects[j].questions[queCount] = {
                        que_description : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_description),
                        que_id : this.userTestDetails.subjects[j].questions[queCount].que_id,
                        que_optionA : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_optionA),
                        que_optionB : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_optionB),
                        que_optionC : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_optionC),
                        que_optionD : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_optionD),
                        que_optionE : this.userTestDetails.subjects[j].questions[queCount].que_optionE == "" ? "" : decodeURI(this.userTestDetails.subjects[j].questions[queCount].que_optionE),
                        que_remark : this.userTestDetails.subjects[j].questions[queCount].que_remark,
                        que_subid : this.userTestDetails.subjects[j].questions[queCount].que_subid,
                        tqm_id : this.userTestDetails.subjects[j].questions[queCount].tqm_id,
                    }
                }
            }
            this.userTestDetails = this.makeData(this.userTestDetails);
            this.question = this.userTestDetails.subjects[0].questions[0];
            this.subNegetiveMarks = this.userTestDetails.subjects[0].tsmm_negative_marks;
            this.rightMark = (this.userTestDetails.subjects[0].tsmm_total_marks/this.userTestDetails.subjects[0].tsmm_total_questions).toFixed(2);
            //this.getQuestion(this.userTestDetails.subjects[0]);
            if(this.commanService.getData('status') == false || this.commanService.getData('status') == null){
                this.startTest(this.userTestDetails);
            }
            
        } else {
            this.commanService.showAlert(result.message);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });
    setTimeout(()=>{
        this.getQuestionDetails(this.question);
    },1000)

}


allSubjectsTemp;
makeData(allData) {
    this.resId = this.commanService.getData('Resid');
    this.prop2map = this.commanService.getData('question');

    this.questionsId = this.prop2map;
    let data = allData;
    for (var i = 0; i < allData.subjects.length; ++i) {
        if (allData.subjects[i].questions.length) {
            this.testDeatils.push(allData.subjects[i]);
        }
    }
    data.subjects = this.testDeatils;
    let count = 0;
    for (let i = 0; i < this.testDeatils.length; ++i) {
        for (let question of this.testDeatils[i].questions) {
            count++;
            question.que_index = count;
        }
    }
    if (this.testData.res_id != null && this.testData.res_status == 0) {
        this.makeResumData(this.resumData);
    }
    return data;
}
//show status of resume test
makeResumData(data) {
    this.resId = this.commanService.getData('Resid');
    this.prop2map = this.commanService.getData('question');
    let count = 0;
    let resumCount = 0;
    let subj=data.resultDetail;
    subj.sort(function(a, b){
        return a.rd_tqmid-b.rd_tqmid
    });

    for (var i = 0; i < this.testDeatils.length; ++i) {
        for (let question of this.testDeatils[i].questions) {
            count++;
            question.que_index = count;
            if (data.resultDetail.length == resumCount)
                break;
            else if (data.resultDetail[resumCount].rd_tqmid == question.tqm_id) {
                this.setCss(data.resultDetail[resumCount], question)
                resumCount++;

            }
        }

    }
    if(this.testData.test_type == 1){
       setTimeout(()=>{
       this.resumData.test_duration = this.resumData.res_time;
        this.countDownDate = this.userExamService.getAddTimeToCurrentTime(this.resumData);
     },1000) 
    }
    return data;
}
setCss(status, question) {

    let option = status.rd_status;
    switch (option) {
        case 1:
            this.setSelected[question.que_index] = question.que_id;
            this.questionsId.push({
                tqmid: question.tqm_id,
                ans: status.rd_usr_ans,
                time: this.remainTime,
                status: status.rd_status
            });
            this.user.option = status.rd_usr_ans;
            this.commanService.setData('question',this.questionsId);
            break;
        case 2:
            this.setNotAns[question.que_index] = question.que_id;
            this.questionsId.push({
                tqmid: question.tqm_id,
                ans: status.rd_usr_ans,
                time: this.remainTime,
                status: status.rd_status
            });
            this.user.option = status.rd_usr_ans;
            this.commanService.setData('question',this.questionsId);
            break;
        case 3:
            this.setReview[question.que_index] = question.que_id;
            this.questionsId.push({
                tqmid: question.tqm_id,
                ans: status.rd_usr_ans,
                time: this.remainTime,
                status: status.rd_status
            });
            this.user.option = status.rd_usr_ans;
            this.commanService.setData('question',this.questionsId);

            break;
        case 4:
            this.setReviewAns[question.que_index] = question.que_id;
            this.questionsId.push({
                tqmid: question.tqm_id,
                ans: status.rd_usr_ans,
                time: this.remainTime,
                status: status.rd_status
            });
            this.user.option = status.rd_usr_ans;
            this.commanService.setData('question',this.questionsId);
            break;

    }
}
//show numbers of questions
currentQue = {
    row: 0,
    col: 0,
    subjectId: 0,
    queid: 0,
    index: 1
};
currentIndex(row, col, index) {
    this.currentQue.row = row;
    this.currentQue.col = col;
    this.currentQue.index = index;

}
previousIndex = 0;
allSubjects = [];
setSelected = [];
setReview = [];
setNotAns = [];
setReviewAns = [];
setOption(questionObj, optIndex) {
    this.user.ans = optIndex;
    this.user.option = optIndex;
}
goToQuestion(detail) {
    this.prop2map = this.commanService.getData('question');
    this.questionsId = this.prop2map;
    this.user.option = '';
    this.params = {
        token: this.loginUser[0].usr_token,
        queid: detail.que_id,
    }
    this.currentQue.queid = detail.que_id;
    this.currentQue.subjectId = detail.que_subid;

    if (this.questionsId) {

        var testID = this.questionsId.filter(test => test.tqmid === detail.tqm_id);
        if (testID.length != 0) {
            let quesAnsParam = {
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                tqmid: testID[0].tqmid
            }
            this.getQuestionDetails(detail);
            this.getGivenQuestionAnswer(detail)
        } else {
            this.currentQue.index;
            if (detail.que_id)
                this.question = detail
            else
                this.getQuestionDetails(detail);
        }
    }

}

//get given question answer
getGivenQuestionAnswer(ques) {
    this.prop2map = this.commanService.getData('question');
    this.questionsId = this.prop2map;
    if (this.questionsId) {
        var testID;
        // testID = this.questionsId.filter(test => test.tqmid === ques.tqm_id);
        testID = this.questionsId.filter(test => test.tqmid === (ques.tqmid || ques.tqm_id));
        if (testID != 0) {
            this.user.option = testID[0].ans
        }
    }
}
getSubjectQuestionTab(ques, subject) {
    this.currentQue.col = 0;
    this.elementPos = this.currentQue.row;
    this.currentQue.index = ques.que_index;
    this.getSubjectQuestion(ques, subject);
}
getSubjectQuestion(ques, subject) {
    this.user.option = '';
    this.elementPos = this.currentQue.row;
    //this.currentQue.col = this.currentQue.col;
    this.subNegetiveMarks = subject.tsmm_negative_marks;
    this.rightMark = (subject.tsmm_total_marks/subject.tsmm_total_questions).toFixed(2);
    this.question = ques;
    this.currentQue.index = ques.que_index;
    let quesAnsParam = {
        token: this.loginUser[0].usr_token,
        resid: this.resId,
        tqmid: ques.tqm_id
    }
    if (this.questionsId) {
        var testID;
        testID = this.questionsId.filter(test => test.tqmid === ques.tqm_id);
        if (testID != 0) {
        
            let UpdateToken = {
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                tqmid: testID[0].tqmid,
                ans: testID[0].ans,
                ansStatus: testID[0].status,
                time: this.remainTime,
                usrtype: this.loginUser[0].usr_type
            }
            this.AnsUpdate(UpdateToken);
        }
    }
   //  setTimeout(()=>{
   //     this.getGivenQuestionAnswer(ques) 
   // },1000)
    
}
// get question detail
getQuestionDetails(subject) {
    this.elementPos = this.currentQue.row;
    this.user.option = '';
    if (this.questionsId) {
        var testID;
        testID = this.questionsId.filter(test => test.tqmid === subject.tqm_id);
        if (testID != 0) {
            this.params = {
                token: this.loginUser[0].usr_token,
                rdid: testID[0].rdid
            }
            this.question = subject;
            let quesAnsParam = {
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                tqmid: testID[0].tqmid
            }
            this.getGivenQuestionAnswer(this.question)


        } else if (subject.que_id) {
            this.question = subject;
            this.currentQue.index = subject.que_index;
        } else {

            this.currentQue.index;
            this.question = this.question;

        }

    }

}
questionsId = []
data = [];
// save and next questions
saveNext(question) {
    this.setSelected[this.currentQue.index] = '';
    this.setReview[this.currentQue.index] = '';
    this.setNotAns[this.currentQue.index] = '';
    this.setReviewAns[this.currentQue.index] = '';
    if (this.user.option) {
        this.user.ans=this.user.option;
        let param = {
            token: this.loginUser[0].usr_token,
            resid: this.resId,
            tqmid: question.tqm_id,
            ans: this.user.ans,
            ansStatus: '1',
            time: this.remainTime,
            usrtype: this.loginUser[0].usr_type
        }
        this.setSelected[this.currentQue.index] = question.que_id;
        this.updateAnswer(param);


        this.user.option = '';
    } else if (!this.user.option) {

        let param = {
            token: this.loginUser[0].usr_token,
            resid: this.resId,
            tqmid: question.tqm_id,
            ans: '',
            ansStatus: '2',
            time: this.remainTime,
            usrtype: this.loginUser[0].usr_type
        }
        this.setNotAns[this.currentQue.index] = question.que_id;
        this.updateAnswer(param);
        this.user.option = '';

    } else {
        this.user.option = '';
    }
}
markAnsNext(question) {
    this.setSelected[this.currentQue.index] = '';
    this.setReview[this.currentQue.index] = '';
    this.setNotAns[this.currentQue.index] = '';
    this.setReviewAns[this.currentQue.index] = '';
    if (this.user.option) {
        this.user.ans=this.user.option;
        let param = {
            token: this.loginUser[0].usr_token,
            resid: this.resId,
            tqmid: question.tqm_id,
            ans: this.user.ans,
            ansStatus: '4',
            time: this.remainTime,
            usrtype: this.loginUser[0].usr_type
        }
        this.setReviewAns[this.currentQue.index] = question.que_id;
        this.updateAnswer(param);
        this.user.option = '';
    } else if (!this.user.option) {

        let param = {
            token: this.loginUser[0].usr_token,
            resid: this.resId,
            tqmid: question.tqm_id,
            ans: '',
            ansStatus: '3',
            time: this.remainTime,
            usrtype: this.loginUser[0].usr_type
        }
        this.setReview[this.currentQue.index] = question.que_id;
        this.updateAnswer(param);
        this.user.option = '';

    } else {
        this.user.option = '';
    }
}
previousQues(question, opt) {
    if (opt == "") {
        this.setNotAns[question.que_index] = question.que_id;
        this.setQuesNotAns(question);


    }
}
setQuesNotAns(question) {
    let data: any = [];
    let param = {
        token: this.loginUser[0].usr_token,
        resid: this.resId,
        tqmid: question.tqm_id,
        ans: '',
        ansStatus: '2',
        time: this.remainTime,
        usrtype: this.loginUser[0].usr_type
    }
    this.userExamService.updateAnswer(param).subscribe((result: any) => {

        if (result.status) {
            if (this.questionsId) {
                for (var i = 0; i < this.questionsId.length; ++i) {
                    if (this.questionsId[i].tqmid === param.tqmid) {
                        this.questionsId.splice(i, 1);
                        this.commanService.setData('question',this.questionsId);
                        break;
                    }
                }
                this.questionsId.push({
                    tqmid: param.tqmid,
                    rdid: result.rdid,
                    ans: param.ans,
                    time: param.time,
                    status: param.ansStatus
                });
                this.commanService.setData('question',this.questionsId);

            } else {
                data.push({
                    tqmid: param.tqmid,
                    rdid: result.rdid,
                    ans: param.ans,
                    time: param.time,
                    status: param.ansStatus
                });
                this.commanService.setData('question',data);
            }

            let sub = this.userTestDetails.subjects.length;
            let quest = this.userTestDetails.subjects[sub - 1].questions.length;
            if (this.userTestDetails.subjects[sub - 1].questions[quest - 1].tqm_id == param.tqmid) {
                //this.question = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                let ques = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                this.getGivenQuestionAnswer(ques);
            }
        } else {
            this.commanService.checkToken(result);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });
}
elementPos = 0;
upIndex = 0;
currentQuesSubject(question) {
    this.prop2map = this.commanService.getData('question');
    this.questionsId = this.prop2map;
    this.currentQue.col = this.currentQue.col + 1;
    this.upIndex = this.currentQue.col;

    if (this.upIndex < this.userTestDetails.subjects[this.elementPos].questions.length) {
        this.question = this.userTestDetails.subjects[this.elementPos].questions[this.currentQue.col];

        let nxtQue = {
            que_id: this.question[this.upIndex],
            que_subid: this.currentQue.subjectId,
            que_index: this.currentQue.index + 1
        }
        this.currentQue.index = nxtQue.que_index;
        this.goToQuestion(nxtQue);
    } else {

        this.elementPos = this.elementPos + 1
        if ((this.elementPos) < this.userTestDetails.subjects.length) {
            this.currentQue.col = 0;
            this.currentQue.row = this.currentQue.row + 1;

            this.question = this.userTestDetails.subjects[this.elementPos].questions[this.currentQue.col];


            if (this.currentQue.col == 1)
                this.currentQue.index = this.currentQue.index + 1;
            else
                this.currentQue.index = this.currentQue.index + 1;
            this.goToQuestion(this.question);
        }
    }
    if (this.questionsId) {

        var testID = this.questionsId.filter(test => test.tqmid === this.question.tqm_id);
        if (testID.length != 0) {
            let quesAnsParam = {
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                tqmid: testID[0].tqmid
            }
            this.getQuestionDetails(this.question);
            this.getGivenQuestionAnswer(testID);
        }
    }

}
updateAnswer(token) {
    this.prop2map = this.commanService.getData('question');
    this.questionsId = this.prop2map;
    let data: any = [];
    this.elementPos = this.currentQue.row;
    if (this.questionsId) {

        var testID = this.questionsId.filter(test => test.tqmid === token.tqmid);
        if (testID.length != 0) {
            let UpdateToken = {
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                tqmid: token.tqmid,
                ans: token.ans,
                ansStatus: token.ansStatus,
                time: this.remainTime,
                usrtype: this.loginUser[0].usr_type
            }
            this.updateAnsQues(UpdateToken);
        } else {

            this.userExamService.updateAnswer(token).subscribe((result: any) => {

                if (result.status) {
                    if (this.questionsId) {
                        for (var i = 0; i < this.questionsId.length; ++i) {
                            if (this.questionsId[i].tqmid === token.tqmid) {
                               this.questionsId.splice(i, 1);
                               this.commanService.setData('question',this.questionsId);
                                break;
                            }
                        }
                        this.questionsId.push({
                            tqmid: token.tqmid,
                            rdid: result.rdid,
                            ans: token.ans,
                            time: token.time,
                            status: token.ansStatus
                        });
                        this.commanService.setData('question',this.questionsId);
                    } else {
                        data.push({
                            tqmid: token.tqmid,
                            rdid: result.rdid,
                            ans: token.ans,
                            time: token.time,
                            status: token.ansStatus
                        });
                        this.commanService.setData('question',data);
                    }
                } else {
                    this.commanService.showAlert(result.message);
                }
                let sub = this.userTestDetails.subjects.length;
                let quest = this.userTestDetails.subjects[sub - 1].questions.length;
                if (this.userTestDetails.subjects[sub - 1].questions[quest - 1].tqm_id == token.tqmid) {
                    //this.question = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                    let ques = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                    this.user.option = '';
                    //setTimeout(() => {
                        this.getGivenQuestionAnswer(ques);
                    //}, 100)
                } else
                    this.currentQuesSubject(token.tqmid);
            }, error => {
                this.commanService.showAlert(this.msg);
                console.log(error);
            });
        }
    } else {
        this.userExamService.updateAnswer(token).subscribe((result: any) => {

            if (result.status) {
                if (this.questionsId) {
                    for (var i = 0; i < this.questionsId.length; ++i) {
                        if (this.questionsId[i].tqmid === token.tqmid) {
                           this.questionsId.splice(i, 1);
                           this.commanService.setData('question',this.questionsId);
                            break;
                        }
                    }
                    this.questionsId.push({
                        tqmid: token.tqmid,
                        rdid: result.rdid,
                        ans: token.ans,
                        time: token.time,
                        status: token.ansStatus
                    });
                    this.commanService.setData('question',this.questionsId);

                } else {
                    data.push({
                        tqmid: token.tqmid,
                        rdid: result.rdid,
                        ans: token.ans,
                        time: token.time,
                        status: token.ansStatus
                    });
                    this.commanService.setData('question',data);
                }

            } else {
                this.commanService.checkToken(result);
            }
            let sub = this.userTestDetails.subjects.length;
            let quest = this.userTestDetails.subjects[sub - 1].questions.length;
            if (this.userTestDetails.subjects[sub - 1].questions[quest - 1].tqm_id == token.tqmid) {
                //this.question = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                let ques = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                this.user.option = '';
                this.getGivenQuestionAnswer(ques);
            } else
                this.currentQuesSubject(token.tqmid);
        }, error => {
            this.commanService.showAlert(this.msg);
            console.log(error);
        });
    }
}
updateAnsQues(token) {
    let data: any = [];
    this.userExamService.updateAnswer(token).subscribe((result: any) => {

        if (result.status) {
            if (this.questionsId) {
                for (var i = 0; i < this.questionsId.length; ++i) {
                    if (this.questionsId[i].tqmid === token.tqmid) {
                        this.questionsId.splice(i, 1);
                        this.commanService.setData('question',this.questionsId);
                        break;
                    }
                }
                this.questionsId.push({
                    tqmid: token.tqmid,
                    rdid: result.rdid,
                    ans: token.ans,
                    time: token.time,
                    status: token.ansStatus
                });
                this.commanService.setData('question',this.questionsId);
            } else {
                data.push({
                    tqmid: token.tqmid,
                    rdid: result.rdid,
                    ans: token.ans,
                    time: token.time,
                    status: token.ansStatus
                });
                this.commanService.setData('question',data);
            }

            this.user.option = '';
            let sub = this.userTestDetails.subjects.length;
            let quest = this.userTestDetails.subjects[sub - 1].questions.length;
            if (this.userTestDetails.subjects[sub - 1].questions[quest - 1].tqm_id == token.tqm_id) {
                //this.question = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                let ques = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                // setTimeout(() => {
                    this.getGivenQuestionAnswer(ques);
                // }, 1000)

            } else
                this.currentQuesSubject(token.tqmid);
        } else {
            this.commanService.checkToken(result);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });

}
AnsUpdate(token){
    let data: any = [];
    this.userExamService.updateAnswer(token).subscribe((result: any) => {

        if (result.status) {
            if (this.questionsId) {
                for (var i = 0; i < this.questionsId.length; ++i) {
                    if (this.questionsId[i].tqmid === token.tqmid) {
                        this.questionsId.splice(i, 1);
                        this.commanService.setData('question',this.questionsId);
                        break;
                    }
                }
                this.questionsId.push({
                    tqmid: token.tqmid,
                    rdid: result.rdid,
                    ans: token.ans,
                    time: token.time,
                    status: token.ansStatus
                });
                this.commanService.setData('question',this.questionsId);
            } else {
                data.push({
                    tqmid: token.tqmid,
                    rdid: result.rdid,
                    ans: token.ans,
                    time: token.time,
                    status: token.ansStatus
                });
                this.commanService.setData('question',data);
            }

            this.user.option = '';
            let sub = this.userTestDetails.subjects.length;
            let quest = this.userTestDetails.subjects[sub - 1].questions.length;
            if (this.userTestDetails.subjects[sub - 1].questions[quest - 1].tqm_id == token.tqm_id) {
                //this.question = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
                let ques = this.userTestDetails.subjects[sub - 1].questions[quest - 1];
               // setTimeout(() => {
                    this.getGivenQuestionAnswer(ques);
               // }, 1000)
            token = ques;
            }
             setTimeout(()=>{
       this.getGivenQuestionAnswer(token) 
   },100)
    
        } else {
            this.commanService.checkToken(result);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });
}

// reset answer
resetAns() {
    this.setSelected[this.currentQue.index] = '';
    this.setReview[this.currentQue.index] = '';
    this.setNotAns[this.currentQue.index] = '';
    this.setReviewAns[this.currentQue.index] = '';
    this.user.option = '';
    this.gender = false;
    if (this.questionsId) {
        var testID;
        testID = this.questionsId.filter(test => test.tqmid === this.question.tqm_id);
        if (testID != 0) {
            let que=this.question;
            this.setNotAns[que.que_index] = que.que_id;
            setTimeout(()=>{
                this.setQuesNotAns(que)
            },1000)
            
        }

    }
}
ngOnDestroy() {
    clearInterval(this.x);
}

// move to feedback
submit() {
    if(this.theHtmlString!="EXPIRED"){
        swal({
          title: 'Are you sure',
          text: 'want to submit exam?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
              this.testSubmit();  
          }
        });
    }else{
        this.commanService.showAlert('Time Expired');
        this.testSubmit();
    }

}
testSubmit(){
    this.userExamService.submitTest({
                token: this.loginUser[0].usr_token,
                resid: this.resId,
                time: this.remainTime,
                usrtype:this.loginUser[0].usr_type
            }).subscribe((result: any) => {

                if (result.status) {
                    clearInterval(this.x);
                    localStorage.removeItem('question');
                    this.userExamService.setTestStatus(false);
                    this.router.navigate(['/test/feedback']);
                    result
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
                console.log(error);
            });
}
instruction;
// move to profile
goInstruction() {
    //this.loginUser = this.commanService.getData('loginUser');
    this.params = {
        token: this.loginUser[0].usr_token,
        testid: this.testData.test_id,
        stuid : this.loginUser[0].stu_id,
        testtype:this.testData.test_type == 0 ? '0' : this.testData.test_type,
        usrtype:this.loginUser[0].usr_type
    }

    this.commanService.getInstruction(this.params).subscribe((result: any) => {

        if (result.status) {
            this.instruction = result.data[0];
        } else {
            this.commanService.showAlert(result.message);
        }
    }, error => {
        this.commanService.showAlert(this.msg);
        console.log(error);
    });
}
x = setInterval(function() {
    window['ExamComponent'].zone.run(() => {
        window['ExamComponent'].component.timer();
    });
}, 1000);
theHtmlString;
// timer for coundown 
timer() {
    if (this.userExamService.getTestStatus() !== 'false') {
        this.countDownDate = this.userExamService.getTestTime();
        // Get todays date and time
        let now = new Date().getTime();
        // Find the distance between now an the count down date
        let distance = this.countDownDate - now;
        

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        this.theHtmlString = hours + "H :" + minutes + "m : " + seconds;
        
        this.remainTime = hours*60 + minutes+seconds/100;
        console.log(this.remainTime)
        // If the count down is over, write some text 
        if (distance < 0) {
            this.theHtmlString = "EXPIRED";
            this.endTest();
            this.submit();
            clearInterval(this.x);

            return false;
        }
    }
}
startTest(time) {
    console.log(time)
    this.userExamService.setTestStatus(true);
    this.countDownDate = this.userExamService.getAddTimeToCurrentTime(time); //this.x = setInterval(function() { window['ExamComponent'].zone.run(() => {window['ExamComponent'].component.timer();});}, 1000);
}
endTest() {
    this.commanService.setData('false',status);
    localStorage.removeItem('question');
    this.userExamService.setTestStatus(false);
}
}

