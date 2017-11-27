import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})
export class AgreementsComponent implements OnInit {

  constructor(private data:ModalService, private ruta: Router) { }

  ngOnInit() {
  }

  enviar (id: any) {
    this.ruta.navigate(['/dash/mapa']);
    let valor: string;
    if (id === 'menu-convenios-pais') {
      valor = 'Pais';
    } else if (id === 'menu-busqueda-por-tipo') {
      valor = 'Tipo Convenio';
    } else if (id === 'menu-busqueda-por-academia') {
      valor = 'Academia';
    }
    this.data.changeMessage(valor);

  }
}
