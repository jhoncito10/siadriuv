import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalService } from 'app/shared/modal.service';
import * as moment from 'moment';


@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent implements OnInit {

  view: any[] = [1200, 600];
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'NUMERO DE CONVENIOS';
    showYAxisLabel = true;
    yAxisLabel = 'PAISES';
    single:any;
    multi:any;
  
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
  };

  conveniosTotales:any;
  convenios:any
  constructor(private modal:ModalService) {
    this.modal.currentGraficos.subscribe(data =>{
      this.conveniosTotales = data;
    });
    
  }

  ngOnInit() {
    this.datosGrafico();
  }

  datosGrafico(){
    
    this.convenios = this.removeDuplicates(this.conveniosTotales,"country");

    var arregloSingle = [];
    for(var i=0;i< this.convenios.length;i++){
      var n=0;
      for(var j=0;j<this.conveniosTotales.length;j++){
        if(this.convenios[i].country == this.conveniosTotales[j].country){
          n++;
        }
      }
      arregloSingle.push({name:this.convenios[i].country,value:n});
    }
    
    this.single = arregloSingle;
    this.chart1(arregloSingle);

  }


  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }



  chart1(singled){

       Object.assign(this, {singled});
 
  }
      
  onSelect(event) {
    console.log(event);
    if(event.name){
      this.datosGraficoVencer(event.name);
    }else{
      this.datosGraficoVencer(event);
    }
  
  }

  datosGraficoVencer(name:any){
    var arregloSingle = [];
    //var arregloMulti = [];
  
      for(var j=0;j<this.conveniosTotales.length;j++){
        if(this.conveniosTotales[j].country == name){
          if(this.conveniosTotales[j].expires != "No disponible"){
            var fecha = this.obtenerFecha(this.conveniosTotales[j].expires);
            if(fecha <= 12 && fecha >= 0){
              arregloSingle.push({name:this.conveniosTotales[j].institution,value:fecha,objeto:this.conveniosTotales[j]});
              //arregloMulti.push({name:this.conveniosTotales[j].country,series:[{name:"Inicio",value:0},{name:"Actual",value:fecha}]});
            }
          }
        }
      }
    
      this.modal.changePrueba(arregloSingle);
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

    //var meses = parseInt(""+duration.asMonths());

    var meses = parseFloat(duration.asMonths().toFixed(1));

    return meses;

  }

  chart2(multi:any){
    Object.assign(this, {multi});
  }

}
