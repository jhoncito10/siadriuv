import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnivalleGuard implements CanActivate {

  univalle:any;

  constructor(public ls:LoginService){
    
  }
      canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

          if (this.ls.usuario) {
            this.univalle = this.ls.usuario.email.split("@");
            console.log(this.univalle);
            if((this.univalle[1] == "correounivalle.edu.co") || (this.ls.rol == "ADMIN")){
              return true;
            }else{
              return false;
            }
          
        } else {
           return false;
        }
      }
}
