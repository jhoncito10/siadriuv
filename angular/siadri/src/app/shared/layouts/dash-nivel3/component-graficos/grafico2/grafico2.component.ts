import { ModalService } from './../../../../modal.service';
import { Component, OnInit } from '@angular/core';
import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';

@Component({
  selector: 'app-grafico2',
  templateUrl: './grafico2.component.html',
  styleUrls: ['./grafico2.component.css']
})
export class Grafico2Component implements OnInit {

  constructor(private ad:BuscadorService, private modal:ModalService) { 
 
  }

  ngOnInit() {
  }


 

}
