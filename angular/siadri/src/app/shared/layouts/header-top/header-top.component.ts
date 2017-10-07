import { LoginService } from './../../services/login.service';
import { error } from 'util';

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent {

  constructor(private acceso: LoginService) {

  }
  login() {
    this.acceso.login()
    .then((data) => {
      console.log(data);
      alert('Acceso');
    })
    .catch((error) => {
      console.log(error);
      alert('Error, Verifique datos');
    })
  }

}
