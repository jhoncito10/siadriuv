import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/modal.service';

@Component({
  selector: 'app-grafico1',
  templateUrl: './grafico1.component.html',
  styleUrls: ['./grafico1.component.css']
})
export class Grafico1Component implements OnInit {

  constructor(private ad:BuscadorService, private modal:ModalService) { 
    this.ad.getdataConvenio();
    this.modal.changeConveniosGraficos(this.ad.getConvenio());
  }

  ngOnInit() {
  }

}
