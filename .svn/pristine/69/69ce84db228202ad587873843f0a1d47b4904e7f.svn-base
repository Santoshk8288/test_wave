import { Component, OnInit,NgZone } from '@angular/core';
import { Router,NavigationEnd,ActivatedRoute }  from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {CommanService} from '../../core/services/comman.service';
import { TestSeriesService } from '../admin-services/test-series.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Validator } from '../../core/services/validation.service';
import 'rxjs/add/operator/map';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    constructor(private formBuilder: FormBuilder, private router: Router, private validator: Validator, private institute: TestSeriesService,
        private commanService: CommanService,) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);
    }
    
    sAdmin;
    public msg = "Something went wrong";
    regUser: FormGroup;
    institidtedData;
    countries;
    states;
    myProfileViewObj = {
        displayImage: "",
        uploadedFile: ""
    }
    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.commanService.removeLSData('QB','TL','TS','Stu','FB','StuH','Test','HR');
        this.regUser = this.formBuilder.group({
            fname: ['', [Validators.required, Validators.maxLength(30)]],
            email: ['', [Validators.required, this.validator.validateEmail]],
            contactno: ['', [Validators.required, this.validator.validateContact]],
            address: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            zipcode: ['', [Validators.required, this.validator.validateZipcode]],
            registration: ['', ],
            website: ['', [this.validator.validateWebsite]]
        });
        this.commanService.getCountryJson().subscribe((res) => {
            this.countries = res.countries;
        });
        this.commanService.getStateJson().subscribe((res) => {
            this.states = res.states;
            this.getInstituteDetail(token);
                 });

        let token = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
        }

               

    }

    getInstituteDetail(token) {
        this.institute.getInstituteDetail(token)
            .subscribe((result: any) => {
                if (result.status) {
                    this.institidtedData = result.data[0];
                    this.regUser.setValue({
                        fname: result.data[0].ins_name,
                        email: result.data[0].ins_email,
                        contactno: result.data[0].ins_contact_no,
                        //username:result.data[0].usr_username,
                        //insid:this.sAdmin[0].ins_name,
                        state: result.data[0].ins_state,
                        country: result.data[0].ins_country,
                        zipcode: result.data[0].ins_zipcode,
                        address: result.data[0].ins_address,
                        city: result.data[0].ins_city,
                        registration: result.data[0].ins_registration_no,
                        website: result.data[0].ins_web
                    });
                    this.filteredArry = this.states.filter((value: any) => {
                        return value.country_id === this.regUser.get('country').value
                    });
                    if (result.data[0].logo) {
                        this.myProfileViewObj.displayImage = './services/server/' + result.data[0].logo;
                    }
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    //File select and show
    fileChange(event) {
        if (event && event.target && event.target.files && event.target.files.length) {
            this.myProfileViewObj.uploadedFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.myProfileViewObj.displayImage = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }
    /*Update Institute */
    updateInstitute(user) {
        let institidtedData = this.regUser.value;
        if (institidtedData.email == '' || institidtedData.fname == '' || institidtedData.contactno == '' ||
            institidtedData.city == '' || institidtedData.state == '' || institidtedData.country == '' || institidtedData.zipcode == '') {
            this.commanService.showAlert('Please fill all the details.');
            return false;
        } else {
            let profileImage = this.myProfileViewObj.uploadedFile === '' ? 'null' : this.myProfileViewObj.uploadedFile;
            let fd = new FormData();
            fd.append('token', this.sAdmin[0].usr_token);
            fd.append('insid', this.sAdmin[0].ins_id);
            fd.append('email', institidtedData.email);
            fd.append('name', institidtedData.fname);
            fd.append('contact', institidtedData.contactno);
            fd.append('address', institidtedData.address);
            fd.append('city', institidtedData.city);
            fd.append('state', institidtedData.state);
            fd.append('country', institidtedData.country);
            fd.append('zipcode', institidtedData.zipcode);
            fd.append('registration', institidtedData.registration);
            fd.append('web', institidtedData.website);
            fd.append('myfile', profileImage);
            this.institute.updateInstitute(fd).subscribe((result: any) => {
                if (result.status) {
                    result.data;
                    this.commanService.showAlert(result.data);
                    this.router.navigate(['/admin/dashbord']);
                    //this.router.navigate(['/admin/student']);
                    //admin/dashbord
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
        }
    }
    /* End of Update Institute*/
    goBack() {
        this.router.navigate(['/admin/dashbord']);
    }
    filteredArry: Array<Object>;
    onCountryChange(countryId){
        this.filteredArry = this.states.filter((value:any) => {
            return value.country_id === countryId
        });
        let selectedState:any;
        selectedState=this.filteredArry[0]
        this.regUser.patchValue({
            state: selectedState.id
        });
    }
}
