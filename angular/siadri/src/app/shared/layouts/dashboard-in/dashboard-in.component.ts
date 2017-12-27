import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/modal.service';

@Component({
  selector: 'app-dashboard-in',
  templateUrl: './dashboard-in.component.html',
  styleUrls: ['./dashboard-in.component.css']
})
export class DashboardInComponent implements OnInit {

  user:any;

  constructor(private ad:BuscadorService ,private modal:ModalService) { 
    
    if(JSON.parse(localStorage.getItem('usuario'))){

      this.user = JSON.parse(localStorage.getItem('usuario'));
      this.ad.getNotificaciones(this.user.uid).subscribe(data=>{
        this.modal.changeNotifcacion(data);
      });

    }
    

  }

  ngOnInit() {
  }

}
