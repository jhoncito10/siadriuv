import { ModalService } from 'app/shared/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css']
})
export class DonaComponent implements OnInit {

  view: any[] = [600, 400];


 data:any;
 colorScheme = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#2E2EFE','#FF0000','#00FF00','#088A85','#BF00FF','#00FFFF','#D7DF01','#FF0040','#D76915','#099FF5','#FD3DB7']
};


  // line, area
  autoScale = true;

  constructor(private modal:ModalService) { 
   
  }

  ngOnInit() {
    this.modal.currentPrueba.subscribe(data=>{
      this.data = data;
     // this.chart2(this.data);
    });

  }

  chart1(){
  
    var single = [
      {
        "name": "Germany",
        "value": 8940000
      },
      {
        "name": "USA",
        "value": 5000000
      },
      {
        "name": "France",
        "value": 7200000
      }
    ];
    this.data = single;

  
    }

  onSelect(event) {
    console.log(event);
  }


}
