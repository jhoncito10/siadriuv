import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-dash-nivel3',
  templateUrl: './dash-nivel3.component.html',
  styleUrls: ['./dash-nivel3.component.css']
})
export class DashNivel3Component implements OnInit {

  view: any[] = [600, 400];
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

    Object.assign(this, {singled, multi});
  }

  chart2(){
    
    var singled = [{"name": "Germany","value": 50},{"name": "USA","value": 100},{"name": "France","value": 70}];
    var multi = [
      {"name": "Germany", "series": [{"name": "2010","value": 70},{"name": "2011","value": 50}]},
      {"name": "USA","series": [{"name": "2010","value": 72},{"name": "2011","value": 80}]},
      {"name": "France","series": [{"name": "2010","value": 50},{"name": "2011","value": 58}]}
      ];

    Object.assign(this, {singled, multi});
  }



  
  onSelect(event) {
    console.log(event);
  }

}
