import { error } from 'util';
import { RegistroService } from './../../../shared/services/registro.service';
import { LoginService } from './../../../shared/services/login.service';
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

  constructor(public _ls: LoginService, public rs: RegistroService, private ruta: Router) {
    if (localStorage.getItem('usuario')) {
      this.ruta.navigate(['dash']);
    }
   }

  ngOnInit() {
  }

  volver() {
    this.ruta.navigate(['dash']);
  }

/* INICIO SESION */
  ingresar(proveedor?: string) {
    if (proveedor === 'google') {
      this._ls.login().then(() => {
        swal({
          type: 'success',
          title: 'BIENVENID@',
          text: 'Acceso Exitoso',
          showConfirmButton: true
        });
        this.ruta.navigate(['dash']);
      });

    } else {
      this._ls.loginEmail( this.dataAuten.email, this.dataAuten.pass).then(() => {
        swal({
          type: 'success',
          title: 'BIENVENID@',
          text: 'Acceso Exitoso',
          showConfirmButton: true,
        });
        this.ruta.navigate(['dash']);
      }).catch(function() {
        swal({
          type: 'error',
          title: 'Error',
          text: 'no fue posible iniciar Sesion debido a que no ha verificado su cuenta por medio del email',
          showConfirmButton: true,
        });
      });

    }
  }


/* REGISTRO USUARIO */
  registrar() {
      if (this.dataRes.pass === this.dataRes.passconfirm) {
        this.rs.createUser( this.dataRes.email, this.dataRes.pass).then(() => {
          swal({
            type: 'warning',
            title: 'Por favor verificar el correo electronico para terminar su proceso de registro',
            text: '',
            showConfirmButton: true,
          });
          this.ruta.navigate(['dash']);
        });
      } else {
       // swal({type: 'error', text: 'No coinciden las contrasenas', title: 'dfdfdf'});
       swal({
        type: 'error',
        title: 'las contraseñas no coinciden',
        text: ' ',
        showConfirmButton: true,

      });
      }
  }
}
