import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/modal.service';

@Component({
  selector: 'app-barravertical',
  templateUrl: './barravertical.component.html',
  styleUrls: ['./barravertical.component.css']
})
export class BarraverticalComponent implements OnInit {

  single: any[];
  multi: any[];

  view: any[] = [1200, 600];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'CONVENIOS';
  showYAxisLabel = true;
  yAxisLabel = 'MESES QUE QUEDAN DE VIGENCIA';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  conveniosSeleccionados:any;
  constructor(private modal:ModalService) { }

  ngOnInit() {
    this.modal.currentPrueba.subscribe(data=>{
      this.single = data;
      this.conveniosSeleccionados = data;
      this.chart2(this.single);
    });
  }

  chart2(multi:any){
    Object.assign(this, {multi});
  }

  onSelect(event) {

    for(var i=0;i<this.conveniosSeleccionados.length;i++){
      if(event.name){
        if(this.conveniosSeleccionados[i].objeto.institution == event.name){
          alert("La vigencia que queda del convenio "+this.conveniosSeleccionados[i].name+ " es de "+this.conveniosSeleccionados[i].value+" meses");
        }
      }else{
        if(this.conveniosSeleccionados[i].objeto.institution == event){
          alert("La vigencia que queda del convenio "+this.conveniosSeleccionados[i].name+ " es de "+this.conveniosSeleccionados[i].value+" meses");
        }
      }
    }
    
  }
    

}
