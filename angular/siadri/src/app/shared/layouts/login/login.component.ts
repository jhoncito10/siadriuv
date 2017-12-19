import { error } from 'util';
import { RegistroService } from './../../services/registro.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  dataAuten = {
    email : null,
    pass: null
  };
  dataRes = {
    email : null,
    pass: null,
    passconfirm: null
  };
  
  constructor(public _ls: LoginService, public rs: RegistroService,private ruta: Router) { }

  ngOnInit() {
  }
/* INICIO SESION */
  ingresar(proveedor?: string) {
    if (proveedor === 'google') {

      this._ls.login().then(() => {
        this.ruta.navigate(['dash']);
    });

    } else {

      this._ls.loginEmail( this.dataAuten.email, this.dataAuten.pass).then(() => {
        this.ruta.navigate(['dash']);
      });

    }
  }
/* REGISTRO USUARIO */
  registrar() {
      if (this.dataRes.pass === this.dataRes.passconfirm) {
        this.rs.createUser( this.dataRes.email, this.dataRes.pass).then(() => {
            this._ls.loginEmail( this.dataRes.email, this.dataRes.pass).then(() => {
            this.ruta.navigate(['dash']);
          });
        });
      } else {
      alert ('No coincide la contrasena');
      }
  }
}
