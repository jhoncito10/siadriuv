import { ModalService } from './../../modal.service';
import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import { AngularFireDatabase } from 'angularfire2/database';
import * as html2canvas from 'html2canvas';

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

  imprimir = false;

  constructor(private data:ModalService, private ad:AngularFireDatabase) {
    this.data.changeImprimir(false);
  }
// (38) METODO QUE MANTIENE REFRESCANDO LA VARIABLE FORMULARIO , DEPENDIENDO LO QUE CONTENGA LAVARIABLE OBSERVABLE DE MODALSERVICE
// (52) METODO QUE MANTIENE REFRESCANDO LA VARIABLE IMPRIMIR , DEPENDIENDO LO QUE CONTENGA LAVARIABLE OBSERVABLE DE MODALSERVICE,
// PARA MOSTRAR O NO EL BOTON IMPRIMIR
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

    this.data.currentImprimir.subscribe(imp => {
      this.imprimir = imp;
    });
  }

   //METODO QUE CAMBIA LA VARIABLE OBSERVABLE FORMULARIO QUE SE ENCUENTRA EN EL MODALSERVICE
  //PARA QUE POSTERIORMENTE PUEDA SER ENVIADA COMO SOLICITUD DESDE MODAL-POPUP
  enviarSolicitud(){
    this.data.changeMessage("Ingrese el correo del responsable de esta solicitud");
    this.data.changeformulario(this.formulario);
  }

  //METODO QUE CAMBIA LA VARIABLE OBSERVABLE FORMULARIO QUE SE ENCUENTRA EN EL MODALSERVICE
  //PARA QUE POSTERIORMENTE PUEDA SER ENVIADA COMO BORRADOR DESDE MODAL-POPUP
  enviarBorrador(){
    this.data.changeMessage("nombre");
    this.data.changeformulario(this.formulario);
  }

  //METODO QUE INICIALIZA EL FORMULARIO LA PRIMERA VEZ QUE INGRESA A DASH-NIVEL2 
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


//METODO QUE IMPRIME LA SOLICITUD
  imprimirSolicitud() { 

    var inputs = $('.input-texto');
    $.each(inputs,function (index,value) {
      $(this).attr('value',$(this).val());
    });
    var inputs1 = $('.valor-numerico');
    $.each(inputs1,function (index,value) {
      $(this).attr('value',$(this).val());
    });
    var inputs2 = $('textarea');
    $.each(inputs2,function (index,value) {
      $(this).html($(this).val());
    });
    var inputs3 = $('.checkbox');
    $.each(inputs3,function (index,value) {
      $(this).attr('checked',$(this).is(':checked'));
    });
    
      var printContents = document.getElementById('formulario-convenio').innerHTML;
      var scale = 'scale(0.999)'; 
      var w=window.open();
      w.document.write(printContents);
      w.document.head.style.transform = scale; 
      w.document.body.style.transform = scale;  
      w.print();
      w.close();

  }


  //  var jspdf = new jsPDF();

//       console.log(w.document.documentElement);

    //  html2canvas($('#formulario-convenio')).then(function(canvas){
    //   var canvasImg = canvas.toDataURL("image/jpg");
    //   $('#box').html('<img height=\'500\' src="'+canvasImg+'" alt="">');
      
    //  });


      // var specialElementHandlers = {
      //   '#box': function (element, renderer) {
      //       return true;
      //   }
      // };
      // jspdf.fromHTML($('#box').html(),150,150,{'elementHandlers': specialElementHandlers});

      // jspdf.save('auto.pdf');
      //document.body.style.webkitTransform =  scale;


 

}
