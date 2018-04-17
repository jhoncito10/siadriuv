
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
              datos_solicitud: {nombre_prof: '', doc_prof: '', facultad: '', sede:'', celu_prof: '', tel_univ: '', direccion:'',mail_prof: '', sicop: '', grupinv:''},
              datos_movilidad: {categoria: '', nom_ape: '', CC_pas: '', direccion:'', nacionalidad: '', ciudad_or: '', ciudad_des: '', pais_or: '', pais_des: '', fecha_part: '', fecha_reg: ''},
              tipo_movilidad: {tipo_mov: '', observaciones: '', justificacion: ''},
              presupuesto: {
                item1: {item1: '', vr_od1: '', nom_1: '', vr_ciam1: ''},
                item2: {item2: '', vr_od2: '', nom_2: '', vr_ciam2: ''},
                item3: {item3: '', vr_od3: '', nom_3: '', vr_ciam3: ''},
                item4: {item4: '', vr_od4: '', nom_4: '', vr_ciam4: ''},
                valor_total: ''},
              doc_entregados: {
                  mod_1: {item1: false, item2: false, item3: false, item4: false, item5: false},
                  mod_2: {item1: false, item2: false, item3: false, item4: false, item5: false, item6: false, item7: false}

              }
   }

   comites = [];

   user = JSON.parse(localStorage.getItem('usuario'));

   fechas = [{name: 'Comite 1 | Movilidades del 7 de mayo al 3 de junio', fecha: '2018-03-23'},
              {name: 'Comite 2 | Movilidades del 4 de junio al 1 de julio', fecha: '2018-04-27'},
              {name: 'Comite 3 | Movilidades del 2 de julio al 5 de agosto', fecha: '2018-05-24'},
              {name: 'Comite 4 | Movilidades del 6 de agosto al 2 de sept.', fecha: '2018-06-29'},
              {name: 'Comite 5 | Movilidades del 3 de sept. al 7 de octubre', fecha: '2018-07-27'},
              {name: 'Comite 6 | Movilidades del 8 de oct. al 4 de noviembre', fecha: '2018-08-31'},
              {name: 'Comite 7 | Movilidades del 5 de nov. al 2 de dic.', fecha: '2018-09-28'},
              {name: 'Comite 8 | Movilidades del 3 de dic al 28 de febrero 2019', fecha: '2018-10-26'}];

   impresion = false;

   modalidad = false;


  constructor(private busqueda: BuscadorService, private ruta: Router, private modal: ModalService,
              private http: Http, private completerService: CompleterService) {

    console.log(this.user);

  }

  // tslint:disable-next-line:whitespace
  // tslint:disable-next-line:member-ordering
  // tslint:disable-next-line:quotemark
  // tslint:disable-next-line:max-line-length
   paises = ["Afghanistan", "Albania", "Argelia", "Alemania", "American Samoa", "Andorra", "Angola", "Anguilla", "Antartida", "Antigua y Barbuda", "Argentina", "Armenia", "Aruba", 'Australia', 'Austria', "Azerbaijan", 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia-Herzegovina', 'Botswana', 'Bouvet Island', 'Brasil', 'Brit Ind Ocean Territory', 'Brunei Darussalm', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Canary Islands', 'Cape Verde', 'Caymen Islands', 'Central African Rep', 'Chad', 'Chile', 'China', 'Christmas Islands', 'Cocos Islands', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Croatia', 'Cuba', 'Chipre', 'Dem Rep. of Korea', 'Dinamarca', 'Djibouti', 'Dominica', 'East Timor', 'Ecuador', 'Egipto', 'El Salvador', 'Eritrea', 'España', 'Estados Unidos de America', 'Estonia', 'Etiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'Francia', 'Guiana Francesa', 'Polynesia Francesa', 'French So. Territories', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Gibraltar', 'Guinea Equatorial', 'Grecia', 'Greenland', 'Grenada', 'Guadalupe', 'Guatemala', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Heard, McDonald Island', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Inglaterra', 'Iran', 'Iraq', 'Ireland', 'Islas Filipinas', 'Israel', 'Italia', 'Ivory Coast', 'Jamaica', 'Japon', 'Jordan', 'Kazakhistan', 'Kenia', 'Kiribati', 'Korea del Norte', 'Kuwait', 'Kyrqyzstan', 'Laos', 'Lativa', 'Libano', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldivas', 'Mali', 'Malta', 'Mariana Islands', 'Marruecos', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montserrat', 'Mozambique', 'Myanmar', 'Nambia', 'Nauru', 'Nepal', 'Netherland Antilles', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue Island', 'Norfolk Island', 'Northern Mariana Island', 'Norway', 'OCE', 'Oman', 'Pacific Islands', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reino Unido', 'Republica de Corea', 'Republica Dominicana', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'South Georgia Sandwich', 'Saint Pierre Miguelon', 'Samoa', 'San Marino', 'Sao Tomee and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierre Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somali Republic', 'South Africa', 'South Korea', 'Sri Lanka', 'St. Helena', 'St. Kits-Nevis', 'St. Lucia', 'St. Vincent/Grenadines', 'Sudan', 'Suriname', 'Svalbard Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokeelau', 'Tonga', 'Trinidad Tobago', 'Tunisia', 'Turquia', 'Turkmenistan', 'Turks Caicos Islands', 'Tuvalu', 'Uganda', 'Ukrania', 'United Arab Emirates', 'Uruguay', 'US Minor Outlying Is.', 'Uzbekistan', 'Vanuatu', 'Vatican City State', 'Venezuela', 'Vietnam', 'Virgin Islands: British', 'Virgin Islands: US', 'Wallis Futuna Islands', 'Western Sahara', 'Western Samoa', 'Yemen', 'Yugoslavia', 'Zaire', 'Zambia', 'Zimbabwe'];


  ngOnInit() {
    this.modal.currentformularioInvest.subscribe(forma => {
       if (forma.length !== 0) {
         this.formulario = forma;
       }
     });

     this.consultarFecha();

     const scope = this;

     $('#selectDatosMov').on('change', function() {
       if (this.value === 'Profesor de Univalle' || this.value === 'Profesor visitante internacional') {
        scope.modalidad = false;
       } else {
        scope.modalidad = true;
       }

     });


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
    if ( this.formulario.datos_movilidad.fecha_part === '' || this.formulario.datos_movilidad.fecha_reg === '') {
      swal({
        type: 'error',
        title: 'Debe Diligenciar la fecha de Regreso y Partida',
        text: '',
        showConfirmButton: true,
      });
    } else if (this.formulario.comite === '' || this.formulario.modalidad === '') {
      swal({
        type: 'error',
        title: 'Debe Seleccionar el Comite y la Modalidad a la que aplica',
        text: '',
        showConfirmButton: true,
      });
    } else {
      this.ejecutarSpiner();
      this.busqueda.crearFormInvestigacion(this.user.uid, this.formulario).then(() => {
        swal({
          type: 'success',
          title: 'Formulario diligenciado exitosamente',
          text: '',
          showConfirmButton: true,
        });

          $('#modal3').modal('hide');

          this.impresion = true;
      }).catch(function(error) {
        swal({
          type: 'error',
          title: 'Ocurrio un error, por favor intenar de nuevo',
          text: '',
          showConfirmButton: true,
        });
      });

    }

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
        break;
      }

     }

   });

  }

  ejecutarSpiner() {
    $('#modal3').modal({backdrop: 'static', keyboard: false, show: true});
  }

  inicializarForm() {
    this.formulario = {comite: '', modalidad: '',
              datos_solicitud: {nombre_prof: '', doc_prof: '', facultad: '', sede:'', celu_prof: '', tel_univ: '', direccion:'',mail_prof: '', sicop: '', grupinv:''},
              datos_movilidad: {categoria: '', nom_ape: '', CC_pas: '', direccion:'', nacionalidad: '', ciudad_or: '', ciudad_des: '', pais_or: '', pais_des: '', fecha_part: '', fecha_reg: ''},
              tipo_movilidad: {tipo_mov: '', observaciones: '', justificacion: ''},
              presupuesto: {
                item1: {item1: '', vr_od1: '', nom_1: '', vr_ciam1: ''},
                item2: {item2: '', vr_od2: '', nom_2: '', vr_ciam2: ''},
                item3: {item3: '', vr_od3: '', nom_3: '', vr_ciam3: ''},
                item4: {item4: '', vr_od4: '', nom_4: '', vr_ciam4: ''},
                valor_total: ''},
              doc_entregados: {
                mod_1: {item1: false, item2: false, item3: false, item4: false, item5: false},
                mod_2: {item1: false, item2: false, item3: false, item4: false, item5: false, item6: false, item7: false}

              }
   }
  }

  imprimir() {

    const ambiente = this;

    if (this.impresion) {
        const inputs = $('input[type="text"]');
        $.each(inputs, function (index, value) {
          $(this).attr('value', $(this).val());
        });

        const inputs1 = $('.input');
        $.each(inputs1, function (index, value) {
          $(this).attr('value', $(this).val());
        });

        const inputs2 = $('textarea');
        $.each(inputs2, function (index, value) {
          $(this).html($(this).val());
        });
        const inputs3 = $('input[type="checkbox"]');
        $.each(inputs3, function (index, value) {
          $(this).attr('checked', $(this).is(':checked'));
        });
        const inputs5 = $('input[type="date"]');
        $.each(inputs5, function (index, value) {
          $(this).attr('value', $(this).val());
        });

        const inputs4 = $('.sel');
        $.each(inputs4, function (index, value) {
          const valor = $(this).val();
          // tslint:disable-next-line:max-line-length
          $(this).find('option[value="' + valor + '"]').attr('selected', true);
        });

      const divContents = $('#div2').html();
      const printWindow = window.open('', '', 'height=400,width=800');
      printWindow.document.write('<html><head><title>DIV Contents</title>');
      printWindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
      printWindow.document.write('<link rel="stylesheet" type="text/css" media="print" href="assets/css/print.css">');
      printWindow.document.write('</head><body >');
      printWindow.document.write(divContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      setTimeout(function() {
        printWindow.print();
        ambiente.inicializarForm();
      }, 1000);


    } else {
      swal({
        type: 'error',
        title: 'Debe Enviar Primero el formulario',
        text: '',
        showConfirmButton: true,
      });
    }

  }

  formato() {
    // tslint:disable-next-line:max-line-length
    const url = 'https://docs.google.com/a/correounivalle.edu.co/forms/d/e/1FAIpQLSfgJphqH_jcU9vNaBhbYEPxe6KLzDyYyhkbFa9dpN3IgC2B3g/viewform?c=0&w=1';
    const a = document.createElement('a');
		// tslint:disable-next-line:indent
		a.target = '_blank';
		a.href = url;
		a.click();
  }

  sumaTotal() {
    let suma = 0;
    let dato;
    let dato2;
    for (let i = 1; i <= 4; i++) {
      if (this.formulario.presupuesto['item' + i]['vr_od' + i] !== '') {
         dato = Number.parseInt(this.formulario.presupuesto['item' + i]['vr_od' + i]);
      } else {dato = 0; }

      if (this.formulario.presupuesto['item' + i]['vr_ciam' + i] !== '') {
          dato2 = Number.parseInt(this.formulario.presupuesto['item' + i]['vr_ciam' + i]);
      } else {dato2 = 0; }

      suma += dato + dato2;
    }

    this.formulario.presupuesto.valor_total = suma.toString();


  }




}
