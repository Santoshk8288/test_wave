import {Injectable  } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms';

@Injectable()

export class Validator
{
  //Email validation
	validateEmail(c: FormControl){
  let EMAIL_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  return EMAIL_REGEXP.test(c.value) ? null : {
    validateEmail: {
        valid: false
      }
    };
  }

  //Minimum eight characters, starting with alphabets and numbers and at least one letter, one number and one special character:
  validatePass(c: FormControl) {
   let PASS_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/
  	return PASS_REGEXP.test(c.value)  ? null : {
      validatePass: {
        valid: false
      }
    }
  }
	
  // 15 digits no
  validateContact(c: FormControl) {
		
  	let CONTACT_REGEXP=/[+-]?[0-9]{10,15}$/;
    return CONTACT_REGEXP.test(c.value)  ? null : {
      validatePass: {
        valid: false
      }
    }
  }
  /*My AlternateContact validation*/
  validateAlternateContact(c: FormControl) {
    
    let CONTACT_REGEXP=/[+-]?[0-9]{10,15}$/;
    if(c.value !=''){
      return CONTACT_REGEXP.test(c.value)  ? null : {
        validatePass: {
          valid: false
        }
      }
    }
  }
  /*End of AlternateContact validation*/
  // 15 digits no
  validateWebsite(c: FormControl) {
    // var WEBSITE_REGEXP=/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@+.)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
   let WEBSITE_REGEXP= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if(c.value !=''){
      return WEBSITE_REGEXP.test(c.value)  ? null : {
        validateWebsite: {
          valid: false
        }
      }
    }
  }

  // Validate name 
  validateName(c: FormControl){ 
	if(c.value ){
      let name= c.value.replace(/^\s+|\s+$/g, ''); 
    }
     
    
    let REG_NAME=/^[a-zA-Z\s-]{4,}$/ ;
    return (REG_NAME.test(name))  ? null : {
      validateName: {
        valid: false
      }
    }
  }
   validateZipcode(c:FormControl){
   
    let REG_NAME= /^\d{6}$/;
    return (REG_NAME.test(c.value))  ? null : {
       validateZipcode: {
        valid: false
      }
    }
   }
    validateInstituteName(c: FormControl) {
  let CONTACT_REGEXP=  /^[a-zA-Z]+[a-zA-Z0-9.]{2,}$/;
    return CONTACT_REGEXP.test(c.value)  ? null : {
      validateInstituteName: {
        valid: false
      }
    }
  }

  // password and re-type password are same validation 
	validateConfirmPass(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
    let password = group.controls[passwordKey],
    passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({notEquivalent: true})
    }
    else {
      return passwordConfirmation.setErrors(null);
      }
    }
  }
}
	
