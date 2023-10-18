import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../core/services/auth.service';
import {CommanService} from '../core/services/comman.service';
import { Validator } from '../core/services/validation.service';
@Component({
  selector: 'app-institute-registration',
  templateUrl: './institute-registration.component.html',
  styleUrls: ['./institute-registration.component.scss'],
  providers: [Validator]
})
export class InstituteRegistrationComponent implements OnInit {
	//institute: any = {};
	params:any={};
	countries;
	states;
	myProfileViewObj={
	    displayImage:"",
	    uploadedFile:""
	}
	userNameCheck;
	loading;
  private msg = 'Something Went wrong';
  regUser: FormGroup;
  constructor(private formBuilder: FormBuilder,private router: Router,
    private authService : AuthService,
    private commanService : CommanService,private validator:Validator) { }

	ngOnInit() {
    this.commanService.getCountryJson().subscribe((res)=>{
      this.countries = res.countries;  
    });
    this.commanService.getStateJson().subscribe((res)=>{
      this.states = res.states;    
    });
		
    this.regUser = this.formBuilder.group({
      fname : ['',[Validators.required,Validators.maxLength(30)]],
      email: ['', [Validators.required,this.validator.validateEmail]],
      contactno : ['',[Validators.required,this.validator.validateContact]],
      username:['',[Validators.required,
        Validators.minLength(6)]],
      password: ['', [Validators.required,this.validator.validatePass]],
      website:['', [this.validator.validateWebsite]],
      address:['', [Validators.required]],
      city:['', [Validators.required]],
      state:['', [Validators.required]],
      country:['', [Validators.required]],
      zipcode:['', [Validators.required,this.validator.validateZipcode]],
      registration:['', ],
    });
	}
  //check userName avl or not
  focusOutUserNameFunction(username){
    if(!username){
      return false;
    }
    this.params = {
      username : username
    }
    this.authService.verifyUserName(this.params).subscribe((result: any)=> { 
      if(result.status){
        this.userNameCheck = false;
        result.data;
      }else{
        this.userNameCheck = true;
        this.commanService.showAlert(result.message);
      }
    },error => {
      this.commanService.showAlert(this.msg);
      console.log(error);
    });
  }

     //call institute registration Api
	register(){
   let instituteDetails = this.regUser.value;
    if (instituteDetails.username=='' || instituteDetails.password==''||instituteDetails.email==''||instituteDetails.fname==''||instituteDetails.contactno==''||
      instituteDetails.address==''||instituteDetails.city==''||instituteDetails.state==''||instituteDetails.country==''||instituteDetails.zipcode=='') {
    this.commanService.showAlert('Please fill all the details.');
    } else { 
  		let profileImage = this.myProfileViewObj.uploadedFile === '' ? 'null' : this.myProfileViewObj.uploadedFile;
  		//let instituteDetails = this.regUser.value;
  		let fd = new FormData();
  		fd.append('username', instituteDetails.username);
  		fd.append('password', instituteDetails.password);
  		fd.append('name', instituteDetails.fname);
  		fd.append('email', instituteDetails.email);
  		fd.append('contact', instituteDetails.contactno);
  		fd.append('web', instituteDetails.website);
  		fd.append('address', instituteDetails.address);
  		fd.append('city', instituteDetails.city);
  		fd.append('state', instituteDetails.state);
  		fd.append('country', instituteDetails.country);
  		fd.append('zipcode', instituteDetails.zipcode);
  		fd.append('registration', instituteDetails.registration);
  		fd.append('myfile', profileImage);
      console.log(fd);
  	  //	this.authService.doInstituteRegistration(fd).subscribe((result: any)=> { 
      this.authService.doInstituteRegistration(fd).subscribe((result: any)=> { 
    		if(result.status){
    			result.data;
          this.commanService.showAlert(result.message);
    			this.router.navigate(['/Login']);
    		}else{
          this.commanService.checkToken(result);
    		}
  		},error => {
        this.commanService.showAlert(this.msg);
  			console.log(error);
  		});
    }
	}
  goBack(){
  	this.router.navigate(['/Login']);
  }
  //File select and show
	fileChange(event){
		if(event && event.target && event.target.files && event.target.files.length){
			this.myProfileViewObj.uploadedFile = event.target.files[0];
			var reader = new FileReader();
			reader.onload = (e: any)=>{
			this.myProfileViewObj.displayImage = e.target.result;
			};
			reader.readAsDataURL(event.target.files[0]);
		}
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
