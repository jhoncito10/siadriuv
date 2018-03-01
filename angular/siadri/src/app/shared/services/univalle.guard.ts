import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnivalleGuard implements CanActivate {

  univalle: any;

  user = JSON.parse(localStorage.getItem('usuario'));
  rol = JSON.parse(localStorage.getItem('rol'));

  constructor() {

  }
      canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

          if (this.user) {
            this.univalle = this.user.email.split('@');
            console.log(this.univalle);
            if ((this.univalle[1] === 'correounivalle.edu.co') || (this.rol === 'ADMIN') || (this.rol === "NIVEL3")) {
              return true;
            } else {
              return false;
            }

        } else {
           return false;
        }
      }
}
