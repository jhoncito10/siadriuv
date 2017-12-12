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
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  // line, area
  autoScale = true;

  constructor() { 
    this.chart1();
  }

  ngOnInit() {
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
