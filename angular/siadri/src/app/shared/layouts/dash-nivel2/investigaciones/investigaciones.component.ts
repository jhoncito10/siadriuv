
import { ModalService } from './../../../modal.service';
import { Router } from '@angular/router';
import { BuscadorService } from './../../modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, Http } from '@angular/http';
import { CompleterService, CompleterData } from 'ng2-completer';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-investigaciones',
  templateUrl: './investigaciones.component.html',
  styleUrls: ['./investigaciones.component.css']
})
export class InvestigacionesComponent implements OnInit {

   formulario = {comite: '', modalidad: '',
              datos_solicitud: {nombre_prof: '', doc_prof: '', facultad: '', celu_prof: '', tel_univ: '', mail_prof: '', sicop: ''},
              datos_movilidad: {categoria: '', nom_ape: '', CC_pas: '', nacionalidad: '', ciudad_or: '', ciudad_des: '', pais_or: '', pais_des: '', fecha_part: '', fecha_reg: ''},
              tipo_movilidad: {tipo_mov: '', observaciones: '', justificacion: ''},
              presupuesto: {
                item1: {item1: '', vr_od1: '', nom_1: '', vr_ciam1: ''},
                item2: {item2: '', vr_od2: '', nom_2: '', vr_ciam2: ''},
                item3: {item3: '', vr_od3: '', nom_3: '', vr_ciam3: ''},
                item4: {item4: '', vr_od4: '', nom_4: '', vr_ciam4: ''},
                valor_total: ''},
              doc_entregados: {
                  prof_nom: { a: false, d: false, e: false, f: false, g: false, h: false, i: false, j: false},
                  prof_int: {a: false, b: false, c: false, h: false, i: false, j: false},
                  est_univ: {g: false, h: false, i: false, j: false}

              }
   }

   comites = [];

   user = JSON.parse(localStorage.getItem('usuario'));

   fechas = [{name: 'Comite 1 | Movilidades del 7 de mayo al 3 de junio', fecha: '2018-03-23'}];
            //  {name: 'Comite 2 | Movilidades del 4 de junio al 1 de julio', fecha: '2018-04-27'},
            //  {name: 'Comite 3 | Movilidades del 2 de julio al 5 de agosto', fecha: '2018-05-24'},
            //  {name: 'Comite 4 | Movilidades del 6 de agosto al 2 de sept.', fecha: '2018-06-29'},
            //  {name: 'Comite 5 | Movilidades del 3 de sept. al 7 de octubre', fecha: '2018-07-27'},
            //  {name: 'Comite 6 | Movilidades del 8 de oct. al 4 de noviembre', fecha: '2018-08-31'},
            //  {name: 'Comite 7 | Movilidades del 5 de nov. al 2 de dic.', fecha: '2018-09-28'},
            //  {name: 'Comite 8 | Movilidades del 3 de dic al 28 de febrero 2019', fecha: '2018-10-26'}];

;


  constructor(private busqueda: BuscadorService, private ruta: Router, private modal: ModalService,
              private http: Http, private completerService: CompleterService) {

    console.log(this.user);

  }

  // tslint:disable-next-line:whitespace
  // tslint:disable-next-line:member-ordering
  // tslint:disable-next-line:quotemark
  // tslint:disable-next-line:max-line-length
  protected paises = ["Afghanistan", "Albania", "Argelia", "Alemania", "American Samoa", "Andorra", "Angola", "Anguilla", "Antartida", "Antigua y Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia-Herzegovina", "Botswana", "Bouvet Island", "Brasil", "Brit Ind Ocean Territory", "Brunei Darussalm", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Canary Islands", "Cape Verde", "Caymen Islands", "Central African Rep", "Chad", "Chile", "China", "Christmas Islands", "Cocos Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Chipre", "Dem Rep. of Korea", "Dinamarca", "Djibouti", 'Dominica', 'East Timor', 'Ecuador', 'Egipto', 'El Salvador', 'Eritrea', 'España', 'Estados Unidos de America', 'Estonia', 'Etiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'Francia', 'Guiana Francesa', 'Polynesia Francesa', 'French So. Territories', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Gibraltar', 'Guinea Equatorial', 'Grecia', 'Greenland', 'Grenada', 'Guadalupe', 'Guatemala', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Heard, McDonald Island', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Inglaterra', 'Iran', 'Iraq', 'Ireland', 'Islas Filipinas', 'Israel', 'Italia', 'Ivory Coast', 'Jamaica', 'Japon', 'Jordan', 'Kazakhistan', 'Kenia', 'Kiribati', 'Korea del Norte', 'Kuwait', 'Kyrqyzstan', 'Laos', 'Lativa', 'Libano', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldivas', 'Mali', 'Malta', 'Mariana Islands', 'Marruecos', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montserrat', 'Mozambique', 'Myanmar', 'Nambia', 'Nauru', 'Nepal', 'Netherland Antilles', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue Island', 'Norfolk Island', 'Northern Mariana Island', 'Norway', 'OCE', 'Oman', 'Pacific Islands', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reino Unido', 'Republica de Corea', 'Republica Dominicana', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'South Georgia Sandwich', 'Saint Pierre Miguelon', 'Samoa', 'San Marino', 'Sao Tomee and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierre Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somali Republic', 'South Africa', 'South Korea', 'Sri Lanka', 'St. Helena', 'St. Kits-Nevis', 'St. Lucia', 'St. Vincent/Grenadines', 'Sudan', 'Suriname', 'Svalbard Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokeelau', 'Tonga', 'Trinidad Tobago', 'Tunisia', 'Turquia', 'Turkmenistan', 'Turks Caicos Islands', 'Tuvalu', 'Uganda', 'Ukrania', 'United Arab Emirates', 'Uruguay', 'US Minor Outlying Is.', 'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virgin Islands: British', 'Virgin Islands: US', 'Wallis Futuna Islands', 'Western Sahara', 'Western Samoa', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe'];


  ngOnInit() {
    this.modal.currentformularioInvest.subscribe(forma => {
       if (forma.length !== 0) {
         this.formulario = forma;
       }
     });

     this.consultarFecha();

     $('#selectDatosMov').on('change', function() {
       if (this.value === 'Profesor de Univalle') {
        $('.col1').removeAttr('disabled');
        $('.col2').attr('disabled', 'disabled');
        $('.col3').attr('disabled', 'disabled');
       } else if (this.value === 'Profesor visitante internacional') {
        $('.col2').removeAttr('disabled');
        $('.col1').attr('disabled', 'disabled');
        $('.col3').attr('disabled', 'disabled');
       } else {
        $('.col3').removeAttr('disabled');
        $('.col1').attr('disabled', 'disabled');
        $('.col2').attr('disabled', 'disabled');
       }

     });

     const scope = this;
     $('#selectCC').on('change', function() {
      if (this.value === 'nacional') {
        scope.formulario.datos_movilidad.nacionalidad = 'COLOMBIANA';
        scope.formulario.datos_movilidad.pais_or = 'COLOMBIA';
        $('#paor').attr('disabled', 'disabled');
        $('#nac').attr('disabled', 'disabled');

      } else {
        scope.formulario.datos_movilidad.nacionalidad = '';
        scope.formulario.datos_movilidad.pais_or = '';
        $('#paor').removeAttr('disabled');
        $('#nac').removeAttr('disabled');
      }

     });
  }

  cambiarFormulario(form) {
    this.modal.changeformularioInvestigacion(form);
  }

  crearInvestigacion() {
    this.ejecutarSpiner();
    this.busqueda.crearFormInvestigacion(this.user.uid, this.formulario).then(() => {
      swal({
        type: 'success',
        title: 'Formulario diligenciado exitosamente',
        text: '',
        showConfirmButton: true,
      });

        $('#modal3').modal('hide');
        this.inicializarForm();
    }).catch(function(error) {
      swal({
        type: 'error',
        title: 'Ocurrio un error, por favor intenar de nuevo',
        text: '',
        showConfirmButton: true,
      });
    });
  }

  consultarFecha() {

   let fecha: any;
   this.http.get('https://us-central1-siadriuv.cloudfunctions.net/consFecha').subscribe(data => {

     fecha = moment('' + data['_body']);

     for (let i = 0; i < this.fechas.length; i++) {
       const fechaVencimiento = moment(this.fechas[i].fecha);
       const diff = fechaVencimiento.diff(fecha, 'days');
       const duration = moment.duration(diff, 'days').asDays();

       console.log(duration);
      if (duration >= 0) {
        this.comites.push(this.fechas[i].name);
      }

     }
     console.log(this.comites);
   });

  }

  ejecutarSpiner() {
    $('#modal3').modal({backdrop: 'static', keyboard: false, show: true});
  }

  inicializarForm() {
    this.formulario = {comite: '', modalidad: '',
                      datos_solicitud: {nombre_prof: '', doc_prof: '', facultad: '', celu_prof: '', tel_univ: '', mail_prof: '', sicop: ''},
                      datos_movilidad: {categoria: '', nom_ape: '', CC_pas: '', nacionalidad: '', ciudad_or: '', ciudad_des: '', pais_or: '', pais_des: '', fecha_part: '', fecha_reg: ''},
                      tipo_movilidad: {tipo_mov: '', observaciones: '', justificacion: ''},
                      presupuesto: {
                        item1: {item1: '', vr_od1: '', nom_1: '', vr_ciam1: ''},
                        item2: {item2: '', vr_od2: '', nom_2: '', vr_ciam2: ''},
                        item3: {item3: '', vr_od3: '', nom_3: '', vr_ciam3: ''},
                        item4: {item4: '', vr_od4: '', nom_4: '', vr_ciam4: ''},
                        valor_total: ''},
                      doc_entregados: {
                          prof_nom: { a: false, d: false, e: false, f: false, g: false, h: false, i: false, j: false},
                          prof_int: {a: false, b: false, c: false, h: false, i: false, j: false},
                          est_univ: {g: false, h: false, i: false, j: false}

                      }
    }
  }

  // imprimirSolicitud() {

  //     var inputs = $('.input-texto');
  //     $.each(inputs,function (index,value) {
  //       $(this).attr('value',$(this).val());
  //     });
  //     // var inputs1 = $('.valor-numerico');
  //     // $.each(inputs1,function (index,value) {
  //     //   $(this).attr('value',$(this).val());
  //     // });
  //     // var inputs2 = $('textarea');
  //     // $.each(inputs2,function (index,value) {
  //     //   $(this).html($(this).val());
  //     // });
  //     var inputs3 = $('.checkbox');
  //     $.each(inputs3,function (index,value) {
  //       $(this).attr('checked',$(this).is(':checked'));
  //     });

  //       var printContents = document.getElementById('formulario-convenio').innerHTML;
  //       var scale = 'scale(0.999)';
  //       var w=window.open();
  //       w.document.write(printContents);
  //       w.document.head.style.transform = scale;
  //       w.document.body.style.transform = scale;
  //       w.print();
  //       w.close();

  // }
}
