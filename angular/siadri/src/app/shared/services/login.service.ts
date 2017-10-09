import { Router } from '@angular/router';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {
  public usuario: any = null;

  constructor(public afAuth: AngularFireAuth, public ruta: Router) {
      if (localStorage.getItem('usuario')) {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
      }else {
        this.ruta.navigate(['']);
      }
    }
    login() {
      // tslint:disable-next-line:prefer-const
      let promise = new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(resp => {
          console.log (resp);
          this.usuario = resp.user;
          console.log(this.usuario.uid);
          localStorage.setItem('usuario', JSON.stringify(this.usuario));
           this.ruta.navigate(['/dash']);
          resolve();
        });
      });
      }
      loginEmail(email: string, pass: string) {
            // tslint:disable-next-line:prefer-const
            let promise = new Promise((resolve, reject) => {
              this.afAuth.auth.signInWithEmailAndPassword(email, pass)
              .then(data => {
                console.log('login');
                this.usuario = data;
                localStorage.setItem('usuario', JSON.stringify(data));
                this.ruta.navigate(['/dash']);
                resolve();
              });
            });
   }
    logout() {
      localStorage.removeItem('usuario');
      this.usuario = null ;
      this.afAuth.auth.signOut();
      this.ruta.navigate(['login']);
      }
  }


