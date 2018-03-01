
import { LoginService } from 'app/shared/services/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Nivel3Guard implements CanActivate {

  user = JSON.parse(localStorage.getItem('usuario'));
  rol = JSON.parse(localStorage.getItem('rol'));


  constructor() {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this.user) {
        if ((this.rol === 'NIVEL3') || (this.rol === 'ADMIN')){
          return true;
        } else {
          return false;
        }

    } else {
       return false;
    }
  }
}
