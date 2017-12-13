import { ModalService } from 'app/shared/modal.service';
import { Component, OnInit } from '@angular/core';
import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';

import * as moment from 'moment';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  view: any[] = [700, 400];
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'MESES DE VIGENCIA';
    showYAxisLabel = true;
    yAxisLabel = 'PAISES';
    multi:any;
  
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
    };
  
    // line, area
    autoScale = true;
  
    conveniosTotales:any;

  constructor(private modal:ModalService) {
   this.modal.currentGraficos.subscribe(data=>{
    this.conveniosTotales = data;
   });
  }

  ngOnInit() {
    this.datosGraficoVencer();
  }


  chart1(singled,multi){
    Object.assign(this, {singled, multi});
  }
      
  onSelect(event) {
    console.log(event);
  }

  datosGraficoVencer(){
    var arregloSingle = [];
    var arregloMulti = [];
  
      for(var j=0;j<this.conveniosTotales.length;j++){
        if(this.conveniosTotales[j].expires != "No disponible"){
          var fecha = this.obtenerFecha(this.conveniosTotales[j].expires);
          if(fecha <= 12 && fecha >= 0){
            arregloSingle.push({name:this.conveniosTotales[j].country,value:fecha});
            arregloMulti.push({name:this.conveniosTotales[j].country,series:[{name:"Inicio",value:0},{name:"Actual",value:fecha}]});
          }
        }
      }
     
    this.multi = arregloMulti;
    this.chart1(arregloSingle, arregloMulti);

  }

  obtenerFecha(fechaVencimiento:any){
    var arr = [];
    var f = new Date();
    var fechaActual = f.getFullYear()+"-"+(f.getMonth()+1)+"-"+f.getDate();
    arr = fechaVencimiento.split('/');
    fechaVencimiento = arr[2]+"-"+arr[0]+"-"+arr[1];

    var fecha1 = moment(fechaActual);
    var fecha2 = moment(fechaVencimiento);

    var diff = fecha2.diff(fecha1, 'days');
    var duration = moment.duration(diff,'days');

    var meses = parseInt(""+duration.asMonths());

    return meses;

  }



}
