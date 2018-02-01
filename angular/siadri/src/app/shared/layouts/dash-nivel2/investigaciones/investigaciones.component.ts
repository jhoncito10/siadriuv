import { ModalService } from './../../../modal.service';
import { Router } from '@angular/router';
import { BuscadorService } from './../../modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-investigaciones',
  templateUrl: './investigaciones.component.html',
  styleUrls: ['./investigaciones.component.css']
})
export class InvestigacionesComponent implements OnInit {

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

   user = JSON.parse(localStorage.getItem('usuario'));
   
  constructor(private busqueda:BuscadorService, private ruta:Router, private modal:ModalService) { 
    console.log(this.user);
  }

  ngOnInit() {
    this.modal.currentformularioInvest.subscribe(forma => {
       if(forma.length!=0){
         this.formulario = forma;
       }
     });
  }

  crearInvestigacion(){
    this.ejecutarSpiner();
    this.busqueda.crearFormInvestigacion(this.user.uid,this.formulario).then(()=>{
        alert("Formulario diligenciado exitosamente");
        $('#modal3').modal('hide');
        this.inicializarForm();
    });
  }

  ejecutarSpiner(){
    $('#modal3').modal({backdrop: 'static', keyboard: false,show:true});
  }

  inicializarForm(){
    this.formulario = {fecha:"",modalidad:"",
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
  }
}
