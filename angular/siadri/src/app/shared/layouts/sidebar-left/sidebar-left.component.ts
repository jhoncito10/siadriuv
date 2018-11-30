import { ModalService } from './../../modal.service';
import { BuscadorService } from './../modal-popup/buscador.service';
import { RuleservicesService } from './../formularios-admin/roles/rule.service';
import { NativeFirebaseService } from "./../../../shared/services/main-service.service";
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
  rol: string = "";
  estado: string;
  univalle = false;
  db;
  par = false;
  dir = false;

  constructor(public fs: RuleservicesService,
    private busqueda: BuscadorService,
    private modal: ModalService,
    private _NativeFirebaseService: NativeFirebaseService
  ) {
    this.db = this._NativeFirebaseService.fb.database()
    
  }


  ngOnInit() {

    if (localStorage.getItem('usuario')) {
      this.datosUser = JSON.parse(localStorage.getItem('usuario'));
      let arr = this.datosUser.email.split("@");
      if (arr[1] == "correounivalle.edu.co") {
        this.univalle = true;
      }
    }

    if (localStorage.getItem('rol')) {
      this.rol = JSON.parse(localStorage.getItem('rol'));
    }
    this.isPar()
    this.isDir()

  }

  isPar() {
    var refParExterno = this.db.ref('/paresExternos/')
    return refParExterno
      .orderByChild("correo")
      .equalTo(this.datosUser.email)
      .once('value', parSnap => {
        if (parSnap) {
          this.par = true
        }
      })
  }
  isDir() {
    var refParExterno = this.db.ref('/programasAcademicos/')
    return refParExterno
      .orderByChild("correo")
      .equalTo(this.datosUser.email)
      .once('value', parSnap => {
        if (parSnap) {
          this.dir = true
        }
      })
  }

}

