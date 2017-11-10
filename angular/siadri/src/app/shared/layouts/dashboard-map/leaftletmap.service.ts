import { ModalService } from './../../modal.service';
import { DashboardMapComponent } from './dashboard-map.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { element } from 'protractor';
import { world } from './countries';
import { Injectable } from '@angular/core';


declare var L: any;
declare var $:any;

@Injectable()
export class LeaftletmapService {

  map:any;
  static panel:any;
  static modalstatic:any;
  static angular:any;
  static convenios:any;

  constructor(private modal:ModalService ,private ad:AngularFireDatabase) {
   LeaftletmapService.modalstatic = modal;
   LeaftletmapService.angular = ad;
  }

  plotActivity() {
    var myStyle = {
      color: "#3949AB",
      weight: 5,
      opacity: 0.95
    };
    /*
  let map = new L.Map('map', {
    center: new L.LatLng(40.731253, -73.996139),
    zoom: 12,
  });*/
    this.map = L.map("map", {
      center: [13.463348,-23.266286],
      zoom: 3,
      zoomControl: false
    });

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

  console.log(world.features);
   this.organizarGeo();
   this.pintarPoligonos();

    var customLayer = L.geoJson(null, {
      style: myStyle
    });
    customLayer.eachLayer(function (layer) {
      layer.bindPopup("holi");
  });
  }

 
  organizarGeo(){
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
  }

 pintarPoligonos(){
   var poligons = [];
      for (var index = 0; index < world.features.length; index++) {
        var element = world.features[index]; 
        var latlngs = element.geometry.coordinates;
        var polygon = L.polygon(latlngs, {color: 'red', label:element.properties.name});
        poligons.push(polygon);
        polygon.on('click', function(e){
          var layer = e.target;
              layer.setStyle({
                  color: 'blue'
              });
          for (var i = 0; i < poligons.length; i++) {
            if(poligons[i] != e.target){
              var layer = poligons[i];
              layer.setStyle({
                  color: 'red'
              });
            }
            
          }
          LeaftletmapService.imprime(e.target.options.label);
        });
        polygon.addTo(this.map);   
      }
  }


  static imprime(dato){
    LeaftletmapService.getdataConvenio(dato).subscribe(data=>{
      LeaftletmapService.convenios = data;
      LeaftletmapService.modalstatic.changeObject(LeaftletmapService.convenios);
      LeaftletmapService.trucarSides();
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
