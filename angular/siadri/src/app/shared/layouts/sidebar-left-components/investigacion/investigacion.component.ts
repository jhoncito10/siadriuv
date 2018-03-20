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

  formulario = {comite: 'Comite 1 | Movilidades del 7 de mayo al 3 de junio', modalidad: '',
                  datos_solicitud: {nombre_prof: '', doc_prof: '', facultad: '', sede: '', celu_prof: '', tel_univ: '', direccion:'', mail_prof: '', sicop: ''},
                  datos_movilidad: {categoria: '', nom_ape: '', CC_pas: '', direccion:'', nacionalidad: '', ciudad_or: '', ciudad_des: '', pais_or: '', pais_des: '', fecha_part: '', fecha_reg: ''},
                  tipo_movilidad: {tipo_mov: '', observaciones: '', justificacion: ''},
                  presupuesto: {
                    item1: {item1: '', vr_od1: '', nom_1: '', vr_ciam1: ''},
                    item2: {item2: '', vr_od2: '', nom_2: '', vr_ciam2: ''},
                    item3: {item3: '', vr_od3: '', nom_3: '', vr_ciam3: ''},
                    item4: {item4: '', vr_od4: '', nom_4: '', vr_ciam4: ''},
                    valor_total: ''},
                  doc_entregados: {
                      prof_nom: {a: false, c: false, d: false, e: false, f: false, g: false, i: false, j: false},
                      prof_int: {b: false, i: false, j: false},
                      est_univ: {g: false, h: false, i: false, j: false}

                  }
                }


  constructor(private ad:AngularFireDatabase, private data: ModalService) {

  }

  ngOnInit() {
    this.cargarInvestigaciones(this.user.uid);

  }


  inicializarForm(){
    this.data.changeformularioInvestigacion(this.formulario);
  }


    // METODO QUE CARGA LAS SOLICITUDES DE EL USUARIO QUE ESTA AUTENTICADO EN ESE MOMENTO
    cargarInvestigaciones(uid: any) {
      this.ad.list('/investigaciones', {
        query: {
          orderByChild: 'uid_diligenciado',
          equalTo: uid
        }
      }).subscribe(data => {
        this.investigaciones = data;
    });

}

// METODO QUE PERMITE MOSTRAR LAS SOLICITUDES DE EL USUARIO DEPENDIENDO LA SOLICITUD QUE LE DE CLICK
  mostrarInvestigacion(key: any) {
    console.log(key);
      for (let index = 0; index < this.investigaciones.length; index++) {
        if (this.investigaciones[index]['$key'] === key) {
          this.data.changeformularioInvestigacion(this.investigaciones[index].form);
         }
      }
    }
}
