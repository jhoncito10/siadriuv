import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent implements OnInit {

  view: any[] = [700, 400];
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
    single:any;
  
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
  };

  conveniosTotales:any;
  convenios:any
  constructor(private ad:BuscadorService) {
    this.datosGrafico();
   }

  ngOnInit() {
  }

  datosGrafico(){
    this.ad.getdataConvenio();
    this.conveniosTotales = this.ad.getConvenio();
    this.convenios = this.removeDuplicates(this.conveniosTotales,"country");
    console.log(this.convenios);

    var arregloSingle = [];
    var arregloMulti = [];
    for(var i=0;i< this.convenios.length;i++){
      var n=0;
      for(var j=0;j<this.conveniosTotales.length;j++){
        if(this.convenios[i].country == this.conveniosTotales[j].country){
          n++;
        }
      }
      arregloSingle.push({name:this.convenios[i].country,value:n});
      
      arregloMulti.push({name:this.convenios[i].country,series:[{name:"Inicio",value:0},{name:"Actual",value:n}]});
    }
    
    this.single = arregloSingle;
    this.chart1(arregloSingle,arregloMulti);

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



  chart1(singled,multi){

      console.log(singled);
      console.log(multi);
    
       Object.assign(this, {singled, multi});
 
      }
      
      onSelect(event) {
        console.log(event);
      }

}
