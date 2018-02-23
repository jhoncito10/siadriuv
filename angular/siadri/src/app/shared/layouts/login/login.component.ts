import { error } from 'util';
import { RegistroService } from './../../services/registro.service';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
declare var $: any;
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

  constructor(public _ls: LoginService, public rs: RegistroService, private ruta: Router) { }

  ngOnInit() {
  }

  volver() {
    this.ruta.navigate(['dash']);
  }

/* INICIO SESION */
  ingresar(proveedor?: string) {
    if (proveedor === 'google') {
      this._ls.login().then(() => {
        alert('acceso exitoso');
        this.ruta.navigate(['dash']);
      });

    } else {
      this._ls.loginEmail( this.dataAuten.email, this.dataAuten.pass).then(() => {
        this.ruta.navigate(['dash']);
      }).catch(function() {
        alert('no fue posible iniciar Sesion debido a que no ha verificado su cuenta por medio del email');
      });

    }
  }


/* REGISTRO USUARIO */
  registrar() {
      if (this.dataRes.pass === this.dataRes.passconfirm) {
        this.rs.createUser( this.dataRes.email, this.dataRes.pass).then(() => {
          alert('por favor verificar el correo electronico para terminar su proceso de registro');
          this.ruta.navigate(['dash']);
        });
      } else {
        swal({type: 'error', text: 'No coinciden las contrasenas', title: 'dfdfdf'});
       //alert ('No coinciden las contrasenas');
      }
  }
}
