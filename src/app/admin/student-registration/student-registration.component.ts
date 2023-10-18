import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { CourseService } from '../admin-services/course.service';
import {Location} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import {CommanService} from '../../core/services/comman.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Validator } from '../../core/services/validation.service';
import { TestSeriesService } from '../admin-services/test-series.service';
@Component({
    selector: 'app-student-registration',
    templateUrl: './student-registration.component.html',
    styleUrls: ['./student-registration.component.scss'],
    providers: [Validator]
})
export class StudentRegistrationComponent implements OnInit {
    params: any = {};
    myProfileViewObj = {
        displayImage: "",
        uploadedFile: ""
    }
    studentId;
    sAdmin;
    insCourse: any = [];
    loading: boolean = true;
    userNameCheck: boolean = false;
    public msg = "Something went wrong"
    countries;
    states;
    studentData;
    isDisabled: boolean = false;
    regUser: FormGroup;
    updateShow: boolean = false;
    userState: any = [];
    usercrsid: any = [];
    show:boolean=false;
    seriesName:any=[];
    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private course: CourseService, private route: ActivatedRoute,
        private location: Location, private commanService: CommanService, private validator: Validator,
        private testSeriesService: TestSeriesService) {
        router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', router.url);
    }

    private country: string = "assets/json/country.json";

    ngOnInit() {
        this.sAdmin = this.commanService.getData('Sadmin');
        this.route.params.subscribe(params => {
            this.studentId = +params['sid'];
        });
         this.getInstituteCourse();
         this.getInstituteSeries();

        this.commanService.getCountryJson().subscribe((res) => {

            this.countries = res.countries;
        });
        this.commanService.getStateJson().subscribe((res) => {
            this.states = res.states;
            if (this.studentId) {
                this.isDisabled = true;
                this.getStudentDetails();
            }
            
        });

        this.regUser = this.formBuilder.group({
            fname: ['', [Validators.required, this.validator.validateName]],
            lname: ['', [Validators.required, this.validator.validateName]],
            fathername: ['', [Validators.required, this.validator.validateName]],
            email: ['', [Validators.required, this.validator.validateEmail]],
            contactno: ['', [this.validator.validateAlternateContact]],
            username: [{
                    value: '',
                    disabled: this.isDisabled
                },
                [Validators.required]
            ],
            dob: ['', [Validators.required]],
            qualification: ['', [Validators.required]],
            password: ['', [Validators.required, this.validator.validatePass]],
            crsid: [
                [],
                 
            ],
            address: ['', [Validators.required]],
            city: ['', [Validators.required]],
            insid: new FormControl({
                value: this.sAdmin[0].ins_name,
                disabled: true
            }),
            state: ['', [Validators.required]],
            country: ['', [Validators.required]],
            zipcode: ['', [Validators.required, this.validator.validateZipcode]],
            mobilenumber: ['', [Validators.required, this.validator.validateContact]],
            access :    new FormControl('1')
        });
    }

    selectedCourse:any=[];
    getInstituteCourse() {
        let param = {
            token: this.sAdmin[0].usr_token,
            insid: this.sAdmin[0].ins_id,
        }
        this.course.getInstituteCourse(param).subscribe((result: any) => {
            if (result.status) {
                this.insCourse = result.data;
                
            } else {
                this.commanService.checkToken(result);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }
    changeCouse(){
        for(let i=0;i<this.insCourse.length;i++){
            for(let j = 0; j < this.selectedCourse.length; j++){
                if(this.selectedCourse[j].crs_id == this.insCourse[i].crs_id){
                    this.insCourse[i].selected = false;
                }
            }
        }
    }
    selectedSeries: any=[];
    getInstituteSeries(){

    this.testSeriesService.getSeriesList({token : this.sAdmin[0].usr_token,
          insid: this.sAdmin[0].ins_id}).subscribe((result: any)=> { 
    if(result.status){
    
     this.seriesName = result.data;
     
    }
    else{
      this.commanService.checkToken(result);
    }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  
    }
    onCourseTypeChange(val){
        if(val == 1){
            this.show=false
            for(let i=0;i<this.insCourse.length;i++){
                    this.insCourse[i].selected = false;
                    for(let j = 0; j < this.selectedCourse.length; j++){
                        if(this.selectedCourse[j].crs_id == this.insCourse[i].crs_id){
                            this.insCourse[i].selected = true;
                        }
                    }
                }
            this.selectedCourse=[]
        }
        else{
            for(let i=0;i<this.seriesName.length;i++){
                this.seriesName[i].selected = false;
                for(let j = 0; j < this.selectedSeries.length; j++){
                        if(this.selectedSeries[j].crs_id == this.seriesName[i].ser_id){
                            this.seriesName[i].selected = true;
                        }
                    }
                }
            this.show=true;
            this.selectedSeries=[]
        }
        this.regUser.patchValue({crsid : ''})
            
    }
    //check userName avl or not
    focusOutUserNameFunction(username) {
        if (!username) {
            return false;
        }
        this.params = {
            token: this.sAdmin[0].usr_token,
            username: username
        }
        this.authService.verifyUserName(this.params).subscribe((result: any) => {
            if (result.status) {
                this.userNameCheck = false;
                result.data;
            } else {
                this.userNameCheck = true;
                this.commanService.showAlert(result.message);
            }
        }, error => {
            this.commanService.showAlert(this.msg);
        });
    }

    goBack() {
        this.router.navigate(['/admin/student']);
    }

    register(user) {
        let studentDetails = this.regUser.value;
        if (studentDetails.username == '' || studentDetails.password == '' || studentDetails.email == '' || studentDetails.fname == '' || studentDetails.lname == '' || studentDetails.fathername == '' || studentDetails.mobilenumber == '' ||
            studentDetails.qualification == '' || studentDetails.dob == '' || studentDetails.city == '' || studentDetails.state == '' || studentDetails.country == '' || studentDetails.zipcode == '' || studentDetails.crsid.length == 0) {
            this.commanService.showAlert('Please fill all the details.');
            return false;
        } else {
                let fd = new FormData();
            if (this.userNameCheck == true) {
                this.commanService.showAlert('User name available.');
                return false;
            }
            let crs: any = [];
            if (user.access == 1) {
                
                for (var i = 0; i < studentDetails.crsid.length; ++i) {
                    crs.push({
                        crsid: studentDetails.crsid[i]
                    })
                }
                fd.append('type', '0');
                fd.append('crsid', JSON.stringify(crs));
            }else if (user.access == 0) {
                for (var i = 0; i < studentDetails.crsid.length; ++i) {
                    crs.push({
                        crsid: studentDetails.crsid[i]
                    })
                }
                fd.append('type', '1');
                fd.append('crsid', JSON.stringify(crs));
            }
            
            let profileImage = this.myProfileViewObj.uploadedFile === '' ? 'null' : this.myProfileViewObj.uploadedFile;
            
            fd.append('token', this.sAdmin[0].usr_token);
            fd.append('username', studentDetails.username);
            fd.append('password', studentDetails.password);
            fd.append('email', studentDetails.email);
            fd.append('fname', studentDetails.fname);
            fd.append('lname', studentDetails.lname);
            fd.append('fathername', studentDetails.fathername);
            fd.append('contact1', studentDetails.mobilenumber);
            fd.append('contact2', studentDetails.contactno);
            fd.append('dob', studentDetails.dob);
            fd.append('qualification', studentDetails.qualification);
            fd.append('address', studentDetails.address);
            fd.append('city', studentDetails.city);
            fd.append('state', studentDetails.state);
            fd.append('country', studentDetails.country);
            fd.append('zipcode', studentDetails.zipcode);
            fd.append('insid', this.sAdmin[0].ins_id);
            fd.append('myfile', profileImage);
            this.authService.doRegistration(fd).subscribe((result: any) => {
                if (result.status) {
                    result.data;
                    this.commanService.showAlert(result.message);
                    this.router.navigate(['/admin/student']);
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
        }
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

    getStudentDetails() {
        let token = {
            token: this.sAdmin[0].usr_token,
            stuid: this.studentId
        }

        this.course.getStudentDetail(token)
            .subscribe((result: any) => {
                this.updateShow = true;
                let crs: any=[];
                if (result.status) {
                if(result.data[0].scmm_type == 0){
                    this.selectedCourse = result.data[0].course;
                    this.regUser.patchValue({crsid:result.data[0].course}); 
                    this.onCourseTypeChange(1) }
                else{
                    this.show=true;
                    this.selectedSeries = result.data[0].course
                    for (var i = 0; i < result.data[0].course.length; ++i) {
                    crs.push({
                        ser_id: result.data[0].course[i].crs_id
                    })
                }this.regUser.patchValue({crsid:crs});
                    this.onCourseTypeChange(0)
                
                }
                    this.regUser.setValue({
                        fname: result.data[0].stu_fname,
                        lname: result.data[0].stu_lname,
                        fathername: result.data[0].stu_fathername,
                        email: result.data[0].stu_email,
                        contactno: result.data[0].stu_contact_no2,
                        username: result.data[0].usr_username,
                        dob: result.data[0].stu_dob,
                        qualification: result.data[0].stu_qualification,
                        password: 'abc@12',
                        crsid: result.data[0].scmm_type == 1 ? crs : result.data[0].course,
                        insid: this.sAdmin[0].ins_name,
                        state: result.data[0].stu_state,
                        country: result.data[0].stu_country,
                        zipcode: result.data[0].stu_zipcode,
                        mobilenumber: result.data[0].stu_contact_no1,
                        address: result.data[0].stu_address,
                        city: result.data[0].stu_city,
                        access: result.data[0].scmm_type == 1? '0' : '1',
                    });
                    
                    this.filteredArry = this.states.filter((value: any) => {
                        return value.country_id === this.regUser.get('country').value
                    });
                    this.regUser.get('username').disable();
                    if (result.data[0].profilePic) {
                        this.myProfileViewObj.displayImage = './services/server/' + result.data[0].profilePic;
                    }
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
    }
    updateStudent(user) {
        debugger
        let studentDetails = this.regUser.value;
        if (studentDetails.username == '' || studentDetails.password == '' || studentDetails.email == '' || studentDetails.fname == '' || studentDetails.lname == '' || studentDetails.fathername == '' || studentDetails.mobilenumber == '' ||
            studentDetails.qualification == '' || studentDetails.dob == '' || studentDetails.city == '' || studentDetails.state == '' || studentDetails.country == '' || studentDetails.zipcode == '') {
            this.commanService.showAlert('Please fill all the details.');
            return false;
        } else {
            let crs: any = [];
            for (var i = 0; i < user.crsid.length; ++i) {
                if (user.crsid[i].crs_id) {
                    crs.push({
                        crsid: user.crsid[i].crs_id
                    })
                }else if (user.crsid[i].ser_id) {
                    crs.push({
                        crsid: user.crsid[i].ser_id
                    })
                } else {
                    crs.push({
                        crsid: user.crsid[i]
                    })
                }
            }

            let profileImage = this.myProfileViewObj.uploadedFile === '' ? 'null' : this.myProfileViewObj.uploadedFile;
            let fd = new FormData();
            fd.append('token', this.sAdmin[0].usr_token);
            fd.append('stuid', this.studentId);
            fd.append('username', studentDetails.username);
            fd.append('email', studentDetails.email);
            fd.append('fname', studentDetails.fname);
            fd.append('lname', studentDetails.lname);
            fd.append('fathername', studentDetails.fathername);
            fd.append('contact1', studentDetails.mobilenumber);
            fd.append('contact2', studentDetails.contactno);
            fd.append('dob', studentDetails.dob);
            fd.append('qualification', studentDetails.qualification);
            fd.append('address', studentDetails.address);
            fd.append('city', studentDetails.city);
            fd.append('state', studentDetails.state);
            fd.append('country', studentDetails.country);
            fd.append('zipcode', studentDetails.zipcode);
            fd.append('insid', this.sAdmin[0].ins_id);
            fd.append('crsid', JSON.stringify(crs));
            fd.append('myfile', profileImage);
            fd.append('type', studentDetails.access == 1 ? '0' : '1');
            if (studentDetails.password != 'abc@12') {
                fd.append('password', studentDetails.password);
            }
            this.authService.updateStudent(fd).subscribe((result: any) => {
                if (result.status) {
                    result.data;
                    this.commanService.showAlert(result.data);
                    this.router.navigate(['/admin/student']);
                } else {
                    this.commanService.checkToken(result);
                }
            }, error => {
                this.commanService.showAlert(this.msg);
            });
        }
    }
    goToDashBoard() {
        this.router.events.subscribe((url: any) => url);
        this.commanService.setData('previousRoute', '/admin/dashbord');
        this.router.navigate(['/admin']);
    }
    filteredArry: Array<Object>;
    onCountryChange(countryId){
        this.filteredArry = this.states.filter((value:any) => {
            return value.country_id === countryId
        });
        let selectedState:any;
        selectedState=this.filteredArry[0];
        this.regUser.patchValue({
            state: selectedState.id
        });
    }
}
