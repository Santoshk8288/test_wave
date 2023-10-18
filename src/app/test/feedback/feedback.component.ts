import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {CommanService} from '../../core/services/comman.service';
import {UserExamService} from '../../core/services/userexam.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  constructor(private router: Router, private userExamService: UserExamService, private commanService: CommanService) {}
  feed = {
      rate: 0,
      feedAns: ''
  }
  max = 5;
  details = {
      loginUser: [],

  }
  testDetails;
  overStar: number;
  percent: number;
  gestUser;
  ngOnInit() {
      this.details.loginUser = this.commanService.getData('loginUser');
      this.testDetails = this.commanService.getData('testDetails');
      this.gestUser = this.commanService.getData('gestUser');
      if(this.gestUser){
        this.details.loginUser = this.gestUser;
      }
  }

  hoveringOver(value: number): void {
      this.overStar = value;
      this.percent = (value / this.max) * 100;
  }

  resetStar(): void {
      this.overStar = void 0;
  }
  addFeedback(feed) {
      if (feed.feedAns == '' && feed.rate == 0)
          this.skipFeedback();
      else {
          let param = {
              token: this.details.loginUser[0].usr_token,
              testid: this.testDetails.test_id,
              stuid: this.details.loginUser[0].stu_id,
              rating: feed.rate,
              comment: feed.feedAns,
              usrtype : this.details.loginUser[0].usr_type.toString()
          }
          this.userExamService.addTestFeedback(param).subscribe((result: any) => {
              if (result.status) {
                this.skipFeedback();
              } else {
                  this.commanService.checkToken(result);
              }
          }, error => {
              this.commanService.showAlert('Something went wrong');
              console.log(error);
          });
      }
  }

  skipFeedback() {
      this.router.navigate(['/test/result']);
  }
  }
