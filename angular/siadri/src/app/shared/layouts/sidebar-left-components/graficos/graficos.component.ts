import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';
import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {

  constructor(private ad:BuscadorService, private modal:ModalService) { }

  ngOnInit() {
  }


  info1(){
    this.ad.getdataConvenio();
    this.modal.changeConveniosGraficos(this.ad.getConvenio());
    this.modal.changeGrafico('Grafico1');
    this.modal.changePrueba([{name:"",value:0,xlabel:"",ylabel:"",title:""}]);
  }

  info2(){
    this.ad.getConv().subscribe(data=>{
      let arreglo = this.convierteAno(data);
      this.modal.changeConveniosGraficos2(arreglo);
      this.modal.changeGrafico('Grafico2');
      this.modal.changePrueba([{name:"",value:0,xlabel:"",ylabel:"",title:""}]);
    });  
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
