import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService, NativeFirebaseService } from "../../../shared/services/main-service.service";
import * as  moment from "moment";
import { environment } from "../../../../environments/environment";
import * as firebase from "firebase";
@Component({
  selector: 'app-admin-post-entrantes',
  templateUrl: './admin-post-entrantes.component.html',
  styleUrls: ['./admin-post-entrantes.component.css']
})
export class AdminPostEntrantesComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('usuario'));
  //datos consulta
  solicitudes: any;
  // solicitud selecionada
  solicitud: any;
  // variable para la instacia de realtime databe de firebase
  db: any
  //datos de la tabla
  firebaseStorage: any
  dataTablaSolicitudes = [];
  displayedColumns = ['correo', 'ano', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;
  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'
  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud
  year
  rowSelected 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaSolicitudesCarrera: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  @ViewChild('fileInput3') fileInput3: ElementRef;



  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService: MailServiceService,
    private _NativeFirebaseService: NativeFirebaseService
  ) {
    this.db = firebaseApp.database();
    this.firebaseStorage = this._NativeFirebaseService.fb.storage();
    this.solicitudes = {}
    this.year = moment().year()
    this.setsolicitud()
  }

  ngOnInit() {
    this.consultaDatosTabla()

  }

  consultaDatosTabla() {
    this.db.ref('/postulaciones/')
      // .orderByChild("estado")
      // .equalTo('Aprobada por el director de programa')
      .once('value', solicitudesSnap => {
        this.dataTablaSolicitudes = [];
        console.log('consulta tabla', solicitudesSnap.val())
        solicitudesSnap.forEach((solicitudSnap) => {
          let dato = solicitudSnap.val()

          if (dato.hasOwnProperty('creadoPor')) {
          this.solicitudes[solicitudSnap.key] = dato
          let correo = dato['Correo electrónico'] || ''
          let ano = dato['AÑO'] || ''
          let nombre = dato['NOMBRE'] || ''
          let estado = dato.estado || 'Sin estado'
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
  selectSolicitud(row) {
    this.rowSelected = row;

    this.estadoComponenteInferior = 2

    const _convenioSelected = this.solicitudes[row.key];
    this.solicitud = _convenioSelected
    console.log(this.solicitud)
    this.solicitud.key = row.key
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();


  }
  aprobarSolicitud(){
    swal.showLoading()
    // var _this = this

    const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update({
      estado: 'Aprobada por DRI UV',
      fechaActualizado: moment().format('DD/MM/YYYY HH:mm')
    });
    promise
      .then(res => {
        if (this.solicitud['Correo electrónico'] != '') {
          var body = 'cuerpo del correo de aceptacion'
          var correos = `${this.solicitud['Correo electrónico']}, ${environment.mails.dirDRI}`

          return this.enviarCorreo(correos, "Aprobada por DRI UV", body)
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
        let notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        this._mailServiceService
        .crearNotification(this.solicitud['Correo electrónico'],notificationInfo)
        .subscribe((responseData) => {
          console.log(responseData)

         

        }, error => {

          console.log(error)
        })
        this._mailServiceService
        .createNotificationPrograma(this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'],notificationInfo)
        .subscribe((responseData) => {
          console.log(responseData)

        

        }, error => {

          console.log(error)
        })
        // let notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        // this._mailServiceService.crearNotification(this.solicitud['Correo electrónico'],notificationInfo)
        // let notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        // this._mailServiceService.crearNotification(this.solicitud['Correo electrónico'],notificationInfo)
        
        
        this.consultaDatosTabla()

      })
      .catch(err => {
        swal({
          title: `${err}`
        })
        console.log(err, 'You dont have access!')
      });
  }
  
  denegarSolicitud(){
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
          estado: 'Denegada por DRI UV',
          comentarioDenegacion: `${mensaje}`,
          fechaActualizado: moment().format('DD/MM/YYYY HH:mm')
        })

      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if (this.solicitud['Correo electrónico'] != '') {
          var body = `cuerpo del correo de la razon por la cual la solicitud es denegada 
          ${result} -- ${mensajeDenegacion}`
          var correos = `${this.solicitud['Correo electrónico']}, ${environment.mails.dirDRI}`

          return this.enviarCorreo(correos, "Solicitud Denegada por DRI UV", body)
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


  setsolicitud() {
    this.solicitud = {
      "NOMBRE": "Francisco Hurtado",
      "ID_SEXO_BIOLOGICO": "francisco.hurtado@",
      "ID_ESTADO_CIVIL": "",
      "FECHA_NACIMIENTO": "07/12/1984",
      "Correo electrónico": "francisco.hurtado@geoprocess.com.co",
      "TIPO DE IDENTIFICACIÓN": "CEDULA",
      "NÚMERO DE IDENTIFICACIÓN": "123456789",
      "CÓDIGO DEL ESTUDIANTE EN UNIVALLE": "",
      "PERIODO ACADÉMICO": 0,
      "TIPO DE MOVILIDAD": "ENTRANTE",
      "TIPO DE CONVENIO": "",
      "CODIGO_CONVENIO": "",
      "MODALIDAD": "",
      "NUM_DIAS_MOVILIDAD": "",
      "TIPO DE PROGRAMA - CONVOCATORIA": "BILATERAL",
      "NIVEL DE FORMACIÓN DEL ESTUDIANTE DE ORIGEN": "",
      "NIVEL DE FORMACIÓN DE LA MOVILIDAD": "",
      "PAÍS DE ORIGEN": "",
      "UNIVERSIDAD DE PROCEDENCIA": this.universidadProcedencia,
      "CIUDAD-SEDE": "",
      "PAÍS DE DESTINO": "",
      "UNIVERSIDAD - INSTITUCIÓN RECEPTORA": "UNIVERSIDAD DEL VALLE",
      "PROGRAMA ACADÉMICO DE ORIGEN": "",
      "CÓDIGO DEL PROGRAMA": "",
      "PROGRAMA ACADÉMICO DE DESTINO (1)": "BIOLOGÍA",
      "PROGRAMA ACADÉMICO DE DESTINO (2)": "",
      "FINANCIAMIENTO": "NO APLICA",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": "",
      "urlFile1": "",
      "urlFile2": "",
      "urlFile3": "",
      "creadoPor": this.user.email,
      "fechaCreado": "",
      "fechaActualizado": "",
      "estado": "En espera de aprobación DRI"
    }
  }


  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }

}
