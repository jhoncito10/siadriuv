import { LeaftletmapService } from './leaftletmap.service';
import { any } from 'codelyzer/util/function';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.css']
})
export class DashboardMapComponent implements OnInit {



  constructor( private _mapService: LeaftletmapService) {

   }

   ngAfterViewInit() {
    this._mapService.plotActivity();
  }

   ngOnInit() {
  }
  }



