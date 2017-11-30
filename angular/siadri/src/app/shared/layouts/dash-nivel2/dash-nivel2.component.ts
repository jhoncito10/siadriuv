import { ModalService } from './../../modal.service';
import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AngularFireDatabase } from 'angularfire2/database';
import {HttpService} from './../../services/http.service';

declare var $:any;

@Component({
  selector: 'app-dash-nivel2',
  templateUrl: './dash-nivel2.component.html',
  styleUrls: ['./dash-nivel2.component.css']
})
export class DashNivel2Component implements OnInit {


   formulario:any = {
    fecha:{dia:"",mes:"",ano:""},
    solicitante:{nombre:"", programa:"", objetivo:"",alcance:"",justificacion:"",beneficios:"",coordinador:"",institucion:"",replegal:"",telefono:"",fax:"",correo:""},
    conveniocontrato:{duracion:"",valor:"",resolucion:"",tipo:{convenio:{marco:false,especifico:false},contrato:false},clasificacion:{internacional:false,nacional:false,departamental:false,municipal:false,entidad:{publica:false,privada:false}}},
    tipoconvcont:{academico:{mov:false,ies:false,act:false,sac:false,ppp:false,cap:false,cos:false,oaa:false},investigacion:{pdi:false,oai:false},bienestar:{abu:false},interna:{mi:false,pci:false}},
    vicerectoria:"",
    presupuesto:{ing:0,idp:0,ti:0,gas:0,mys:0,galoj:0,gali:0,gtran:0,cper:0,pnu:0,peu:0,ops:0,eqac:0,iif:0,gasg:0,viu:0,imp:0,cap:0,totcos:0,dif:0,sala:0,repu:0,per30:0,ctp17:0,valemi:0,conciu:0,rendf:0,disr:0,fc:0,foi:0,totalrec:0},
    observaciones:"",
    correo_solicitante:"",
    uid_diligenciado:"",
    correo_diligenciado:""
  }

  constructor(private data:ModalService, private ad:AngularFireDatabase) {
    
  }

  ngOnInit() {
    this.data.currentformulario.subscribe(forma => {
     
      if(forma.length!=0){
        this.formulario = forma;
      }
     
      var date = new Date();
      this.formulario.fecha.dia = ""+date.getDate();
      this.formulario.fecha.mes = ""+(1+date.getMonth());
      this.formulario.fecha.ano = ""+date.getFullYear();
     
    });
  }

  enviarSolicitud(){
    this.data.changeMessage("Ingrese el correo del responsable de esta solicitud");
    this.data.changeformulario(this.formulario);
  }

  enviarBorrador(){
    this.data.changeMessage("nombre");
    this.data.changeformulario(this.formulario);
  }

  inicializarFormulario(){
    this.formulario = {
      fecha:{dia:"",mes:"",ano:""},
      solicitante:{nombre:"", programa:"", objetivo:"",alcance:"",justificacion:"",beneficios:"",coordinador:"",institucion:"",replegal:"",telefono:"",fax:"",correo:""},
      conveniocontrato:{duracion:"",valor:"",resolucion:"",tipo:{convenio:{marco:false,especifico:false},contrato:false},clasificacion:{internacional:false,nacional:false,departamental:false,municipal:false,entidad:{publica:false,privada:false}}},
      tipoconvcont:{academico:{mov:false,ies:false,act:false,sac:false,ppp:false,cap:false,cos:false,oaa:false},investigacion:{pdi:false,oai:false},bienestar:{abu:false},interna:{mi:false,pci:false}},
      vicerectoria:"",
      presupuesto:{ing:0,idp:0,ti:0,gas:0,mys:0,galoj:0,gali:0,gtran:0,cper:0,pnu:0,peu:0,ops:0,eqac:0,iif:0,gasg:0,viu:0,imp:0,cap:0,totcos:0,dif:0,sala:0,repu:0,per30:0,ctp17:0,valemi:0,conciu:0,rendf:0,disr:0,fc:0,foi:0,totalrec:0},
      observaciones:"",
      correo_solicitante:"",
      uid_diligenciado:"",
      correo_diligenciado:""
    }
    var date = new Date();
    this.formulario.fecha.dia = ""+date.getDate();
    this.formulario.fecha.mes = ""+(1+date.getMonth());
    this.formulario.fecha.ano = ""+date.getFullYear();
  }


 



  // download() { 
  //   var printDoc = new jsPDF();

  //   var specialElementHandlers = {
  //     '#div1': function(element, renderer){
  //      return true;
  //     }
  //    };
     
  //    // All units are in the set measurement for the document
  //    // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
  //    printDoc.fromHTML($('#table').get(0), 15, 15, {
  //     'width': 500, 
  //     'elementHandlers': specialElementHandlers
  //    });
  //    printDoc.autoPrint();
  //    printDoc.output("dataurlnewwindow");

  //   // Save the PDF
  //   //doc.save('Test.pdf');
  // }

  // test() {
  // html2canvas($('#form'),{
  //   onrendered: function(canvas){
  //     $('#box').html("");
  //     $('#box').append(canvas);
  //   }
  // });

  // html2canvas($('#form'),{
  //   onrendered: function(canvas) {         
  //       var imgData = canvas.toDataURL(
  //           'image/png');              
  //       var doc = new jsPDF('p', 'mm');
  //       doc.addImage(imgData, 'PNG', 10, 10);
  //       doc.save('sample-file.pdf');
  //   }
  // });

  // $('#form').animate({
  //   scrollTop:$('#form')[0].scrollHeight}, 1000);
 
  // }

}
