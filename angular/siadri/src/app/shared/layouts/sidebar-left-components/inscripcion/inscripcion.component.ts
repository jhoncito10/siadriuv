import { ModalService } from './../../../modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.css']
})
export class InscripcionComponent implements OnInit {

  constructor(private data:ModalService) { }

  ngOnInit() {
  }
  inicializarFormulario(){
    var formulario = {
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
    formulario.fecha.dia = ""+date.getDate();
    formulario.fecha.mes = ""+(1+date.getMonth());
    formulario.fecha.ano = ""+date.getFullYear();

    this.data.changeformulario(formulario);
    this.data.changeImprimir(false);
  }
}