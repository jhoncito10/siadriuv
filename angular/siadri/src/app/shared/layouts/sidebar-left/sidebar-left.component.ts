import { ModalService } from './../../modal.service';
import { BuscadorService } from './../modal-popup/buscador.service';
import { RuleservicesService } from './../formularios-admin/roles/rule.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css']
})

//CLASE CONTENEDORA DE LOS COMPONENTES AGGREMENTS (PARTE PUBLICA), BORRADORES, INSCRIPCIONES Y SOLICITUDES (SEGUNDO NIVEL)
export class SidebarLeftComponent implements OnInit {

  public admin = false;
  datosUser: any;
  rol:string="";
  estado:string;
  univalle = false;

  constructor(public fs: RuleservicesService, private busqueda:BuscadorService,private modal:ModalService) {
    
    if (localStorage.getItem('usuario')) {
       this.datosUser = JSON.parse(localStorage.getItem('usuario'));
       let arr = this.datosUser.email.split("@");
       if(arr[1] == "correounivalle.edu.co"){
        this.univalle = true;
      }

      this.fs.getConsultaRol(this.datosUser.uid).then(() => {
        this.fs.getAtrRol(this.fs.getRolEsp()).subscribe(data => {
          this.rol = data.$key;
    
        });
      });
    }
  }

  ngOnInit() {


  }


}

