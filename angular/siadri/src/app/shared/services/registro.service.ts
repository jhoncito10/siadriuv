import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class RegistroService {
  constructor(public afAuth: AngularFireAuth) { }
    createUser(email: string, pass: string) {
         // tslint:disable-next-line:prefer-const
          let promise = new Promise((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, pass).then(
              () => {
                console.log('Usuario creado');
                alert('Registrado exitosamente');
                resolve();
            }).catch(function(error){
                console.log(error.message);
                alert('Clave o usuario invalido')
            });
          });
         return promise;
     }
}
