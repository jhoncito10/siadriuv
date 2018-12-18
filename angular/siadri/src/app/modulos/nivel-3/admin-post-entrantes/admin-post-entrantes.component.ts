import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService, NativeFirebaseService, MixedFunctions} from '../../../shared/services/main-service.service';
import * as  moment from 'moment';
import { environment } from '../../../../environments/environment';
import * as firebase from 'firebase';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { DialogComponent } from './dialog/dialog.component';
@Component({
  selector: 'app-admin-post-entrantes',
  templateUrl: './admin-post-entrantes.component.html',
  styleUrls: ['./admin-post-entrantes.component.css']
})
export class AdminPostEntrantesComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('usuario'));
  // datos consulta
  solicitudes: any;
  // solicitud selecionada
  solicitud: any;
  // variable para la instacia de realtime databe de firebase
  db: any
  // datos de la tabla
  firebaseStorage: any
  dataTablaSolicitudes = [];
  displayedColumns = ['key', 'correo', 'ano', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;
  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'
  estadoComponenteInferior = 0 // 0 = ninguno; 1 =  nueva solicitud; 2 = En espera de aprobación DRI; 3 = Aprobada por dirección de programa;
  year
  rowSelected
  spinertablapostulaciones = false

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
    private _NativeFirebaseService: NativeFirebaseService,
    private _MixedFunctions: MixedFunctions,
    private _AngularFireAuth: AngularFireAuth,
    private dialog: MatDialog
  ) {
    this.db = firebaseApp.database();
    this.firebaseStorage = this._NativeFirebaseService.fb.storage();
    this.solicitudes = {}
    this.year = moment().year()
    this.setsolicitud()
  }

  ngOnInit() {
    const ref = this.db.ref('/postulaciones/')
    const _sthis = this
    const onValueChange = ref.on('child_changed', function (dataSnapshot) {
      _sthis.consultaDatosTabla()
    });
    // Sometime later...
    ref.off('value', onValueChange);
    this.consultaDatosTabla()


 

  }

  consultaDatosTabla() {
    this.estadoComponenteInferior = 0
    this.spinertablapostulaciones = true

    this.db.ref('/postulaciones/')
      // .orderByChild("estado")
      // .equalTo('Aprobada por el director de programa')
      .once('value', solicitudesSnap => {
        this.dataTablaSolicitudes = [];
        console.log('consulta tabla', solicitudesSnap.val())
        solicitudesSnap.forEach((solicitudSnap) => {
          const dato = solicitudSnap.val()

          if (dato.hasOwnProperty('creadoPor')) {
            this.solicitudes[solicitudSnap.key] = dato
            const correo = dato['Correo electrónico'] || ''
            const ano = dato['fechaActualizado'] || ''
            const nombre = dato['NOMBRE'] || ''
            const apellidos = dato['APELLIDOS'] || ''
            const nombreCompleto = `${nombre} ${apellidos}`
            const estado = dato.estado || 'Sin estado'
            const destino = dato['PROGRAMA ACADÉMICO DE DESTINO (1)'] || 'Ninguno'
            const comentarioDenegacion = dato['comentarioDenegacion'] || ''

            this.dataTablaSolicitudes.push({
              correo: correo,
              ano: ano,
              destino: destino,
              nombre: nombreCompleto,
              key: solicitudSnap.key,
              estado: estado,
              comentarioDenegacion: comentarioDenegacion
            })
          }

        })

        this.dataSource = new MatTableDataSource(this.dataTablaSolicitudes);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinertablapostulaciones = false

        if (this.tablaSolicitudesCarrera.nativeElement.classList.contains('collapsed-box')) {
          this.panelSuperiorButton.nativeElement.click()
        }
      })
      .catch((error) => {
        console.log(`${error}`)
        this.spinertablapostulaciones = false

      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectSolicitud(row) {
    this.rowSelected = row;


    const _convenioSelected = this.solicitudes[row.key];
    const estado = _convenioSelected['estado']
    switch (estado) {
      case 'En espera de aprobación DRI':
        this.estadoComponenteInferior = 2
        break;
      case 'Aprobada por dirección de programa':
        this.estadoComponenteInferior = 3
        break;
        case 'Denegada por dirección de programa':
        this.estadoComponenteInferior = 2
        break;
        case 'Denegada por DRI UV':
        this.estadoComponenteInferior = 2
        break;
        case 'Solicitud completada por estudiante':
        this.estadoComponenteInferior = 4
        break;
      default:
        this.estadoComponenteInferior = 0
        break;
    }
    console.log(this.estadoComponenteInferior)
    this.solicitud = _convenioSelected
    console.log(this.solicitud)
    this.solicitud.key = row.key
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();


  }
  aprobarSolicitud() {
    swal.showLoading()
    let newmail = this.solicitud['Correo electrónico']
    newmail = newmail.trim(); // Remove whitespace
    newmail = newmail.toLowerCase();
    const pass = this._MixedFunctions.makePassword()

    this._AngularFireAuth.auth.createUserWithEmailAndPassword(newmail, pass)
      .then((user) => {
        user.sendEmailVerification()

        const body = `
            Cuerpo del correo de cuenta de usuario postulante
            usuario: ${newmail}
            password: ${pass} "Este password es tempral, No olvide cambiarlo"
          `

        this.enviarCorreo(newmail, 'Cuenta creada para estudiante', body)
          .subscribe((responseData) => {


          })
      })
      .catch(error => {
        console.log(error)
        if (error.message !== 'The email address is already in use by another account.') {
          swal(
            `${error}`,
            '',
            'error'
          )
        }

      })
    const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update({
      estado: 'Aprobada por DRI UV',
      actualizadoPor: this.user.email,
      fechaActualizado: moment().format('DD/MM/YYYY HH:mm')
    });
    promise
      .then(res => {
        swal({
          title: `Solicitud actualizada`
        })
        if (this.solicitud['Correo electrónico'] !== '') {
          const body = 'cuerpo del correo de aceptacion para estudiante'
          const correos = `${this.solicitud['Correo electrónico']}`
          this.enviarCorreo(this.solicitud['Correo electrónico'], 'Aprobada por DRI UV', body)
            .subscribe((responseData) => {
              console.log(responseData)}, error => {console.log(error)})
          const bodyPar = 'cuerpo del correo de aceptacion para par externo'

          return this.enviarCorreo(this.solicitud['Correo electrónico'], 'Aprobada por DRI UV', bodyPar)
            .subscribe((responseData) => {console.log(responseData)}, error => {console.log(error)})
        }


      })
      .then(() => {
        const notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        this._mailServiceService
          .crearNotification(this.solicitud['Correo electrónico'], notificationInfo)
          .subscribe((responseData) => {
            console.log(responseData)
          }, error => { console.log(error) })

          this._mailServiceService
          .crearNotification(this.solicitud['creadoPor'], notificationInfo)
          .subscribe((responseData) => {
            console.log(responseData)
          }, error => { console.log(error) })

        // this._mailServiceService
        //   .createNotificationPrograma(this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'], notificationInfo)
        //   .subscribe((responseData) => {
        //     console.log(responseData)}, error => {console.log(error)})
        // let notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        // this._mailServiceService.crearNotification(this.solicitud['Correo electrónico'],notificationInfo)
        // let notificationInfo = 'La solicitud ha sido Aprobada por DRI UV'
        // this._mailServiceService.crearNotification(this.solicitud['Correo electrónico'],notificationInfo)


        // this.consultaDatosTabla()

      })
      .catch(err => {
        swal({
          title: `${err}`
        })
        console.log(err, 'You dont have access!')
      });
  }

  denegarSolicitud() {
    let mensajeDenegacion = ''


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
        this.solicitud.comentariosDRI = this.solicitud.comentariosDRI || ''
        return promise.update({
          estado: 'Denegada por DRI UV',
          comentariosDRI: `${this.solicitud.comentariosDRI}.
                            ${mensaje}`,
          actualizadoPor: this.user.email,
          fechaActualizado: moment().format('DD/MM/YYYY HH:mm')
        })

      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if (this.solicitud['Correo electrónico'] !== '') {
          const body = `cuerpo del correo de la razon por la cual la solicitud es denegada
          ${result} -- ${mensajeDenegacion}`
          const correos = `${this.solicitud['creadoPor']}`

          return this.enviarCorreo(correos, 'Solicitud Denegada por DRI UV', body)
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
        const notificationInfo = 'La solicitud ha sido Rechazada por DRI UV'
        this._mailServiceService
          .crearNotification(this.solicitud['creadoPor'], notificationInfo)
          .subscribe((responseData) => {
            console.log(responseData)
          }, error => { console.log(error) })
        this.consultaDatosTabla()

      })
      .catch(error => {
        console.log(error)

      })
  }
  enviarCarta() {
    swal.showLoading()

    switch (this.solicitud.estado) {
      case 'Aprobada por dirección de programa':
        if (this.datosObligatoriosDri()) {
          const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`);
          this.solicitud.estado = 'En curso'
          this.solicitud.actualizadoPor = this.user.email
          this.solicitud.fechaActualizado = moment().format('DD/MM/YYYY HH:mm')

          promise.update(this.solicitud).then(() => {
            this._mailServiceService
              .enviarCarta(this.solicitud, environment.mails.dirDRI, 'aceptada')
              .subscribe((responseData) => {
                if (responseData) {
                  swal({
                    title: `Solicitud actualizada`
                  })
                }
              }, error => { console.log(error) })
            this.consultaDatosTabla()

          })
            .catch(error => {

            })

        } else {
          swal('Datos exclusivos de la DRI incompletos', '', 'error')
        }

        break;
      case 'Denegada por la dirección de programa':
        this._mailServiceService
          .enviarCarta(this.solicitud, environment.mails.dirDRI, 'denegada')
          .subscribe((responseData) => {
            if (responseData) {
              swal({
                title: `Solicitud actualizada`
              })
            }
          }, error => { console.log(error) })
        this.consultaDatosTabla()
        break;
    }


  }


  datosObligatoriosDri() {
    if (this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'].trim() === '') {
      return false
    } else if (this.solicitud['VALOR_FINANCIACION_NACIONAL'].trim() === '') {
      return false
    } else {
      return true
    }
  }
  setsolicitud() {
    this.solicitud = {
      'AÑO': this.year,
      'NOMBRE': 'Francisco Hurtado',
      'APELLIDOS': '',
      'ID_SEXO_BIOLOGICO': '',
      'ID_ESTADO_CIVIL': '',
      'FECHA_NACIMIENTO': '',
      'Correo electrónico': 'francisco.hurtado@geoprocess.com.co',
      'TIPO DE IDENTIFICACIÓN': '',
      'NÚMERO DE IDENTIFICACIÓN': '',
      'CÓDIGO DEL ESTUDIANTE EN UNIVALLE': '',
      'PERIODO ACADÉMICO': '',
      'TIPO DE MOVILIDAD': 'ENTRANTE',
      'TIPO DE CONVENIO': '',
      'CODIGO_CONVENIO': '',
      'MODALIDAD': '',
      'NUM_DIAS_MOVILIDAD': '',
      'TIPO DE PROGRAMA - CONVOCATORIA': '',
      'NIVEL DE FORMACIÓN DEL ESTUDIANTE DE ORIGEN': '',
      'NIVEL DE FORMACIÓN DE LA MOVILIDAD': '',
      'PAÍS DE ORIGEN': '',
      'UNIVERSIDAD DE PROCEDENCIA': '',
      'CIUDAD-SEDE': '',
      'PAÍS DE DESTINO': '',
      'UNIVERSIDAD - INSTITUCIÓN RECEPTORA': 'UNIVERSIDAD DEL VALLE',
      'PROGRAMA ACADÉMICO DE ORIGEN': '',
      'CÓDIGO DEL PROGRAMA': '',
      'PROGRAMA ACADÉMICO DE DESTINO (1)': '',
      'PROGRAMA ACADÉMICO DE DESTINO (2)': '',
      'FINANCIAMIENTO': '',
      'VALOR_FINANCIACION_NACIONAL': '',
      'ID_FUENTE_INTERNACIONAL': '',
      'ID_PAIS_FINANCIADOR': '',
      'VALOR_FINANCIACION_INTERNAC': '',
      'CAMPUS': '',
      'urlFile1': '',
      'urlFile2': '',
      'urlFile3': '',
      'creadoPor': '',
      'actualizadoPor': this.user.email,
      'fechaCreado': '',
      'fechaActualizado': '',
      'estado': '',
      'comentariosDRI': '',
      'comentariosDirector': '',
      'comentariosEstudiante': '',
      'comentariosPar': ''
    }
  }

 
  openDialog(item) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: this.solicitud.key,
      variable: item
    };

    this.dialog.open(DialogComponent, dialogConfig);
}


  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }

}
