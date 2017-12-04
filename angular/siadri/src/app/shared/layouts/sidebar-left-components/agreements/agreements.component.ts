import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})

//ESTE COMPONENTE ES EL QUE PERMITE HACER LAS BUSQUEDAS DE LA PARTE PUBLICA
export class AgreementsComponent implements OnInit {

  constructor(private data:ModalService, private ruta: Router) { }

  ngOnInit() {
  }

  //METODO QUE CAMBIA EL MENSAJE MOSTRADO EN EL MODAL, USANDO LA VARIABLE OBSERVABLE QUE SE ENCUENTRA EN MODALSERVICE

  enviar (id: any) {
    
    this.ruta.navigate(['/dash/mapa']);
    let valor: string;
    if (id == 'menu-pais') {
      valor = 'Pais';
    } else if (id == 'menu-tipo') {
      valor = 'Tipo Convenio';
    } else if (id == 'menu-academia') {
      valor = 'Academia';
    }
    
    this.data.changeMessage(valor);

  }
}
