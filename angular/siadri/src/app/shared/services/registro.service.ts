import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import swal from 'sweetalert2';
import * as firebase from 'firebase/app';


@Injectable()
export class RegistroService {
  constructor(public afAuth: AngularFireAuth) { }

  // metodo que se utiliza para la creacion de un nuevo usuario en el sistema
    createUser(email: string, pass: string) {
         // tslint:disable-next-line:prefer-const
          let promise = new Promise((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(
              () => {
                this.afAuth.auth.currentUser.sendEmailVerification();
                swal({
                  type: 'success',
                  title: 'Felicidades',
                  text: 'Registrado exitosamente',
                  showConfirmButton: true,
                });
                resolve();
            }).catch(function(error) {
                console.log(error.message);
                swal({
                  type: 'error',
                  title: 'Error',
                  text: 'ha ocurrido un error en el proceso de Registro, por favor intente de nuevo',
                  showConfirmButton: true,
                });

            });
          });
         return promise;
     }
}
