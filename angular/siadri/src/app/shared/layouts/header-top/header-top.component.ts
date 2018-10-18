import { BuscadorService } from './../modal-popup/buscador.service';
import { ModalService } from 'app/shared/modal.service';
import { LoginComponent } from './../../../modulos/auth/login/login.component';
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
  notificaciones:any;

  user = JSON.parse(localStorage.getItem('usuario'));

  constructor(private ls: LoginService, private modal:ModalService, private ad:BuscadorService) {
    if (this.ls.usuario) {
      this.session = true;
    }

  }
  logout () {
   this.ls.logout();
  }

  ngOnInit() {
    this.modal.currentNotificacion.subscribe(data=>{
      this.notificaciones = data;
    });
  }


  info(item:any){
    this.ad.setNotificacion(this.user.uid,item.$key).then(()=>{
      this.ad.getNotificaciones(this.user.uid).subscribe(data=>{
        this.modal.changeNotifcacion(data);
      });
    });
    
  }

}
