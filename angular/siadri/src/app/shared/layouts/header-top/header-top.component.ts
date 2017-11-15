import { LoginComponent } from './../login/login.component';
import { LoginService } from './../../services/login.service';
import { error } from 'util';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent {
  session = false;
  constructor(private ls: LoginService ) {
    if (this.ls.usuario) {
      this.session = true;
    }
  }
  logout () {
   this.ls.logout();
  }
}
