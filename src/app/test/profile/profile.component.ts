import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../../core/services/auth.service';
import {CommanService} from '../../core/services/comman.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Validator } from '../../core/services/validation.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']

})
export class ProfileComponent implements OnInit {
	student: any = {};
	countries: object;
	states: Array < object > ;
	loginUserDetail: object;
	params;
	private msg = 'Something Went wrong';
	myProfileViewObj = {
		displayImage: "",
		uploadedFile: ""
	}
	course: any = [];
	loading: boolean = true;
	studentId;
	userprofile: FormGroup;
	constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private location: Location,
		private commanService: CommanService, private validator: Validator) {}
	private country: string = "assets/json/country.json";
	ngOnInit() {
		this.loginUserDetail = this.commanService.getData('loginUser');
		this.studentId = this.loginUserDetail[0].stu_id
			this.params = {
			token: this.loginUserDetail[0].usr_token,
			stuid: this.loginUserDetail[0].stu_id,
		}
		this.commanService.getCountryJson().subscribe((res) => {
			this.countries = res.countries;
		});
		this.commanService.getStateJson().subscribe((res) => {
			this.states = res.states;
			this.getStudentDetail();
		});
		this.userprofile = this.formBuilder.group({
				fname: ['', [Validators.required, this.validator.validateName]],
				lname: ['', [Validators.required, this.validator.validateName]],
				fathername: ['', [Validators.required, this.validator.validateName]],
				email: ['', [Validators.required, this.validator.validateEmail]],
				contactno: ['', [this.validator.validateAlternateContact]],
				dob: ['', [Validators.required]],
				qualification: ['', [Validators.required]],
				address: ['', [Validators.required]],
				city: ['', [Validators.required]],
				state: ['', [Validators.required]],
				country: ['', [Validators.required]],
				zipcode: ['', [Validators.required, this.validator.validateZipcode]],
				mobilenumber: ['', [Validators.required, this.validator.validateContact]],
			});

	}
	getStudentDetail() {
		this.authService.getStudentDetails(this.params).subscribe((result: any) => {
			if (result.status) {
				let studetnDetails = result.data[0];
				this.course = result.data[0].course
					this.userprofile.setValue({
						fname: result.data[0].stu_fname,
						lname: result.data[0].stu_lname,
						fathername: result.data[0].stu_fathername,
						email: result.data[0].stu_email,
						contactno: result.data[0].stu_contact_no2,
						dob: result.data[0].stu_dob,
						qualification: result.data[0].stu_qualification,
						state: result.data[0].stu_state,
						country: result.data[0].stu_country,
						zipcode: result.data[0].stu_zipcode,
						mobilenumber: result.data[0].stu_contact_no1,
						address: result.data[0].stu_address,
						city: result.data[0].stu_city,
					});
				this.filteredArry = this.states.filter((value: any) => {
						return value.country_id === this.userprofile.get('country').value
					});
				if (result.data[0].profilePic) {
					this.myProfileViewObj.displayImage = './services/server/' + result.data[0].profilePic;
				}
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
		});
	}

	//back to exam
	goBack() {
		this.router.navigate(['/Dashboard']);
	}
	upDateStudent() {
		let curId = [];
		for (let coursCheck = 0; coursCheck < this.course.length; coursCheck++) {
			curId.push({
				'crsid': this.course[coursCheck].crs_id
			})
		}
		let studentDetails = this.userprofile.value;
		let profileImage = this.myProfileViewObj.uploadedFile === '' ? 'null' : this.myProfileViewObj.uploadedFile;
		let fd = new FormData();
		fd.append('token', this.loginUserDetail[0].usr_token);
		fd.append('stuid', this.loginUserDetail[0].stu_id);
		fd.append('fname', studentDetails.fname);
		fd.append('lname', studentDetails.lname);
		fd.append('fathername', studentDetails.fathername);
		fd.append('email', studentDetails.email);
		fd.append('contact1', studentDetails.mobilenumber);
		fd.append('contact2', studentDetails.contactno);
		fd.append('dob', studentDetails.dob);
		fd.append('qualification', studentDetails.qualification);
		fd.append('address', studentDetails.address);
		fd.append('city', studentDetails.city);
		fd.append('state', studentDetails.state);
		fd.append('country', studentDetails.country);
		fd.append('zipcode', studentDetails.zipcode);
		fd.append('insid', this.loginUserDetail[0].stu_insid);
		fd.append('crsid', JSON.stringify(curId));
		fd.append('type',this.loginUserDetail[0].scmm_type );
		fd.append('myfile', profileImage);
		this.authService.doModifyStudent(fd).subscribe((result: any) => {
			if (result.status) {
				result.data;
				let msg = 'Updated successfully';
				this.commanService.showAlert(msg);
				this.location.back();
			} else {
				this.commanService.checkToken(result);
			}
		}, error => {
			this.commanService.showAlert(this.msg);
			console.log(error);
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
	filteredArry: Array < Object > ;
	onCountryChange(countryId) {
		this.filteredArry = this.states.filter((value: any) => {
				return value.country_id === countryId
			});
		let selectedState: any;
		selectedState = this.filteredArry[0]
			this.userprofile.patchValue({
				state: selectedState.id
			});
	}
}