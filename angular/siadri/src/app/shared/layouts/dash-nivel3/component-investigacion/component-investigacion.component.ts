
import { BuscadorService } from 'app/shared/layouts/modal-popup/buscador.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import swal from 'sweetalert2';
import * as jsonexport from 'jsonexport/dist'

 declare var $: any;

@Component({
  selector: 'app-component-investigacion',
  templateUrl: './component-investigacion.component.html',
  styleUrls: ['./component-investigacion.component.css']
})
export class ComponentInvestigacionComponent implements OnInit {

  dtTrigger = new Subject();
  consulta: any;
  investigaciones: any;

  excel = [];

  dtOptions: any = {};

  constructor(private busqueda: BuscadorService) {

   }

  ngOnInit() {
    this.busqueda.getInvestigaciones().subscribe(data => {
      this.investigaciones = data;
      this.dtTrigger.next();
    });


       $('.table tbody').on( 'click', 'tr', function () {
           $(this).toggleClass('selected');
       } );

      this.loadTable();

      $('#checkall').on('change', function() {
        const value = $('#checkall').is(':checked');
        console.log(value);
        if (value) {
          console.log('true');
          $('.checkbox').prop('checked', 'checked');
        } else {
          console.log('false');
          $('.checkbox').prop('checked', false);
        }
      });


  }

  loadTable() {
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'columnsToggle',
        'colvis',
        'copy',
        'print',
        'csv',
        {
          text: 'Some button',
          key: '1',
          action: function (e, dt, node, config) {
            alert('Button activated');
          }
        }
      ],
      retrieve: true
    };
  }

  cargarArreglo(item:any){
   this.excel.push(item);
  }

  mostrar(){
    this.excel = [];
    const compinv = this;
    const inputs = $('.checkbox');
    $.each(inputs, function (index, value) {
      if ($(this).is(':checked') === true) {
        const item = compinv.buscarItem($(this).val());
        compinv.cargarArreglo(item);
      }
    });
   if(this.excel.length !== 0) {
    this.metodo(this.excel);
   } else {
    swal({
      type: 'warning',
      title: 'Debe seleccionar almenos una fila',
      text: '',
      showConfirmButton: true,
    });

   }

  }


  buscarItem(key: any) {
    for (let i =0;i < this.investigaciones.length; i++) {
      if (this.investigaciones[i].$key === key) {
        return this.investigaciones[i];
      }
    }
  }

  metodo(array: any) {
    const options = {
      rowDelimiter: ';',
      // tslint:disable-next-line:max-line-length
      headers: ['form.comite', 'form.modalidad', 'form.datos_movilidad.CC_pas', 'form.datos_movilidad.nom_ape', 'form.datos_movilidad.categoria', 'form.datos_movilidad.nacionalidad', 'form.datos_movilidad.direccion', 'form.datos_movilidad.fecha_part', 'form.datos_movilidad.fecha_reg', 'form.datos_movilidad.pais_des', 'form.datos_movilidad.pais_or', 'form.datos_movilidad.ciudad_des', 'form.datos_movilidad.ciudad_or',
                // tslint:disable-next-line:max-line-length
                'form.datos_solicitud.doc_prof', 'form.datos_solicitud.nombre_prof', 'form.datos_solicitud.facultad', 'form.datos_solicitud.sede', 'form.datos_solicitud.sicop', 'form.datos_solicitud.direccion', 'form.datos_solicitud.tel_univ', 'form.datos_solicitud.celu_prof', 'form.datos_solicitud.mail_prof',
                // tslint:disable-next-line:max-line-length
                'form.doc_entregados.est_univ.g', 'form.doc_entregados.est_univ.h', 'form.doc_entregados.est_univ.i', 'form.doc_entregados.est_univ.j',
                'form.doc_entregados.prof_int.b', 'form.doc_entregados.prof_int.i', 'form.doc_entregados.prof_int.j',
                // tslint:disable-next-line:max-line-length
                'form.doc_entregados.prof_nom.a', 'form.doc_entregados.prof_nom.c', 'form.doc_entregados.prof_nom.d', 'form.doc_entregados.prof_nom.e', 'form.doc_entregados.prof_nom.f', 'form.doc_entregados.prof_nom.g', 'form.doc_entregados.prof_nom.i', 'form.doc_entregados.prof_nom.j',
                 // tslint:disable-next-line:max-line-length
                 'form.presupuesto.item1.item1', 'form.presupuesto.item1.nom_1', 'form.presupuesto.item1.vr_ciam1', 'form.presupuesto.item1.vr_od1',
                 // tslint:disable-next-line:max-line-length
                 'form.presupuesto.item2.item2', 'form.presupuesto.item2.nom_2', 'form.presupuesto.item2.vr_ciam2', 'form.presupuesto.item2.vr_od2',
                 // tslint:disable-next-line:max-line-length
                 'form.presupuesto.item3.item3', 'form.presupuesto.item3.nom_3', 'form.presupuesto.item3.vr_ciam3', 'form.presupuesto.item3.vr_od3',
                 // tslint:disable-next-line:max-line-length
                 'form.presupuesto.item4.item4', 'form.presupuesto.item4.nom_4', 'form.presupuesto.item4.vr_ciam4', 'form.presupuesto.item4.vr_od4',
                 // tslint:disable-next-line:max-line-length
                 'form.presupuesto.valor_total', 'form.tipo_movilidad.justificacion', 'form.tipo_movilidad.observaciones', 'form.tipo_movilidad.tipo_mov', 'uid_diligenciado'],
      // tslint:disable-next-line:whitespace
      // tslint:disable-next-line:max-line-length
      rename: ['COMITE', 'MODALIDAD', 'DM CEDULA', 'DM NOMBRE Y APELLIDOS', 'DM CATEGORIA', 'DM NACIONALIDAD', 'DM DIRECCION', 'DM FECHA PARTIDA', 'DM FECHA REGRESO', 'DM PAIS DESTINO', 'DM PAIS ORIGEN', 'DM CIUDAD DESTINO', 'DM CIUDAD ORIGEN',
               // tslint:disable-next-line:max-line-length
               'DS DOCUMENTO', 'DS NOMBRE', 'DS FACULTAD', 'DS SEDE', 'DS SICOP', 'DS DIRECCION', 'DS TEL UNIVALLE', 'DS CELULAR', 'DS EMAIL',
              'DOCUMENTO EST.UNIV G', 'DOCUMENTO EST.UNIV H', 'DOCUMENTO EST.UNIV I', 'DOCUMENTO EST.UNIV J',
              'DOCUMENTO PROF.INT B', 'DOCUMENTO PROF.INT I', 'DOCUMENTO PROF.INT J',
              // tslint:disable-next-line:max-line-length
              'DOCUMENTO PROF.NOM A', 'DOCUMENTO PROF.NOM C', 'DOCUMENTO PROF.NOM D', 'DOCUMENTO PROF.NOM E', 'DOCUMENTO PROF.NOM F', 'DOCUMENTO PROF.NOM G', 'DOCUMENTO PROF.NOM I', 'DOCUMENTO PROF.NOM J',
              'PRESUPUESTO I1-I1', 'PRESUPUESTO I1-NOM', 'PRESUPUESTO I1-CIAM', 'PRESUPUESTO I1-V-OD',
              'PRESUPUESTO I2-I2', 'PRESUPUESTO I2-NOM', 'PRESUPUESTO I2-CIAM', 'PRESUPUESTO I2-V-OD',
              'PRESUPUESTO I3-I3', 'PRESUPUESTO I3-NOM', 'PRESUPUESTO I3-CIAM', 'PRESUPUESTO I3-V-OD',
              'PRESUPUESTO I4-I4', 'PRESUPUESTO I4-NOM', 'PRESUPUESTO I4-CIAM', 'PRESUPUESTO I4-V-OD',
              'PRESUPUESTO VALOR TOTAL', 'TM JUSTIFICACION', 'TM OBSERVACIONES', 'TIPO MOVILIDAD', 'ID DILIGENCIADOR'],
      booleanTrueString: 'SI',
      booleanFalseString: 'NO'
    };
    jsonexport(array, options, function(err, csv) {
      if (err) { return console.log(err); }

      console.log(csv);
      const file = new File([csv], 'Reporte.csv', {type: 'text/plain;charset=utf-8'});

      // obtienes una URL para el fichero que acabas de crear
      const url  = window.URL.createObjectURL(file);

      // // creas un enlace y lo añades al documento
      const a = document.createElement('a');

      // actualizas los parámetros del enlace para descargar el fichero creado
      a.href = url;
      a.download = file.name;
      a.click();

  });
  }

}
