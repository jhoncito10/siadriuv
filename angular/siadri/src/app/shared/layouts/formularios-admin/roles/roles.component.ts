
import { RuleservicesService } from 'app/shared/layouts/formularios-admin/roles/rule.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  my_list: any;
  roles: any;
  rolenombre: string;
  role = {permisos : {convenios : {lectura: false, escritura: false},
                      roles : {lectura: false, escritura: false},
                      solicitudes: {lectura: false, escritura: false},
                      borradores: {lectura: false, escritura: false},
                      usuarios: {lectura: false, escritura: false}},
          componentes : {ids : null} };

  nodes: any;
  tule: any;

  show_form = false;
  editing = false;
  key = null;

  constructor(private _rules: RuleservicesService) {
                this.cargarNodes();
                this.cargarRoles();
              }

  ngOnInit() {

  }

  cargarRoles() {
    this._rules.suscribirRol().then(() => {
    this.roles = this._rules.getRoles();
    console.log(this.roles);
  });
  }

 cargarNodes() {
    this.nodes = this._rules.getNodes();
  }

  crearRol() {
    console.log(this.rolenombre);
    console.log(this.role);
    this._rules.creaRol(this.rolenombre,this.role).then(() => {
        //  this._rules.preparaRules(this.role, this.rolenombre).then(() => {
        //    this._rules.EnvioReglas().then(() => {

        //      console.log('Reglas publicadas');

        //    });

        //    });


        // this.show_form = false;
        // this.rolenombre = null;
        // this.role = {permisos : {informacion_laboratorios : {lectura: false, escritura: false},
        //                           roles : {lectura: false, escritura: false},
        //                           usuarios: {lectura: false, escritura: false},
        //                           edificios: {lectura: false, escritura: false},
        //                           ensayos: {lectura: false, escritura: false},
        //                           laboratorios_borrados: {lectura: false, escritura: false},
        //                           pedidos: {lectura: false, escritura: false},
        //                           qrgen: {lectura: false, escritura: false},
        //                           tareas: {lectura: false, escritura: false},
        //                           usuariostareasCompletadas: {lectura: false, escritura: false}},
        //             componentes : {ids : null} };

     });

  }


  editaRol() {
    this._rules.creaRol(this.rolenombre,this.role);
    // this._rules.preparaRules(this.role, this.rolenombre).then(() => {
    //   this._rules.EnvioReglas().then(() => {
    //     this.show_form = false;
    //     console.log('reglas modificado');
    //   });
    // });
  }

  mostrar(key: string) {
    this.show_form = true;
    // tslint:disable-next-line:prefer-const
    for (let index = 0; index < this.roles.length; index++) {
      if (this.roles[index]['$key'] === key) {
        this.rolenombre = key;
        this.role = this.roles[index];
       }
    }
    console.log(this.role);
    
  }

  cancelar(){
    this.rolenombre = null;
    this.role = {permisos : {convenios : {lectura: false, escritura: false},
                      roles : {lectura: false, escritura: false},
                      solicitudes: {lectura: false, escritura: false},
                      borradores: {lectura: false, escritura: false},
                      usuarios: {lectura: false, escritura: false}},
          componentes : {ids : null} };
    
  }

  removeRol() {
    this._rules.eliminaRol(this.rolenombre);
    // this._rules.LeerReglas().then(() => {

    //  this._rules.eliminaReglas(this.role, this.key).then(() => {
    //    this._rules.EnvioReglas().then(() => {
    //      this.show_form = false;
    //      console.log('reglas elimiandas');
    //    });

    //  });

    // });
   }

}

