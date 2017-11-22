import { Observable } from 'rxjs/Observable';
import { DashboardMapComponent } from './../dashboard-map/dashboard-map.component';
import { BuscadorService } from './buscador.service';
import { ModalService } from './../../modal.service';
import { AutocompleteService } from './../../services/autocomplete.service';
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
    getValue: "",
    list: {
      onClickEvent: function () { },
      match: { enabled: true }
    }
  };
  static easybusqueda: any;
  static buscadorService: any;
  static conveniostatic: any;
  static mapstatic: any;
  static modalstatic: any;

  constructor(private data: ModalService, private busqueda: BuscadorService) {
    ModalPopupComponent.modalstatic = data;
    this.data.currentMessage.subscribe(message => {
      this.message = message;
      this.busquedas(this.message);
    });
  }

  ngOnInit() {
  }


  busquedas(message) {
    ModalPopupComponent.conveniostatic = this.busqueda.getConvenio();
    // console.log(ModalPopupComponent.conveniostatic);
    if (message == 'Tipo Convenio') {
      let noduplicadosTipoConvenio = Array.from(new Set(ModalPopupComponent.conveniostatic));
      noduplicadosTipoConvenio = this.removeDuplicates(ModalPopupComponent.conveniostatic, "type");
      console.log(noduplicadosTipoConvenio);
      this.options.data = noduplicadosTipoConvenio;
      this.options.getValue = "type";
      this.options.list.onClickEvent = function () { ModalPopupComponent.busquedaPorTipo(); };
      ModalPopupComponent.easybusqueda = new EasyAutocomplete.main($('#inputBusqueda'),this.options);
      ModalPopupComponent.easybusqueda.init();

    } else if (message == 'Academia') {
      var array_programasAcademicos: Array<any> = [];
      var i = 0;
      return Promise(function (resolve) {
        ModalPopupComponent.conveniostatic.forEach(function (convenio) {
          var object = convenio.programas_escuelas;
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
              var element = object[key];
              element = element.replace(/\, \b/ig, ",");
              element = element.replace(".", "");
              element = element.replace("-", "");
              element = element.replace(" ", "");
              //console.log(element);
              element = element.split(",");
              if (element != "") {
                for (var x = 0; x < element.length; x++) {
                  //console.log(element[x]);
                  array_programasAcademicos.push(element[x]);
                }
              }

            }

          }
          i++;
          if (i == ModalPopupComponent.conveniostatic.length) {
            let programas_without_duplicates = Array.from(new Set(array_programasAcademicos));

            resolve(programas_without_duplicates);
          }
        });
      }).then(function (programas_without_duplicates) {
        let config = {
          data: programas_without_duplicates,

          list: {
            onClickEvent: function () {
              ModalPopupComponent.busquedaPorAcademia();
            },
            match: { enabled: true }
          }
        }

          ModalPopupComponent.easybusqueda = new EasyAutocomplete.main($('#inputBusqueda'),config);
          ModalPopupComponent.easybusqueda.init();
      });



    }

  }


  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  removeDuplicados(originalArray, prop) {
    var array = [];
    for (var i in originalArray) {
      array.push({ prop: originalArray[i] });
    }
    return array;
  }

  static busquedaPorTipo() {
    var resultado = [];
    var item = ModalPopupComponent.easybusqueda.getSelectedItemData();

    for (var index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      var element = ModalPopupComponent.conveniostatic[index];
      if (element.type == item.type) {
        resultado.push(element);
      }
    }
    ModalPopupComponent.modalstatic.changeObject(resultado);
    ModalPopupComponent.cerrarModal();
  }

  static busquedaPorAcademia() {
    var resultado = [];
    var item = ModalPopupComponent.easybusqueda.getSelectedItemData();

    for (var index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      var element = ModalPopupComponent.conveniostatic[index];
      var nobjuescuelas = element.programas_escuelas//.search(item);
      for (var x in nobjuescuelas) {
        var n = nobjuescuelas[x].search(item);;
        if (n != -1) {
          console.log(element.programas_escuelas);
          resultado.push(element); }
      }


    }
    ModalPopupComponent.modalstatic.changeObject(resultado);
    ModalPopupComponent.cerrarModal();
  }

  busquedaconveniosPais(pais) {
    ModalPopupComponent.conveniostatic = this.busqueda.getConvenio();
    var resultado = [];

    for (var index = 0; index < ModalPopupComponent.conveniostatic.length; index++) {
      var element = ModalPopupComponent.conveniostatic[index];
      if (element.country == pais) {
        resultado.push(element);
      }
    }

  }

  static cerrarModal() {
    $('#modal1').modal('hide');
    $('#content-box').addClass("collapsed-box");
    $('#div1').hide();
    $('#buton1 i').attr('class', 'fa fa-plus');
    $('#content-box2').removeClass("collapsed-box");
    $('#div2').show();
    $('#buton2 i').attr('class', 'fa fa-minus');

    $('#inputBusqueda').val("");
  }
}

