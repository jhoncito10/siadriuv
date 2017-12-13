import { Component, OnInit } from '@angular/core';
import { ModalService } from 'app/shared/modal.service';


@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit {

  view: any[] = [700, 400];
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'CONVENIOS';
    showYAxisLabel = true;
    yAxisLabel = 'MESES DE VIGENCIA';
  
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
    };
  
    // line, area
    autoScale = true;

    multi:any;
    single:any;

    conveniosTotales:any;
  constructor(private modal:ModalService) { 

  }

  ngOnInit() {
    this.modal.currentPrueba.subscribe(data=>{
      this.multi = data;
      this.chart2(this.multi);
    });

  }

  chart1(singled:any,multi:any){
   Object.assign(this, {singled, multi});
  }
  chart2(multi:any){
    Object.assign(this, {multi});
   }
    
  onSelect(event) {
    console.log(event);
  }

  


}
