import { ModalService } from './../../modal.service';
import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dash-nivel3',
  templateUrl: './dash-nivel3.component.html',
  styleUrls: ['./dash-nivel3.component.css']
})
export class DashNivel3Component implements OnInit {

 

  constructor(private ad:BuscadorService, private modal:ModalService) {
    this.ad.getdataConvenio();
    this.modal.changeConveniosGraficos(this.ad.getConvenio());

  }

  ngOnInit() {
   
  }



}
