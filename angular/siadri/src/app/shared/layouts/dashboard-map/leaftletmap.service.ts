import { ModalService } from './../../modal.service';
import { DashboardMapComponent } from './dashboard-map.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { element } from 'protractor';
import { world } from './countries';
import { Injectable, OnInit } from '@angular/core';


declare var L: any;
declare var $:any;

@Injectable()
export class LeaftletmapService {

  map:any;
  static mapsta:any;
  static panel:any;
  static modalstatic:any;
  static angular:any;
  static convenios:any;

  constructor(private modal:ModalService ,private ad:AngularFireDatabase) {
   LeaftletmapService.modalstatic = modal;
   LeaftletmapService.angular = ad;
   this.organizarGeo();
  }

  plotActivity() {
    var myStyle = {
      color: "#3949AB",
      weight: 5,
      opacity: 0.95
    };

    this.map = L.map("map", {
      center: [13.463348,-23.266286],
      zoom: 3,
      zoomControl: false
    });

    LeaftletmapService.mapsta = this.map;


    this.map.createPane('labels');
    this.map.getPane('labels').style.zIndex = 650;
    this.map.getPane('labels').style.pointerEvents = 'none';

    L.control
      .zoom({
        position: "bottomleft"
      })
      .addTo(this.map);

    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }).addTo(this.map);
<<<<<<< HEAD
 
    this.pintarPoligonos();
=======

  //console.log(world.features);
   this.organizarGeo();
   this.pintarPoligonos();
>>>>>>> afbf746259d3beebdc2bbe62eb4a7615fc0ea51b

    var customLayer = L.geoJson(null, {
      style: myStyle
    });
    customLayer.eachLayer(function (layer) {
      layer.bindPopup("holi");
  });

  }

  OnInit(){
    

  }

 
  organizarGeo(){
    let promise = new Promise((resolve,reject)=>{
      for (var index = 0; index < world.features.length; index++) {
        var element = world.features[index];
          if(element.geometry.type == "Polygon"){
            for (var j = 0; j < element.geometry.coordinates[0].length; j++) {
              var element2 =  element.geometry.coordinates[0][j];
              var aux;
              aux = element2[1];
              element2[1] = element2[0];
              element2[0] = aux;  
            }
          }else{
            for (var k = 0; k < element.geometry.coordinates.length; k++) {
              var element3 = element.geometry.coordinates[k];
              for (var l = 0; l < element3.length; l++) {
                var element4 = element3[l];
                for (var w = 0; w < element4.length; w++) {
                  var element5 = element4[w];
                  var aux2;
                  aux2 = element5[1];
                  element5[1] = element5[0];
                  element5[0] = aux2; 
                }
              }
            } 
        }
      }
      resolve();
    });
  return promise;
  }

 pintarPoligonos(){
   var poligons = [];
      for (var index = 0; index < world.features.length; index++) {
        var element = world.features[index]; 
        var latlngs = element.geometry.coordinates;
        var polygon = L.polygon(latlngs, {color: '#DF7977', label:element.properties.name});

        poligons.push(polygon);

        polygon.on('click', function(e){
          var popup = L.popup();
          popup.setLatLng(e.latlng).setContent('<div class="text-center"><h3>'+e.target.options.label+'</h3><button class="btn btn-danger">Ver informacion</button></div>').openOn(LeaftletmapService.mapsta);

          var layer = e.target;
              layer.setStyle({
                  color: 'blue'
              });
          for (var i = 0; i < poligons.length; i++) {
            if(poligons[i] != e.target){
              var layer = poligons[i];
              layer.setStyle({
                  color: '#DF7977'
              });
            }
            
          }
          $(".btn").on('click',function(){
            LeaftletmapService.trucarSides(); 
           });
           LeaftletmapService.imprime(e.target.options.label);
        });
        polygon.addTo(this.map);   
      }
  }

   static imprime(dato){
    LeaftletmapService.getdataConvenio(dato).subscribe(data=>{
      LeaftletmapService.convenios = data;
      LeaftletmapService.modalstatic.changeObject(LeaftletmapService.convenios);
   });;
   
  }


  static getdataConvenio(dato){
    return LeaftletmapService.angular.list('/convenios', {
      query: {
        orderByChild: 'country',
        equalTo: dato
      }
    });
  }

  
  static trucarSides(){
    $('#content-box').addClass("collapsed-box");
    $('#div1').hide();
    $('#buton1 i').attr('class','fa fa-plus');
    $('#content-box2').removeClass("collapsed-box");
    $('#div2').show();
    $('#buton2 i').attr('class','fa fa-minus');

  }



}
