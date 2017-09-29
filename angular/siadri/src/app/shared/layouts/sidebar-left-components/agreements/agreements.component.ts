import { ModalService } from './../../servicio/modalservice';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.css']
})
export class AgreementsComponent implements OnInit {

  message: string;
  constructor(private data: ModalService) { }
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
  }
      enviar (id: any) {
          let valor: string;
         if (id === 'busquedaporpais') {
              valor = 'Convenios por pais';
            } else if (id === 'busquedaporconvenio') {
                  valor = 'Tipo de convenio';
                } else if (id === 'busquedaporprograma') {
                    valor = 'Programa';
                  }
          console.log (id);
        /*   this.data.changeMessage(valor); */
      }

}
