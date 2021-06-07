import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppURL } from '../app.url';
import { AuthURL } from '../authentication/authentication.url';
import { AuthenService } from '../services/authen.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticationGuard implements CanActivate {
  constructor(
    private authen: AuthenService,
    private router: Router
) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authen.getAuthenticated()) {
        this.router.navigate(['/', AppURL.Authen, AuthURL.Profile]);
        return false;
    }
    return true;
  }
  
}
