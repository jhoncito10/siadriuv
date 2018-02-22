import { BarraComponent } from './../dash-nivel3/graficos/barra/barra.component';
import { Observable } from 'rxjs/Observable';
import { DashboardMapComponent } from './../dashboard-map/dashboard-map.component';
import { BuscadorService } from './buscador.service';
import { ModalService } from './../../modal.service';
import { Subject } from 'rxjs/Rx';
import { any } from 'codelyzer/util/function';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { Promise } from 'q';

declare var EasyAutocomplete: any;
declare var $: any;

@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  message: any;
  options = {
    data: [],
    getValue: '',
    list: {
      onClickEvent: function () { },
      match: { enabled: true }
    }
  };
  // tslint:disable-next-line:member-ordering
  static easybusqueda: any;
  // tslint:disable-next-line:member-ordering
  static buscadorService: any;
  // tslint:disable-next-line:member-ordering
  static conveniostatic: any;
  // tslint:disable-next-line:member-ordering
  static mapstatic: any;
  // tslint:disable-next-line:member-ordering
  static modalstatic: any;

  correosolicitante: any;

  user = JSON.parse(localStorage.getItem('usuario'));
  borrador = '';

  constructor(private data: ModalService, private busqueda: BuscadorService) {
    ModalPopupComponent.modalstatic = data;
    this.data.currentMessage.subscribe(message => {
      console.log(message);

      this.message = message;
      this.busquedas(this.message);
    });
  }

  ngOnInit() {
  }


  busquedas(message) {
    ModalPopupComponent.conveniostatic = this.busqueda.getConvenio();

    if (message === 'Pais') {


      let noduplicadosPais = Array.from(new Set(ModalPopupComponent.conveniostatic));
      noduplicadosPais = this.removeDuplicates(ModalPopupComponent.conveniostatic, 'country');
      const array_pais: Array<any> = [];
      let i = 0;
      return Promise(function (resolve) {
        ModalPopupComponent.conveniostatic.forEach(function (convenio) {
          const object = convenio.country;

          array_pais.push(object);

          i++;
          if (i === ModalPopupComponent.conveniostatic.length) {
            const pais_without_duplicates = Array.from(new Set(array_pais));

            resolve(pais_without_duplicates);
          }
        });
      }).then(function (pais_without_duplicates) {
        const config = {
          data: pais_without_duplicates,
          list: {
            onClickEvent: function () {
              ModalPopupComponent.busquedaPorPais();
            },
            match: { enabled: true }
          }
        }

        ModalPopupComponent.easybusqueda = new EasyAutocomplete.main($('#modal1 #inputBusqueda'), config);
        ModalPopupComponent.easybusqueda.init();
      });

    } else if (message === 'Tipo Convenio') {

      let noduplicadosTipoConvenio = Array.from(new Set(ModalPopupComponent.conveniostatic));
      noduplicadosTipoConvenio = this.removeDuplicates(ModalPopupComponent.conveniostatic, 'type');
      const array_tipos: Array<any> = [];
      let i = 0;
      return Promise(function (resolve) {
        ModalPopupComponent.conveniostatic.forEach(function (convenio) {
          const object = convenio.type;
          array_tipos.push(object);

          i++;
          if (i === ModalPopupComponent.conveniostatic.length) {
            const tipos_without_duplicates = Array.from(new Set(array_tipos));

            resolve(tipos_without_duplicates);
          }
        });
      }).then(function (tipos_without_duplicates) {
        const config = {
          data: tipos_without_duplicates,
          list: {
            onClickEvent: function () {
              ModalPopupComponent.busquedaPorTipo();
            },
            match: { enabled: true }
          }
        }

        ModalPopupComponent.easybusqueda = new EasyAutocomplete.main($('#modal1 #inputBusqueda'), config);
        ModalPopupComponent.easybusqueda.init();
      });
    } else if (message === 'Academia') {
      const array_programasAcademicos: Array<any> = [];
      let i = 0;
      return Promise(function (resolve) {
        ModalPopupComponent.conveniostatic.forEach(function (convenio) {
          const object = convenio.programas_escuelas;
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              let element = object[key];
              element = element.replace(/\, \b/ig, ',');
              element = element.replace('.', '');
              element = element.replace('-', '');
              element = element.replace(' ', '');
              element = element.split(',');
              if (element !== '') {
                for (let x = 0; x < element.length; x++) {

                  array_programasAcademicos.push(element[x]);
                }
              }

            }

          }
          i++;
          if (i === ModalPopupComponent.conveniostatic.length) {
            const programas_without_duplicates = Array.from(new Set(array_programasAcademicos));

            resolve(programas_without_duplicates);
          }
        });
      }).then(function (programas_without_duplicates) {
        const config = {
          data: programas_without_duplicates,

          list: {
            onClickEvent: function () {
              ModalPopupComponent.busquedaPorAcademia();
            },
            match: { enabled: true }
          }
        }

        ModalPopupComponent.easybusqueda = new EasyAutocomplete.main($('#modal1 #inputBusqueda'), config);
        ModalPopupComponent.easybusqueda.init();
      });



    }

  }


  removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};

    // tslint:disable-next-line:forin
    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    // tslint:disable-next-line:forin
    for (const i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  // tslint:disable-next-line:member-ordering
  static busquedaPorPais() {
    const resultado = [];
    const item = ModalPopupComponent.easybusqueda.getSelectedItemData();
    for (let index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      const element = ModalPopupComponent.conveniostatic[index];
      if (element.country === item) {
        resultado.push(element);
      }
    }
    ModalPopupComponent.modalstatic.changeObject(resultado);
    ModalPopupComponent.cerrarModal();
  }


  // tslint:disable-next-line:member-ordering
  static busquedaPorTipo() {
    const resultado = [];
    const item = ModalPopupComponent.easybusqueda.getSelectedItemData();
    for (let index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      const element = ModalPopupComponent.conveniostatic[index];
      if (element.type === item) {
        resultado.push(element);
      }
    }
    ModalPopupComponent.modalstatic.changeObject(resultado);
    ModalPopupComponent.cerrarModal();
  }

  // tslint:disable-next-line:member-ordering
  static busquedaPorAcademia() {
    // tslint:disable-next-line:prefer-const
    let resultado = [];
    const item = ModalPopupComponent.easybusqueda.getSelectedItemData();
    for (let index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      const element = ModalPopupComponent.conveniostatic[index];
      // tslint:disable-next-line:prefer-const
      let nobjuescuelas = element.programas_escuelas// .search(item);
      // tslint:disable-next-line:forin
      for (const x in nobjuescuelas) {
        const n = nobjuescuelas[x].search(item);
        if (n !== -1) {
          console.log(element.programas_escuelas);
          resultado.push(element);
        }
      }
    }
    ModalPopupComponent.modalstatic.changeObject(resultado);
    ModalPopupComponent.cerrarModal();
  }

  busquedaconveniosPais(pais) {
    ModalPopupComponent.conveniostatic = this.busqueda.getConvenio();
    const resultado = [];
    for (let index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      const element = ModalPopupComponent.conveniostatic[index];
      if (element.country === pais) {
        resultado.push(element);
      }
    }

  }

  // tslint:disable-next-line:member-ordering
  static cerrarModal() {
    $('#modal1').modal('hide');
    $('#content-box').addClass('collapsed-box');
    $('#div1').hide();
    $('#buton1 i').attr('class', 'fa fa-plus');
    $('#content-box2').removeClass('collapsed-box');
    $('#div2').show();
    $('#buton2 i').attr('class', 'fa fa-minus');

    $('#inputBusqueda').val('');
  }


  enviar() {
    this.ejecutarSpiner();
    let form;
    this.data.currentformulario.subscribe(forma => {
      form = forma;
    });

    form.correo_solicitante = this.correosolicitante;
    form.uid_diligenciado = this.user.uid;
    form.correo_diligenciado = this.user.email;
    const parametro = 'Sol:' + form.fecha.dia + '/' + form.fecha.mes + '/' + form.fecha.ano + '/#' + Math.floor(Math.random() * (1000));

    this.busqueda.crearSolicitud(form, parametro);
    if (form.$key) {
      this.busqueda.EliminarBorrador(form.$key);
    }

    $('#modal1').modal('hide');
    $('#inputBusqueda').val('');
  }

  enviarRenovacion() {
    this.ejecutarSpiner();
    let form;
    this.data.currentformularioRenov.subscribe(forma => {
      form = forma;
    });

    form.correo_solicitante = this.correosolicitante;
    form.uid_diligenciado = this.user.uid;
    form.correo_diligenciado = this.user.email;
    const parametro = 'Ren:' + form.fecha.dia + '/' + form.fecha.mes + '/' + form.fecha.ano + '/#' + Math.floor(Math.random() * (1000));

    this.busqueda.crearRenovacion(form, parametro);
    if (form.$key) {
      this.busqueda.EliminarBorrador(form.$key);
    }

    $('#modal1').modal('hide');
    $('#inputBusqueda').val('');
  }

  enviarBorrador(message: any) {
    this.ejecutarSpiner();
    let form;
    if (message === 'nombre') {
      this.data.currentformulario.subscribe(forma => {
        form = forma;
      });
      this.borrador = 'Sol: ' + this.borrador;
    } else {
      this.data.currentformularioRenov.subscribe(forma => {
        form = forma;
      });
      this.borrador = 'Ren: ' + this.borrador;
    }

    form.uid_diligenciado = this.user.uid;
    form.correo_diligenciado = this.user.email;


    this.busqueda.crearBorrador(form, this.borrador);

    $('#modal1').modal('hide');
    $('#inputBusqueda').val('');
  }

  ejecutarSpiner() {
    $('#modal3').modal({backdrop: 'static', keyboard: false, show: true});
  }
}

