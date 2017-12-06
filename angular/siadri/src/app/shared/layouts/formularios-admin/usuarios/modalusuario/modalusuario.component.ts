import { RuleservicesService } from 'app/shared/layouts/formularios-admin/roles/rule.service';
import { FunuserService } from './../funuser.service';
import { ModalService } from './../../../../modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modalusuario',
  templateUrl: './modalusuario.component.html',
  styleUrls: ['./modalusuario.component.css']
})
export class ModalusuarioComponent implements OnInit {

  user: any;
  roles: any;
  constructor(private data: ModalService,
              private funtion: RuleservicesService,
              private funcionUs: FunuserService) {
    this.data.currentUser.subscribe(user => {
      this.user = user;
    });
    if(localStorage.getItem('usuario')){
      this.funtion.suscribirRol().then(() => {
          this.roles = this.funtion.getRoles();
      });
    }
   }

  ngOnInit() {
  }

  editaUser(){
    this.funcionUs.editarUser(this.user, this.user.$key);
  }

}
