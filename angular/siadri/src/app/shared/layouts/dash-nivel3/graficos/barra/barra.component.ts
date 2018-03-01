import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalService } from 'app/shared/modal.service';
import swal from 'sweetalert2';
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

  conveniosTotales: any;
  convenios: any
  constructor(private modal: ModalService) {

  }

  ngOnInit() {
    this.modal.currentGraficos.subscribe(data => {
      this.conveniosTotales = data;

        console.log('entro');
        console.log(this.conveniosTotales);
        this.datosGrafico();

    });
  }

  datosGrafico() {

    const arregloSingle = [];

      this.convenios = this.removeDuplicates(this.conveniosTotales, 'country');
      console.log(this.convenios);
      for (let i = 0; i < this.convenios.length; i++) {
        let n = 0;
        for (let j = 0; j<this.conveniosTotales.length; j++) {
          if (this.convenios[i].country === this.conveniosTotales[j].country) {
            n++;
          }
        }
        arregloSingle.push({name: this.convenios[i].country, value: n});
      }

    console.log(arregloSingle);
    this.single = arregloSingle;
    this.chart1(arregloSingle);

  }


  removeDuplicates(originalArray, prop) {
    // tslint:disable-next-line:prefer-const
    let newArray = [];
    const lookupObject = {};

    // tslint:disable-next-line:forin
    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    // tslint:disable-next-line:forin
    for (const i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }



  chart1(singled) {

       Object.assign(this, {singled});

  }

  onSelect(event) {
    let grafico;
    this.modal.currentGrafico.subscribe(data=> {
      grafico = data;
    });

    if (grafico === 'Grafico1') {
      if (event.name) {
        this.datosGraficoVencer(event.name);
      } else {
        this.datosGraficoVencer(event);
      }
    } else if (grafico === 'Grafico2') {
      if (event.name) {
        this.datosGraficoAno(event.name);
      } else {
        this.datosGraficoAno(event);
      }
    }
  }

  datosGraficoVencer(name: any) {
    const arregloSingle = [];

      for (let j = 0; j < this.conveniosTotales.length; j++) {
        if (this.conveniosTotales[j].country === name) {
          if (this.conveniosTotales[j].expires !== 'No disponible') {
            const fecha = this.obtenerFecha(this.conveniosTotales[j].expires);
            if (fecha <= 12 && fecha >= 0) {
              // tslint:disable-next-line:whitespace
              // tslint:disable-next-line:max-line-length
              arregloSingle.push({name:this.conveniosTotales[j].institution,value:fecha,objeto:this.conveniosTotales[j],xlabel:'CONVENIOS',ylabel:'MESES QUE QUEDAN DE VIGENCIA',title:'INSTITUCIONES'});
            }
          }
        }
      }

      if(!(arregloSingle.length === 0)){
        this.modal.changePrueba(arregloSingle);
      } else {
        swal({
          type: 'warning',
          title: 'En el pais ' + name + ' no existen convenios que se expiren en menos de 1 año',
          text: '',
          showConfirmButton: true,
        });

      }

  }

  // ESTA FUNCIONANDO CON EL CAMPO DE EXPIRACION PERO DEBE SER EL DE CREACION QUE ACTUALMENTE NO ESTA
  datosGraficoAno(name: any) {
    const arregloSingle = [];
    const convTemp = [];
    this.modal.currentGraficos2.subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if ((data[i].pais === name) && (data[i].ano_de_firma !== undefined) && (data[i].ano_de_firma !== "")) {
          convTemp.push(data[i]);
        }
      }
    });

      let conven = this.removeDuplicates(convTemp, 'ano_de_firma');

      console.log(conven);

      for(let i=0;i<conven.length;i++) {
        let n = 0;
        for(let j=0;j<convTemp.length;j++) {
          if(conven[i].ano_de_firma === convTemp[j].ano_de_firma) {
            n++;
          }
        }
        arregloSingle.push({name:conven[i].ano_de_firma,value:n,objeto:conven[i],xlabel:"AÑOS",ylabel:"CANTIDAD DE CONVENIOS",title:"AÑOS"});
      }

      if(!(arregloSingle.length === 0)){
        this.modal.changePrueba(arregloSingle);
      } else {
        swal({
          type: 'warning',
          title: 'vista de datos no disponible',
          text: '',
          showConfirmButton: true,
        });

      }


  }

  obtenerFecha(fechaVencimiento:any) {
    let arr = [];
    let f = new Date();
    let fechaActual = f.getFullYear()+"-"+ (f.getMonth()+1)+"-"+f.getDate();
    arr = fechaVencimiento.split('/');
    fechaVencimiento = arr[2] +'-'+ arr[0]+ '-' + arr[1];

    const fecha1 = moment(fechaActual);
    const fecha2 = moment(fechaVencimiento);

    const diff = fecha2.diff(fecha1, 'days');
    const duration = moment.duration(diff, 'days');

    // var meses = parseInt(""+duration.asMonths());

    const meses = parseFloat(duration.asMonths().toFixed(1));

    return meses;

  }

  chart2(multi: any) {
    Object.assign(this, {multi});
  }

}
