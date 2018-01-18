import { AngularFireDatabase } from 'angularfire2/database';
import { ModalService } from 'app/shared/modal.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-renovacion',
  templateUrl: './renovacion.component.html',
  styleUrls: ['./renovacion.component.css']
})
export class RenovacionComponent implements OnInit {

  renovaciones:any;
  user =  JSON.parse(localStorage.getItem('usuario'));

  constructor(private ad:AngularFireDatabase, private data:ModalService) { 
    
  }

  ngOnInit() {
    this.cargarRenovaciones(this.user.uid);
  }

  inicializarFormulario(){
    var formulario = {
      fecha:{dia:"",mes:"",ano:""},
      solicitante:{nombre:"", programa:"", objetivo:"",alcance:"",justificacion:"",desarrollo:"",area:"",beneficios:"",coordinador:"",institucion:"",replegal:"",telefono:"",fax:"",correo:""},
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

    this.data.changeformularioRenovacion(formulario);
    this.data.changeImprimir(false);
  }


    //METODO QUE CARGA LAS SOLICITUDES DE EL USUARIO QUE ESTA AUTENTICADO EN ESE MOMENTO
    cargarRenovaciones(uid:any){
      this.ad.list('/renovaciones', {
        query: {
          orderByChild: 'uid_diligenciado',
          equalTo:uid
        }
      }).subscribe(data=>{
        this.renovaciones = data;
    });
  
}
  
//METODO QUE PERMITE MOSTRAR LAS SOLICITUDES DE EL USUARIO DEPENDIENDO LA SOLICITUD QUE LE DE CLICK
  mostrarRenovacion(key:any){
      for (let index = 0; index < this.renovaciones.length; index++) {
        if (this.renovaciones[index]['$key'] === key) {
          this.data.changeformularioRenovacion(this.renovaciones[index]);
          this.data.changeImprimir(true);
         }
      }
    }
}
