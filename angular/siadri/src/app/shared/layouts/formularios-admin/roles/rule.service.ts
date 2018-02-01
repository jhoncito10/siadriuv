import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class RuleservicesService {

  data: any;

  roles: any;
  nodes: any;
  rolEsp: any;

  constructor(private ad:AngularFireDatabase,private _http: Http) {
    this.roles = null;
    if(localStorage.getItem('usuario')) {
      console.log("funcion service");
     this.suscribirRol();
    }
  }
  suscribirRol() {
    // tslint:disable-next-line:prefer-const
    let prom = new Promise((resolve, reject) => {

      this.roles = null;
      this.getRolesBD().subscribe(
        rol => {
              this.roles = rol;
              resolve();
        });
    });
    return prom;
   }
  getRolesBD() {
   return this.ad.list('/roles');
  }
  getRoles() {
    return this.roles;
  }

  creaRol(rolenom: string,role: any) {
    return this.ad.app.database().ref('/roles/' + rolenom).set(role);
  }
  eliminaRol(key: string) {
    this.ad.app.database().ref('roles/' + key).remove();

  }

  getConsultaRol(key: string) {
    // tslint:disable-next-line:prefer-const
    let prom = new Promise((resolve, reject) => {

            this.getRolEspBD(key).subscribe(
              rol => {
                this.rolEsp = rol.$value;
                resolve();
              });
          });
          return prom;
  }

  getRolEspBD(key: string) {
   return this.ad.object('/usuarios/' + key + '/roles');
  }

   getAtrRol(key: string) {
    return this.ad.object('/roles/' + key);
   }

   getRolEsp() {
    return this.rolEsp;
   }

  getNodes() {
    return  this.nodes = [ 'convenios', 'roles','solicitudes', 'borradores', 'usuarios'];
  }





  // inform = '';
  // url = 'https://univallesglab.firebaseio.com/.settings/rules.json?auth=Dugs4u5IqBUFtTfuRdY7lBIRcc35BYB9L7j3Q311';
  // json: any;
  // tablas = [];

  // auxiliar: string;

  // LeerReglas() {
  //   // tslint:disable-next-line:prefer-const
  //   let promise = new Promise((resolve, reject) => {
  //     this.data = null;
  //         this._http.get(this.url)
  //         .subscribe(data => {
  //           this.data = data.json();

  //           // tslint:disable-next-line:forin
  //           for (const e in this.data.rules ) {
  //             this.tablas.push(e.valueOf());
  //           }

  //           console.log(this.tablas);
  //           resolve();
  //         });

  //   });
  //   return promise;
  // }


  // preparaRules(role: any, key: string) {

  //   this.inform = ' || (root.child(\'usuarios\').child(auth.uid).child(\'roles\').val() == \'' + key + '\')';

  //   const promise = new Promise((resolve, reject) => {
  //    this.LeerReglas().then(() => {

  //        for (let index = 0; index < this.tablas.length; index++) {
  //         this.auxiliar = '';
  //         this.auxiliar = this.data.rules[this.tablas[index]]['.read'];

  //           if (role.permisos[this.tablas[index]].lectura === true) {
  //             if (this.auxiliar.search(key) === -1) {
  //               this.data.rules[this.tablas[index]]['.read'] += this.inform;
  //             }

  //           }else {
  //             if (this.auxiliar.search(key) !== -1) {
  //               this.data.rules[this.tablas[index]]['.read'] = this.auxiliar.replace(this.inform, '');
  //             }

  //           }

  //           this.auxiliar = this.data.rules[this.tablas[index]]['.write'];
  //           if (role.permisos[this.tablas[index]].escritura === true) {

  //             if (this.auxiliar.search(key) === -1) {
  //               this.data.rules[this.tablas[index]]['.write'] += this.inform;
  //             }
  //           }else {
  //             if (this.auxiliar.search(key) !== -1) {
  //               this.data.rules[this.tablas[index]]['.write'] = this.auxiliar.replace(this.inform, '');
  //             }

  //           }
  //       }
  //       console.log(this.data);
  //       resolve();
  //      });
  //   });
  //   return promise;
  // }

  // EnvioReglas() {
  //   // tslint:disable-next-line:prefer-const
  //   let promise = new Promise((resolve, reject) => {
  //     console.log(this.data);
  //     this.json = JSON.stringify(this.data);
  //     const header = new Headers();
  //     header.append('Content-Type', 'application/raw');
  //     this._http.put(this.url, this.json, {
  //       headers: header
  //     }).subscribe(data => {
  //       console.log(data);
  //       resolve();
  //     });
  //     console.log(this.json);
  //     resolve();
  //   });
  //   return promise;
  // }

  // eliminaReglas(role: any, key: string) {

  //       const promise = new Promise((resolve, reject) => {
  //       this.inform = ' || (root.child(\'usuarios\').child(auth.uid).child(\'roles\').val() == \'' + key + '\')';
  //       for (let index = 0; index < this.tablas.length; index++) {
  //         this.auxiliar = '';

  //         if (role.permisos[this.tablas[index]].lectura === true) {
  //           this.auxiliar = this.data.rules[this.tablas[index]]['.read'];

  //           this.data.rules[this.tablas[index]]['.read'] = this.auxiliar.replace(this.inform, '');

  //         }
  //         if (role.permisos[this.tablas[index]].escritura === true) {
  //           this.auxiliar = this.data.rules[this.tablas[index]]['.write'];
  //           this.data.rules[this.tablas[index]]['.write'] = this.auxiliar.replace(this.inform, '');
  //         }
  //       }
  //           console.log(this.data);
  //           resolve();

  //       });
  //       return promise;
  // }
}
