import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})
export class AgreementsComponent implements OnInit {

  constructor(private data: ModalService) { }

  ngOnInit() {
  }

  enviar(id: any) {
    let valor: string;
    if (id === 'menu-busqueda-por-tipo') {
      valor = 'Tipo Convenio';
    } else if (id === 'menu-busqueda-por-academia') {
      valor = 'Academia';
    }
    this.data.changeMessage(valor);

  }
}
