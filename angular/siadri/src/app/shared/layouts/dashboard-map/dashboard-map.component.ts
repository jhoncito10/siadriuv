import { ModalService } from './../../modal.service';
import { ModalPopupComponent } from './../modal-popup/modal-popup.component';
import { Observable } from 'rxjs/Observable';
import  'rxjs/add/observable/of';
import { LeaftletmapService } from './leaftletmap.service';
import { any } from 'codelyzer/util/function';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-dashboard-map',
  templateUrl: './dashboard-map.component.html',
  styleUrls: ['./dashboard-map.component.css']
})

export class DashboardMapComponent implements OnInit {


  convenios: Observable<Array<any>>;

  constructor( private _mapService: LeaftletmapService, private modal:ModalService) {

   }

   ngAfterViewInit() {
    this._mapService.plotActivity();
  }

   ngOnInit() {
    this.modal.currentObject.subscribe(data=>{
      this.convenios = Observable.of(data);
    });

 
    $("#div89").on('click',function(){
      console.log('click');
    });

    this.actionCaja1();

    this.actionCaja2();

 
   }

   actionCaja1(){
    $('#buton1').on('click',function(){ 
      if($('#buton1 i').attr('class')=='fa fa-plus'){
        $('#content-box2').addClass("collapsed-box");
        $('#div').attr('style','display:block;');
        $('#div2').attr('style','display:none;');

        $('#div2').hide();
        $('#buton2 i').attr('class','fa fa-plus');

      }else{
  
       $('#content-box2').removeClass("collapsed-box");
        $('#div2').show();
        $('#buton2 i').attr('class','fa fa-minus');

      }
    });
   }

   actionCaja2(){
    $('#buton2').on('click',function(){ 
      if($('#buton2 i').attr('class')=='fa fa-plus'){
        $('#content-box').addClass("collapsed-box");
        $('#div2').attr('style','display: none;');
        $('#div1').hide();
        $('#buton1 i').attr('class','fa fa-plus');
      }else{
        $('#content-box').removeClass("collapsed-box");
        $('#div1').show();
        $('#buton1 i').attr('class','fa fa-minus');
      }
    });
   }
 



  }



