import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MailServiceService } from "../../../shared/services/main-service.service";
import * as  moment from "moment";


@Component({
  selector: 'app-directores-programa-uv',
  templateUrl: './directores-programa-uv.component.html',
  styleUrls: ['./directores-programa-uv.component.css']
})
export class DirectoresProgramaUvComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('usuario'));
  programaDir = []
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

  programaAcademicoDestino = 'BIOLOGÍA'

  programasAcademicos = []

  estadoComponent

  rowSelected
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
    this.estadoComponent = 0

    this.setsolicitud()
  }

  ngOnInit() {
    this.getProgramasDir().then(() => {
      if (this.programaDir.length > 0) {
        this.consultaDatosTabla()

      }

    })

  }
  consultaDatosTabla() {
    for (let index = 0; index < this.programaDir.length; index++) {
      const element = this.programaDir[index];
      this.dataTablaSolicitudes = [];

      this.db.ref('/postulaciones/')
        .orderByChild("PROGRAMA ACADÉMICO DE DESTINO (1)")
        .equalTo(element)
        .once('value')
        .then(solicitudesSnap => {
          solicitudesSnap.forEach((solicitudSnap) => {
            let dato = solicitudSnap.val()
            console.log(dato['PROGRAMA ACADÉMICO DE DESTINO (1)'])
            if (
              dato['TIPO DE MOVILIDAD'] == 'ENTRANTE'
            ) {
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
        }).catch((error) => console.log(`${error}`))
    }
    if (this.tablaSolicitudesCarrera.nativeElement.classList.contains('collapsed-box')) {
      this.panelSuperiorButton.nativeElement.click()
    }

  }


  getProgramasDir() {
    return this.db.ref('/programasAcademicos/')
      .orderByChild("correo")
      .equalTo(this.user.email)
      .once('value', programasAcademicosSnap => {
        console.log(programasAcademicosSnap.val())
        var programas = programasAcademicosSnap.val()

        for (const program in programas) {
          if (programas.hasOwnProperty(program)) {
            const element = programas[program];
            this.programaDir.push(element['NOMBRE PROGRAMA ACADEMICO'])
          }
        }

      }).catch((error) => console.log(`${error}`))
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectSolicitud(row) {
    this.rowSelected = row;

    const _convenioSelected = this.solicitudes[row.key];
    this.solicitud = _convenioSelected
    this.solicitud.key = row.key
    this.estadoComponent = 1

    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

  }


  aprobar() {
    swal.showLoading()
    // var _this = this

    const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update({
      estado: 'Aprobada por dirección de programa',
      fechaActualizado: moment().format('DD/MM/YYYY HH	:mm')
    });
    promise
      .then(res => {
        if (this.solicitud['Correo electrónico'] != '') {
          var body = 'cuerpo del correo de aceptacion'

          return this.enviarCorreo(this.solicitud['Correo electrónico'], "Solicitud Aprobada por el director de programa", body)
            .subscribe((responseData) => {
              console.log(responseData)

              if (responseData) {
                swal({
                  title: `Solicitud actualizada`
                })
              } else {
                swal({
                  title: `Solicitud actualizada`
                })
              }

            }, error => {

              console.log(error)
            })
        } else {
          swal({
            title: `Solicitud actualizada`
          })
          return
        }


      })
      .then(() => {
        this.consultaDatosTabla()

      })
      .catch(err => {
        swal({
          title: `${err}`
        })
        console.log(err, 'You dont have access!')
      });

  }

  denegar() {
    // var _this = this
    var mensajeDenegacion = ''
    const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`);

    swal({
      title: 'Comentario',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      showLoaderOnConfirm: true,
      preConfirm: (mensaje) => {
        mensajeDenegacion = mensaje
        return promise.update({
          estado: 'Denegada por la dirección de programa',
          comentarioDenegacion: `${mensaje}`
        })

      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if (this.solicitud['Correo electrónico'] != '') {
          var body = `cuerpo del correo de la razon por la cual la solicitud es denegada 
          ${result} -- ${mensajeDenegacion}`

          return this.enviarCorreo(this.solicitud['Correo electrónico'], "Solicitud denegada por el director de programa", body)
            .subscribe((responseData) => {
              console.log(responseData)

              if (responseData) {
                swal({
                  title: `Solicitud actualizada`
                })
              } else {
                swal({
                  title: `Solicitud actualizada`
                })
              }

            }, error => {

              console.log(error)
            })
        } else {
          swal({
            title: `Solicitud actualizada`
          })
          return
        }

      }
    })
      .then(() => {
        this.consultaDatosTabla()

      })
      .catch(error => {
        console.log(error)

      })
  }

  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }

  removeDups(names) {
    let unique = {};
    names.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  setsolicitud() {
    this.solicitud = {
      "NOMBRE": "",
      "ID_SEXO_BIOLOGICO": "",
      "ID_ESTADO_CIVIL": "",
      "FECHA_NACIMIENTO": "",
      "Correo electrónico": "",
      "TIPO DE IDENTIFICACIÓN": "",
      "NÚMERO DE IDENTIFICACIÓN": "",
      "CÓDIGO DEL ESTUDIANTE EN UNIVALLE": "",
      "PERIODO ACADÉMICO": 0,
      "TIPO DE CONVENIO": "",
      "CODIGO_CONVENIO": "",
      "MODALIDAD": "",
      "NUM_DIAS_MOVILIDAD": "",
      "TIPO DE PROGRAMA - CONVOCATORIA": "",
      "NIVEL DE FORMACIÓN DEL ESTUDIANTE DE ORIGEN": "",
      "NIVEL DE FORMACIÓN DE LA MOVILIDAD": "",
      "PAÍS DE ORIGEN": "",
      "CIUDAD-SEDE": "",
      "PAÍS DE DESTINO": "",
      "UNIVERSIDAD - INSTITUCIÓN RECEPTORA": "",
      "PROGRAMA ACADÉMICO DE ORIGEN": "",
      "CÓDIGO DEL PROGRAMA": "",
      "PROGRAMA ACADÉMICO DE DESTINO (1)": "",
      "PROGRAMA ACADÉMICO DE DESTINO (2)": "",
      "FINANCIAMIENTO": "NO APLICA",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": "",
      "urlFile1": "",
      "urlFile2": "",
      "urlFile3": "",
      "fechaActualizado": "",
      "estado": "En espera de aprobación DRI"
    }
  }

}
