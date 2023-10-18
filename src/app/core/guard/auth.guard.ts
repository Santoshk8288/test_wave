import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {CommanService} from "../services/comman.service";

@Injectable()
export class AuthGuard implements CanActivate {
 routeUrl;
  constructor(private router: Router, private authService: AuthService, private commonService:CommanService) {
  router.events.subscribe((url: any) => url);
    this.routeUrl = router.url;
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

  if (this.authService.isLogin()) {
        // logged in so return true
        return true;
    }
    this.router.navigate(['/Login']);
    return false;


    // not logged in so redirect to login page with the return url and return false
    
      
  }
  
}
