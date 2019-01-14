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
    email: null,
    pass: null
  };
  dataRes = {
    email: null,
    pass: null,
    passconfirm: null
  };

  emailrecuperar = '';

  swalMessage = '';

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
      this._ls.loginEmail(this.dataAuten.email, this.dataAuten.pass).then(() => {
        swal({
          type: 'success',
          title: 'BIENVENID@',
          text: 'Acceso Exitoso',
          showConfirmButton: true,
        });
        this.ruta.navigate(['dash']);
      }).catch(function () {
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
      this.rs.createUser(this.dataRes.email, this.dataRes.pass).then(() => {
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


  recuperar() {
    console.log(this.emailrecuperar);

    if (this.validateEmail(this.emailrecuperar)) {
      swal({
        allowOutsideClick: false,
        title: 'Solicitando ...',
        text: '',
        onOpen: () => {
          swal.showLoading();
        }

      });
      this._ls.recoverPassword(this.emailrecuperar).then(() => {
        swal.close();

        swal({
          type: 'success',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-primary',
          allowOutsideClick: true,
          title: 'Por favor verifique su correo electrónico para completar el proceso de recuperación de contraseña.',
          text: '',
          onClose: () => {
            this.ruta.navigate(['']);
          }

        });

      }).catch(error2 => {
        console.log(error2);
        swal.close();
        swal({
          type: 'error',
          showCloseButton: true,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-danger',
          allowOutsideClick: true,
          title: `${error2.message}`,
          text: '',

        });
      });

    } else {
      swal({
        type: 'error',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        allowOutsideClick: true,
        title: `${this.swalMessage}`,
        text: '',
        onClose: () => {
          this.swalMessage = '';

        }

      });
    }
  }


  validateEmail(email: string): boolean {
    this.swalMessage += this.isEmail(email).msg;

    return this.isEmail(email).state;
  }

  isEmail(email: string) {

    let response: boolean;

    // tslint:disable-next-line:max-line-length
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    response = regexp.test(email);

    console.log(response);
    if (response) {
      return {
        state: response,
        msg: ''
      };
    } else {
      return {
        state: response,
        msg: `¡Correo no válido!
        `
      };
    }

  }
}
