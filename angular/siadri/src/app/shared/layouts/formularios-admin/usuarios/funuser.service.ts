import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class FunuserService {

  usuarios:any;

  constructor(private ad:AngularFireDatabase) { }

  suscribirUser() {
    // tslint:disable-next-line:prefer-const
    let prom = new Promise((resolve, reject) => {

      this.usuarios = null;
      this.getUsersBD().subscribe(
        user => {
              this.usuarios = user;
              resolve();
        });
    });
    return prom;
   }

  getUsersBD() {
   return this.ad.list('/usuarios');
  }
  getUser() {
    return this.usuarios;
  }
  editarUser(user: any, key: string) {
    this.ad.app.database().ref('/usuarios/' + key).set(user);
  }
  creaUser(user: any) {
    return this.ad.app.database().ref('/usuarios').push(user);
  }
  estadoUser(key: string, value:string) {
    this.ad.app.database().ref('/usuarios/' + key + '/estado').set(value);
  }

}
