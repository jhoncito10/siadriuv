import { Component, OnInit } from '@angular/core';

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
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
  
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
  
    // line, area
    autoScale = true;

  constructor() { 
    this.chart1();
  }

  ngOnInit() {
  }

  chart1(){
    
        var singled = [{"name": "Germany","value": 50},{"name": "USA","value": 100},{"name": "France","value": 70}];
        var multi = [
          {"name": "Germany", "series": [{"name": "2010","value": 70},{"name": "2011","value": 50}]},
          {"name": "USA","series": [{"name": "2010","value": 72},{"name": "2011","value": 80}]},
          {"name": "France","series": [{"name": "2010","value": 50},{"name": "2011","value": 58}]}
          ];
    
          console.log(this);
    
       Object.assign(this, {singled, multi});
    
    
    
      }
      
      onSelect(event) {
        console.log(event);
      }

}
