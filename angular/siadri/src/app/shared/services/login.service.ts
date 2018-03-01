import { error } from 'util';
import { Router } from '@angular/router';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { RuleservicesService } from 'app/shared/layouts/formularios-admin/roles/rule.service';
import swal from 'sweetalert2';
declare var $: any;

// ESTA CLASE CONTIENE LOS METODOS QUE PERMITEN EL LOGIN Y LOGOUT DE LOS USUARIOS AL SISTEMA
@Injectable()
export class LoginService {
  public usuario: any = null;
  public rol: any = null;

  constructor(public afAuth: AngularFireAuth, public ruta: Router, private rule: RuleservicesService) {
      if (localStorage.getItem('usuario')) {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.obtenerRol(this.usuario).then(() => {
          localStorage.setItem('rol', JSON.stringify(this.rol));
        });
    }
  }

    // LOGIN CON GOOGLE
    login() {
      // tslint:disable-next-line:prefer-const
      let promise = new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(resp => {
          this.usuario = resp.user;
          this.obtenerRol(this.usuario).then(() => {

            resolve();
          }).catch(function() {
            swal({
              type: 'error',
              title: 'Error',
              text: 'error, intente de nuevo por favor',
              showConfirmButton: true,
            });
          });

        }).catch(function() {
          swal({
            type: 'error',
            title: 'Error',
            text: 'ocurrio un error intentando acceder, por favor intente de nuevo',
            showConfirmButton: true,
          });
        });
      });
      return promise;
      }

      obtenerRol(user) {
        const promise = new Promise((resolve, reject) => {
          const instancia = this;
          localStorage.setItem('usuario', JSON.stringify(user));
          this.rule.getConsultaRol(user.uid).then(() => {
            this.rule.getAtrRol(this.rule.getRolEsp()).subscribe(datarol => {
              console.log(datarol.$key);
              this.rol = datarol.$key;
              if (this.rol == null) {
                this.obtenerRol(user);
              } else {
                console.log(this.rol);
                resolve();
              }
            });
          }).catch(function() {
            instancia.obtenerRol(user);
          });
        });
        return promise;
      }

      // LOGIN CON EMAIL Y PASSWORD
      loginEmail(email: string, pass: string) {
            // tslint:disable-next-line:prefer-const
            let promise = new Promise((resolve, reject) => {
              this.afAuth.auth.signInWithEmailAndPassword(email, pass)
              .then(data => {
                this.usuario = data;
                if (this.usuario.emailVerified) {
                 this.obtenerRol(data);
                  resolve();
                } else {
                  reject();
                }
              })
              .catch(() => {
                swal({
                  type: 'error',
                  title: 'Error',
                  text: 'Clave o Usuario invalido',
                  showConfirmButton: true,
                });
              })
              ;
            });
            return promise;
    }

   // CERRAR SESION EN EL SISTEMA
   logout() {
      localStorage.removeItem('usuario');
      this.usuario = null ;
      this.afAuth.auth.signOut().then(() => {
        this.ruta.navigate(['login']);
      });

      }
  }


