import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService } from "../../../../shared/services/main-service.service";
import { element } from 'protractor';
@Component({
  selector: 'app-pares-externos-salientes',
  templateUrl: './pares-externos-salientes.component.html',
  styleUrls: ['./pares-externos-salientes.component.css']
})
export class ParesExternosSalientesComponent implements OnInit {

  //datos consulta
  solicitudes: any;
  // solicitud selecionada
  solicitud: any;
  // variable para la instacia de realtime databe de firebase
  db: any
  //datos de la tabla
  dataTablaSolicitudes = [];

  displayedColumns = ['correo', 'ano', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaSolicitudesCarrera: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;

  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService: MailServiceService) {
    this.db = firebaseApp.database();
    this.solicitudes = {}

    this.solicitud = {
      "AÑO": 0,
      "NOMBRE": "",
      "ID_SEXO_BIOLOGICO": "",
      "ID_ESTADO_CIVIL": "",
      "FECHA_NACIMIENTO": "",
      "Correo electrónico": "",
      "TIPO DE IDENTIFICACIÓN": "",
      "NÚMERO DE IDENTIFICACIÓN": "",
      "CÓDIGO DEL ESTUDIANTE EN UNIVALLE": "",
      "PERIODO ACADÉMICO": 0,
      "TIPO DE MOVILIDAD": "ENTRANTE",
      "TIPO DE CONVENIO": "",
      "CODIGO_CONVENIO": "",
      "MODALIDAD": "",
      "NUM_DIAS_MOVILIDAD": "",
      "TIPO DE PROGRAMA - CONVOCATORIA": "",
      "NIVEL DE FORMACIÓN DEL ESTUDIANTE DE ORIGEN": "",
      "NIVEL DE FORMACIÓN DE LA MOVILIDAD": "",
      "PAÍS DE ORIGEN": "",
      "UNIVERSIDAD DE PROCEDENCIA": this.universidadProcedencia,
      "CIUDAD-SEDE": "",
      "PAÍS DE DESTINO": "",
      "UNIVERSIDAD - INSTITUCIÓN RECEPTORA": "UNIVERSIDAD DEL VALLE",
      "PROGRAMA ACADÉMICO DE ORIGEN": "",
      "CÓDIGO DEL PROGRAMA": "",
      "PROGRAMA ACADÉMICO DE DESTINO (1)": "",
      "PROGRAMA ACADÉMICO DE DESTINO (2)": "",
      "FINANCIAMIENTO": "NO APLICA",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": ""
    }
  }

  ngOnInit() {
    this.consultaDatosTabla()

  }
  consultaDatosTabla() {
    this.db.ref('/postulaciones/')
      .orderByChild("TIPO DE MOVILIDAD")
      .equalTo('ENTRANTE')
      .once('value', solicitudesSnap => {
        this.dataTablaSolicitudes = [];
        console.log('consulta tabla', solicitudesSnap)

        solicitudesSnap.forEach((solicitudSnap) => {

          let dato = solicitudSnap.val()
          console.log(dato)
          if (dato['UNIVERSIDAD DE PROCEDENCIA'] == this.universidadProcedencia) {
            this.solicitudes[solicitudSnap.key] = dato
            let correo = dato['Correo electrónico'] || ''
            let ano = dato['AÑO'] || ''
            let nombre = dato['NOMBRE'] || ''
            let estado = dato.estado || 'Pendiente'
            let destino = dato['PROGRAMA ACADÉMICO DE DESTINO (1)'] || 'Ninguno'
            let comentarioDenegacion = dato['comentarioDenegacion'] || ''

            this.dataTablaSolicitudes.push({
              correo: correo,
              ano: ano,
              destino: destino,
              nombre: nombre,
              key: solicitudSnap.key,
              estado: estado,
              comentarioDenegacion: comentarioDenegacion
            })


          }




        })

        this.dataSource = new MatTableDataSource(this.dataTablaSolicitudes);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.tablaSolicitudesCarrera.nativeElement.classList.contains('collapsed-box')) {
          this.panelSuperiorButton.nativeElement.click()
        }
      }).catch((error) => console.log(`${error}`))
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectSolicitud(solic) {
    this.estadoComponenteInferior = 2

    const _convenioSelected = this.solicitudes[solic.key];
    this.solicitud = _convenioSelected
    this.solicitud.key = solic.key
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

  }

  nuevaSolicitud() {
    this.estadoComponenteInferior = 1
    this.setsolicitud()
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();
  }

  crearSolicitud() {
    console.log(this.validarDatosFormlario())
    if (this.validarDatosFormlario()) {
      var ref = this.db.ref('/postulaciones/').push()

      ref.set(this.solicitud).then((res) => {
        swal(
          'Solicitud creada correctamente',
          '',
          'success'
        )
      }).catch(error => {
        swal(
          `${error}`,
          '',
          'error'
        )
        console.log(error)
      })
    }

  }

  setsolicitud() {
    this.solicitud = {
      "AÑO": 0,
      "NOMBRE": "",
      "ID_SEXO_BIOLOGICO": "",
      "ID_ESTADO_CIVIL": "",
      "FECHA_NACIMIENTO": "",
      "Correo electrónico": "",
      "TIPO DE IDENTIFICACIÓN": "",
      "NÚMERO DE IDENTIFICACIÓN": "",
      "CÓDIGO DEL ESTUDIANTE EN UNIVALLE": "",
      "PERIODO ACADÉMICO": 0,
      "TIPO DE MOVILIDAD": "ENTRANTE",
      "TIPO DE CONVENIO": "",
      "CODIGO_CONVENIO": "",
      "MODALIDAD": "",
      "NUM_DIAS_MOVILIDAD": "",
      "TIPO DE PROGRAMA - CONVOCATORIA": "",
      "NIVEL DE FORMACIÓN DEL ESTUDIANTE DE ORIGEN": "",
      "NIVEL DE FORMACIÓN DE LA MOVILIDAD": "",
      "PAÍS DE ORIGEN": "",
      "UNIVERSIDAD DE PROCEDENCIA": this.universidadProcedencia,
      "CIUDAD-SEDE": "",
      "PAÍS DE DESTINO": "",
      "UNIVERSIDAD - INSTITUCIÓN RECEPTORA": "UNIVERSIDAD DEL VALLE",
      "PROGRAMA ACADÉMICO DE ORIGEN": "",
      "CÓDIGO DEL PROGRAMA": "",
      "PROGRAMA ACADÉMICO DE DESTINO (1)": "",
      "PROGRAMA ACADÉMICO DE DESTINO (2)": "",
      "FINANCIAMIENTO": "NO APLICA",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": ""
    }
  }

  validarDatosFormlario() {
    if (this.solicitud["NOMBRE"] == '') {
      swal(
        'El campo nombre no puede estar vacio',
        '',
        'error'
      )
      return false
    } else if (this.solicitud["FECHA_NACIMIENTO"] == '') {
      swal(
        'El campo fecha de nacimiento no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else if (this.solicitud["Correo electrónico"] == '') {
      swal(
        'El campo correo electronico no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else if (this.solicitud["IDENTIFICACIÓN"] == '') {
      swal(
        'El campo identificación no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else if (this.solicitud["NÚMERO DE IDENTIFICACIÓN"] == '') {
      swal(
        'El campo número de identificación no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else if (this.solicitud["PROGRAMA ACADÉMICO DE DESTINO (1)"] == '') {
      swal(
        'El campo programa académico de destino no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else if (this.solicitud["TIPO DE PROGRAMA - CONVOCATORIA"] == '') {
      swal(
        'El campo tipo de programa - convocatoria  no puede estar vacio',
        '',
        'error'
      )
      return false
    }
    else {
      return true

    }
  }

  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }
}
