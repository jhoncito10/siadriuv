import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as jsonexport from "jsonexport/dist"

declare var $: any;

@Component({
  selector: 'app-component-investigacion',
  templateUrl: './component-investigacion.component.html',
  styleUrls: ['./component-investigacion.component.css']
})
export class ComponentInvestigacionComponent implements OnInit {

  dtTrigger = new Subject();
  consulta:any;
  investigaciones:any;

  excel = [];

  dtOptions: DataTables.Settings = {};

  constructor(private busqueda:BuscadorService) {
    
   }

  ngOnInit() {
    this.busqueda.getInvestigaciones().subscribe(data => {
      this.investigaciones = data;
      this.dtTrigger.next();
    });
    
 
       $('.table tbody').on( 'click', 'tr', function () {
           $(this).toggleClass('selected');
       } );

       this.dtOptions = {
        retrieve:true
      };
   
    
  }

  cargarArreglo(item:any){
   this.excel.push(item);
  }

  mostrar(){
    this.excel = [];
    let compinv = this;
    var inputs = $('.checkbox');
    $.each(inputs,function (index,value) {
      if($(this).is(':checked') == true){
        let item = compinv.buscarItem($(this).val());
        compinv.cargarArreglo(item);
      }
    });
   if(this.excel.length != 0){
    this.metodo(this.excel);
   }else{
     alert("debe seleccionar almenos una fila")
   }
    
  }


  buscarItem(key:any){
    for(let i=0;i<this.investigaciones.length;i++){
      if(this.investigaciones[i].$key == key){
        return this.investigaciones[i];
      }
    }
  }
  
  metodo(array:any){
    var options = {
      rowDelimiter: ";",
      rename:["DM CC_PASAPORTE","DM CIUDAD DESTINO","DM CIUDAD ORIGEN","DM FECHA PARTIDA","DM FECHA REGRESO","DM NACIONALIDAD", "DM NOMBRE Y APELLIDO","DM PAIS DESTINO", "DM PAIS ORIGEN", "DM TIPO PERSONA", "DS CELULAR","DS DOCUMENTO","DS FACULTAD","DS MAIL","DS NOMBRE","DS SICOP","DS TEL UNIVALLE","DE MOD1 PROF-ART-INT CARTA PROINV","DE MOD1 PROF-ART-INT CARTA AVAL","DE MOD1 PROF-ART-INT CARTA COMPROBACION","DE MOD1 PROF-ART-INT COPIA PAGINA","DE MOD1 PROF-ART-INT EVIDENCIA","DE MOD1 PROF-ART-INT PLAN TRACTV2", "DE MOD1 PROF-NOM-UNIV CARTA APROBACION","DE MOD1 PROF-NOM-UNIV CARTA INVITACION","DE MOD1 PROF-NOM-UNIV EVIDENCIA","DE MOD1 PROF-NOM-UNIV CARTA PLAN TRACTV","DE MOD1 PROF-NOM-UNIV PRESUPUESTO","DE MOD2 PROF-ART-INT CARTA TUTOR","DE MOD2 PROF-NOM-UNIV CARTA AVAL","DE MOD2 PROF-NOM-UNIV CARTA COMITE","DE MOD2 PROF-NOM-UNIV CARTA INVITACION","DE MOD2 PROF-NOM-UNIV CERTIFICADO","DE MOD2 PROF-NOM-UNIV DOC PLAN","DE MOD2 PROF-NOM-UNIV TABULADO", "FECHA DILIGENCIADO","DOCUMENTO FIRMA","NOMBRE FIRMA","MODALIDAD","PRESUPUESTO I1-I1","PRESUPUESTO I1-NOM","PRESUPUESTO I1-CIAM","PRESUPUESTO I1-V-OD","PRESUPUESTO I2-I2","PRESUPUESTO I2-NOM","PRESUPUESTO I2-CIAM","PRESUPUESTO I2-V-OD","PRESUPUESTO I3-I3","PRESUPUESTO I3-NOM","PRESUPUESTO I3-CIAM","PRESUPUESTO I3-V-OD","PRESUPUESTO I4-I4","PRESUPUESTO I4-NOM","PRESUPUESTO I4-CIAM","PRESUPUESTO I4-V-OD","PRESUPUESTO VALOR TOTAL","TM JUSTIFICACION","TM OBSERVACIONES","TIPO MOVILIDAD","ID DILIGENCIADOR"],
      booleanTrueString:"SI",
      booleanFalseString:"NO"
    };
    jsonexport(array,options,function(err, csv){
      if(err) return console.log(err);
      
      console.log(csv);
      var file = new File([csv],"Reporte.csv",{type:"text/plain;charset=utf-8"});
      
      // obtienes una URL para el fichero que acabas de crear
      var url  = window.URL.createObjectURL(file);

      // // creas un enlace y lo añades al documento
      var a = document.createElement("a");
      
      // actualizas los parámetros del enlace para descargar el fichero creado
      a.href = url;
      a.download = file.name;
      a.click();

  });
  }

}