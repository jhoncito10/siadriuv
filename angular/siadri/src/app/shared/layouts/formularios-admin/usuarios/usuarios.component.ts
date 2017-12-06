import { FunuserService } from './funuser.service';
import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  dtTrigger = new Subject();

  user: any;
  key: any;
  constructor(private funcion: FunuserService,private data: ModalService) {
    // tslint:disable-next-line:prefer-const
  }
  ngOnInit() {
      this.funcion.suscribirUser().then(() => {
      this.user = this.funcion.getUser();
      this.dtTrigger.next();
    });


  }

  viewUser(item: any) {
    this.data.changeUser(item);
  }
}