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
    this.ad.getConv().subscribe(data=>{
      let arreglo = this.convierteAno(data);
      this.modal.changeConveniosGraficos(arreglo);
      this.modal.changeGrafico('Grafico2');
      this.modal.changePrueba([{name:"",value:0,xlabel:"",ylabel:"",title:""}]);
    });  
  }
  ngOnInit() {
  }


  convierteAno(arr:any){
    let convTemp = [];
    for(let j=0;j<arr.length;j++){
      if(arr[j].ano_de_firma != "No disponible"){
            let aux = arr[j].ano_de_firma.split('/');
            arr[j].ano_de_firma = aux[2]; 
            convTemp.push(arr[j]);
      } 
    }

    return convTemp;
  }

}
