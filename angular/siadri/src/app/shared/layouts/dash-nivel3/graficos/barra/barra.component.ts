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
    title = 'PAISES';
  
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
  };

  conveniosTotales:any;
  convenios:any
  constructor(private modal:ModalService) {
    this.modal.currentGraficos.subscribe(data =>{
      this.conveniosTotales = data;
      console.log(this.conveniosTotales);
    });
    
  }

  ngOnInit() {
    this.datosGrafico();
  }

  datosGrafico(){
    
    this.convenios = this.removeDuplicates(this.conveniosTotales,"country");

    let arregloSingle = [];
    for(let i=0;i< this.convenios.length;i++){
      let n=0;
      for(let j=0;j<this.conveniosTotales.length;j++){
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
    let grafico;
    this.modal.currentGrafico.subscribe(data=>{
      grafico = data;
    }); 

    if(grafico == 'Grafico1'){
      if(event.name){
        this.datosGraficoVencer(event.name);
      }else{
        this.datosGraficoVencer(event);
      }
    }else if(grafico == 'Grafico2'){
      if(event.name){
        this.datosGraficoAno(event.name);
      }else{
        this.datosGraficoAno(event);
      }
    }
  }

  datosGraficoVencer(name:any){
    let arregloSingle = [];
    //var arregloMulti = [];
  
      for(let j=0;j<this.conveniosTotales.length;j++){
        if(this.conveniosTotales[j].country == name){
          if(this.conveniosTotales[j].expires != "No disponible"){
            let fecha = this.obtenerFecha(this.conveniosTotales[j].expires);
            if(fecha <= 12 && fecha >= 0){
              arregloSingle.push({name:this.conveniosTotales[j].institution,value:fecha,objeto:this.conveniosTotales[j],xlabel:"CONVENIOS",ylabel:"MESES QUE QUEDAN DE VIGENCIA",title:"INSTITUCIONES"});
              //arregloMulti.push({name:this.conveniosTotales[j].country,series:[{name:"Inicio",value:0},{name:"Actual",value:fecha}]});
            }
          }
        }
      }

      if(!(arregloSingle.length == 0)){
        this.modal.changePrueba(arregloSingle);
      }else{
       alert("En el pais "+name+" no existen convenios que se expiren en menos de 1 año");
      }
      
  }

  //ESTA FUNCIONANDO CON EL CAMPO DE EXPIRACION PERO DEBE SER EL DE CREACION QUE ACTUALMENTE NO ESTA
  datosGraficoAno(name:any){
    let arregloSingle = [];
    let convTemp = [];
    this.modal.currentGraficos.subscribe(data=>{
      for(let i=0;i<data.length;i++){
        if((data[i].pais==name)&&(data[i].ano_de_firma != undefined)&&(data[i].ano_de_firma != "")){
          convTemp.push(data[i]);
        }
      }
    });

      let conven = this.removeDuplicates(convTemp, 'ano_de_firma');

      console.log(conven);

      for(let i=0;i<conven.length;i++){
        let n = 0;
        for(let j=0;j<convTemp.length;j++){
          if(conven[i].ano_de_firma == convTemp[j].ano_de_firma){
            n++;
          }
        }
        arregloSingle.push({name:conven[i].ano_de_firma,value:n,objeto:conven[i],xlabel:"AÑOS",ylabel:"CANTIDAD DE CONVENIOS",title:"AÑOS"});
      }

      if(!(arregloSingle.length == 0)){
        this.modal.changePrueba(arregloSingle);
      }else{
       alert("En el pais "+name+" no existen convenios que se expiren en menos de 1 año");
      }
      
     
  }

  obtenerFecha(fechaVencimiento:any){
    let arr = [];
    let f = new Date();
    let fechaActual = f.getFullYear()+"-"+(f.getMonth()+1)+"-"+f.getDate();
    arr = fechaVencimiento.split('/');
    fechaVencimiento = arr[2]+"-"+arr[0]+"-"+arr[1];

    let fecha1 = moment(fechaActual);
    let fecha2 = moment(fechaVencimiento);

    let diff = fecha2.diff(fecha1, 'days');
    let duration = moment.duration(diff,'days');

    //var meses = parseInt(""+duration.asMonths());

    let meses = parseFloat(duration.asMonths().toFixed(1));

    return meses;

  }

  chart2(multi:any){
    Object.assign(this, {multi});
  }

}
