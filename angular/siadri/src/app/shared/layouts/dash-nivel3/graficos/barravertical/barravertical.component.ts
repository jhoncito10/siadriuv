import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/modal.service';
import swal from 'sweetalert2';
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
  xAxisLabel = "";
  showYAxisLabel = true;
  yAxisLabel = "";
  title = "";

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  conveniosSeleccionados: any;
  constructor(private modal: ModalService) { }

  ngOnInit() {
    this.modal.currentPrueba.subscribe(data => {
      this.single = data;
      this.xAxisLabel = data[0].xlabel; // convebions
      this.yAxisLabel = data[0].ylabel; // meses que quedan de vigencia
      this.title = data[0].title// instituciones
      this.conveniosSeleccionados = data;
      this.chart2(this.single);
    });
  }

  chart2(multi: any) {
    Object.assign(this, {multi});
  }

  onSelect(event) {

    for (let i = 0; i < this.conveniosSeleccionados.length; i++) {
      if (event.name) {
        if (this.conveniosSeleccionados[i].objeto.institution === event.name) {
          swal({
            type: 'warning',
            // tslint:disable-next-line:max-line-length
            title: 'La vigencia que queda del convenio ' + this.conveniosSeleccionados[i].name + ' es de ' + this.conveniosSeleccionados[i].value + 'meses',
            showConfirmButton: true,
          });
        }
      } else {
        if (this.conveniosSeleccionados[i].objeto.institution === event) {
          swal({
            type: 'warning',
            // tslint:disable-next-line:max-line-length
            title: 'La vigencia que queda del convenio ' + this.conveniosSeleccionados[i].name + ' es de ' + this.conveniosSeleccionados[i].value + ' meses',
            text: '',
            showConfirmButton: true,
          });
        }
      }
    }

  }


}
