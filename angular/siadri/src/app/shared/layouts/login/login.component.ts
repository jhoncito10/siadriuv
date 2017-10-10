import { error } from 'util';
import { RegistroService } from './../../services/registro.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
  constructor(public login: LoginService, public rs: RegistroService) { }
  ngOnInit() {
  }
/* INICIO SESION */
ingresar(proveedor?: string) {
    if (proveedor === 'google') {
      this.login.login();
    } else {
     return this.login.loginEmail( this.dataAuten.email, this.dataAuten.pass);
}
}
/* REGISTRO USUARIO */
registrar() {
          if (this.dataRes.pass === this.dataRes.passconfirm) {
            this.rs.createUser( this.dataRes.email, this.dataRes.pass).then(() => { console.log('Usuario creado'); });
          } else { console.log(error);
          alert ('No coincide la contrasena');
          }
       }
}
