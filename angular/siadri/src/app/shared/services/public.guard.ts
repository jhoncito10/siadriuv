import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(public ls: LoginService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.ls.usuario) {
      return true;
    } else {
      this.router.navigate(['dashin']);
      return false;
    }
  }
}
