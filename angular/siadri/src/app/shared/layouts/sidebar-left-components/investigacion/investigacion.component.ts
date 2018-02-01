import { ModalService } from './../../../modal.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investigacion',
  templateUrl: './investigacion.component.html',
  styleUrls: ['./investigacion.component.css']
})
export class InvestigacionComponent implements OnInit {

  investigaciones:any;
  user =  JSON.parse(localStorage.getItem('usuario'));
  formulario = {fecha:"",modalidad:"",
      datos_solicitud:{nombre_prof:"",doc_prof:"",facultad:"",celu_prof:"",tel_univ:"",mail_prof:"",sicop:""},
      datos_movilidad:{tipo_persona:"", nom_ape:"",CC_pas:"",nacionalidad:"",ciudad_or:"", ciudad_des:"",pais_or:"",pais_des:"",fecha_part:"",fecha_reg:""},
      tipo_movilidad:{tipo_mov:"", observaciones:"",justificacion:""},
      presupuesto:{
        item1:{item1:"",vr_od1:"", nom_1:"",vr_ciam1:""},
        item2:{item2:"",vr_od2:"",nom_2:"",vr_ciam2:""},
        item3:{item3:"",vr_od3:"",nom_3:"",vr_ciam3:""},
        item4:{item4:"",vr_od4:"",nom_4:"",vr_ciam4:""},
        valor_total:""},
      doc_entregados:{
        modalidad1:{
          prof_nom_univ:{ plan_tractv:false,carta_inv:false,carta_apro:false, evidencia:false,presupuesto:false},
          prof_art_int:{plan_tractv2:false, cart_proinv:false,copia_pag:false,carta_comp:false,evidencia:false,carta_aval:false}
        },
        modalidad2:{
          prof_nom_univ:{tabulado:false,certificado:false,carta_comite:false,carta_invitacion:false,carta_aval_comite:false,doc_plan:false},
          prof_art_int:{carta_tutor:false}
        }
      },
      firma:{
        nombre_firma:"",
        doc_firma:""
      }
  }


  constructor(private ad:AngularFireDatabase, private data:ModalService) {
    
  }

  ngOnInit() {
    this.cargarInvestigaciones(this.user.uid);

    
  }


  inicializarForm(){
    this.data.changeformularioInvestigacion(this.formulario);
  }


    //METODO QUE CARGA LAS SOLICITUDES DE EL USUARIO QUE ESTA AUTENTICADO EN ESE MOMENTO
    cargarInvestigaciones(uid:any){
      this.ad.list('/investigaciones', {
        query: {
          orderByChild: 'uid_diligenciado',
          equalTo:uid
        }
      }).subscribe(data=>{
        this.investigaciones = data;
    });
  
}
  
//METODO QUE PERMITE MOSTRAR LAS SOLICITUDES DE EL USUARIO DEPENDIENDO LA SOLICITUD QUE LE DE CLICK
  mostrarInvestigacion(key:any){
    console.log(key);
      for (let index = 0; index < this.investigaciones.length; index++) {
        if (this.investigaciones[index]['$key'] === key) {
          this.data.changeformularioInvestigacion(this.investigaciones[index].form);
         }
      }
    }
}
