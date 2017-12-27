
import { LoginService } from 'app/shared/services/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel3Guard implements CanActivate {

 
  constructor(public ls:LoginService){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this.ls.usuario) {
        if((this.ls.rol == "NIVEL3") || (this.ls.rol == "ADMIN")){
          return true;
        }else{
          return false;
        }
      
    } else {
       return false;
    }
  }
}
