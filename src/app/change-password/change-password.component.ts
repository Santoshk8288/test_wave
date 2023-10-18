import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Validator } from '../core/services/validation.service';
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    providers: [Validator]
})
export class ChangePasswordComponent implements OnInit {
    params: any = {};
    public userPssword = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    loading: boolean = true;
    regUser: FormGroup;

    constructor(
        private formBuilder: FormBuilder, private validator: Validator, private router: Router, private authService: AuthService, private location: Location,
        private commanService: CommanService) {}

    ngOnInit() {
        this.commanService.removeLSData('QB','TL','TS','Stu','FB','StuH','Test','HR');
        this.regUser = this.formBuilder.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, this.validator.validatePass]],
            confirmPassword: ['', [Validators.required]],
        }, {
            validator: this.validator.validateConfirmPass('newPassword', 'confirmPassword')
        });

    }
    goBack() {
        this.location.back();
    }
    changePassword() {
        let formdata = this.regUser.value;
        let loginUser = this.commanService.getData('loginUser');
        if (loginUser) {

            this.params = {
                token: loginUser[0].usr_token,
                usrid: loginUser[0].usr_id,
                oldPass: formdata.currentPassword,
                newPass: formdata.confirmPassword
            }
        } else {
            let sAdmin =this.commanService.getData('Sadmin');
            this.params = {
                token: sAdmin[0].usr_token,
                usrid: sAdmin[0].usr_id,
                oldPass: formdata.currentPassword,
                newPass: formdata.confirmPassword
            }
        }
        this.authService.doChangePassword(this.params).subscribe((result: any) => {
            if (result.status) {
                result.data;
                this.location.back();
                this.commanService.showAlert(result.message);
            } else {
                this.commanService.showAlert(result.message);
            }
        }, error => {
            let msg = 'Something Went wrong';
            this.commanService.showAlert(msg);
            console.log(error);
        });
    }
}
