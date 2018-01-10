import { error } from 'util';
import { Router } from '@angular/router';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { RuleservicesService } from 'app/shared/layouts/formularios-admin/roles/rule.service';


//ESTA CLASE CONTIENE LOS METODOS QUE PERMITEN EL LOGIN Y LOGOUT DE LOS USUARIOS AL SISTEMA
@Injectable()
export class LoginService {
  public usuario: any = null;
  public rol:any = null;

  constructor(public afAuth: AngularFireAuth, public ruta: Router, private rule:RuleservicesService) {
      if (localStorage.getItem('usuario')) {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.rule.getConsultaRol(this.usuario.uid).then(() => {
          this.rule.getAtrRol(this.rule.getRolEsp()).subscribe(data => {
            this.rol = data.$key;
          });
      });
    }
  }

    //LOGIN CON GOOGLE
    login() {
      // tslint:disable-next-line:prefer-const
      let promise = new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(resp => {
          this.usuario = resp.user;
          localStorage.setItem('usuario', JSON.stringify(this.usuario));
          this.rule.getConsultaRol(this.usuario.uid).then(() => {
            this.rule.getAtrRol(this.rule.getRolEsp()).subscribe(data => {
              this.rol = data.$key;
            });
        });
          resolve();
        });
      });
      return promise;
      }

      //LOGIN CON EMAIL Y PASSWORD
      loginEmail(email: string, pass: string) {
            // tslint:disable-next-line:prefer-const
            let promise = new Promise((resolve, reject) => {
              this.afAuth.auth.signInWithEmailAndPassword(email, pass)
              .then(data => {
                alert('Loggeado exitosamente');
                this.usuario = data;
                localStorage.setItem('usuario', JSON.stringify(data));
                this.rule.getConsultaRol(this.usuario.uid).then(() => {
                  this.rule.getAtrRol(this.rule.getRolEsp()).subscribe(data => {
                    this.rol = data.$key;
                  });
              });
                resolve();
              })
              .catch(() => {
                alert('Clave o usuario invalido');
              })
              ;
            });
            return promise;
   }

   //CERRAR SESION EN EL SISTEMA
   logout() {
      localStorage.removeItem('usuario');
      this.usuario = null ;
      this.afAuth.auth.signOut().then(()=>{
        this.ruta.navigate(['login']);
      });
     
      }
  }


