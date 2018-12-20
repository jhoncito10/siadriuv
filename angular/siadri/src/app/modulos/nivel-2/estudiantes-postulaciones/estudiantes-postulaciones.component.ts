import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';

import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService, NativeFirebaseService, MixedFunctions } from "../../../shared/services/main-service.service";
import * as  moment from "moment";
import { environment } from "../../../../environments/environment";
import * as firebase from "firebase";
import { DialogEstudianteComponent } from './dialog-estudiante/dialog-estudiante.component';

@Component({
  selector: 'app-estudiantes-postulaciones',
  templateUrl: './estudiantes-postulaciones.component.html',
  styleUrls: ['./estudiantes-postulaciones.component.css']
})
export class EstudiantesPostulacionesComponent implements OnInit {
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

  displayedColumns = ['key', 'correo', 'fechaCreado', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud

  year: any

  rowSelected: any

  spinertablapostulaciones = false

  paises = []

  programas: any
  arrayProgramas = []
  arrayFacultades = []

  arrayProgramas2 = []
  arrayFacultades2 = []

  inicioMobilidad: any
  finMobilidad: any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaSolicitudesCarrera: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;



  // FILES
  @ViewChild('fileInputCartaPresentacion') fileInputCartaPresentacion: ElementRef;
  @ViewChild('fileInputCertificadoNotas') fileInputCertificadoNotas: ElementRef;
  @ViewChild('fileInputConocimientoEspanol') fileInputConocimientoEspanol: ElementRef;
  @ViewChild('fileInputCartaMotivacion') fileInputCartaMotivacion: ElementRef;
  @ViewChild('fileInputDocumentoID') fileInputDocumentoID: ElementRef;
  @ViewChild('fileInputFoto') fileInputFoto: ElementRef;
  // REQUISITOS ADICIONALES
  @ViewChild('fileInputEuropassCV') fileInputEuropassCV: ElementRef;
  @ViewChild('fileInputFellows') fileInputFellows: ElementRef;


  @ViewChild('fileInputCartaTutor') fileInputCartaTutor: ElementRef;
  @ViewChild('fileInputDescripcionProyecto') fileInputDescripcionProyecto: ElementRef;



  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService: MailServiceService,
    private _NativeFirebaseService: NativeFirebaseService,
    private _MixedFunctions: MixedFunctions,
    private dialog: MatDialog
  ) {
    this.db = firebaseApp.database();
    this.firebaseStorage = this._NativeFirebaseService.fb.storage();
    this.solicitudes = {}
    this.year = moment().year()
    this.setsolicitud()
  }

  ngOnInit() {
    var ref = this.db.ref('/postulaciones/')
    var _this = this
    var onValueChange = ref.on('child_changed', function (dataSnapshot) {
      _this.consultaDatosTabla()
    });
    // Sometime later...
    ref.off('value', onValueChange);
    this.consultaDatosTabla()
    this.getPaises()
    this.getProgramas()
  }

  consultaDatosTabla() {
    this.estadoComponenteInferior = 0
    this.spinertablapostulaciones = true

    this.db.ref('/postulaciones/')
      .orderByChild("Correo electrónico")
      .equalTo(this.user.email)
      .once('value', solicitudesSnap => {
        this.dataTablaSolicitudes = [];
        // console.log('consulta tabla', solicitudesSnap)

        solicitudesSnap.forEach((solicitudSnap) => {

          let dato = solicitudSnap.val()
          if (dato.hasOwnProperty('creadoPor')) {
            this.solicitudes[solicitudSnap.key] = dato
            let correo = dato['Correo electrónico'] || ''
            let fechaCreado = dato['fechaCreado'] || ''
            let nombre = dato['NOMBRE'] || ''
            let estado = dato.estado || 'En espera de aprobación DRI'
            let destino = dato['PROGRAMA ACADÉMICO DE DESTINO (1)'] || 'Ninguno'
            let comentarioDenegacion = dato['comentarioDenegacion'] || ''

            this.dataTablaSolicitudes.push({
              correo: correo,
              fechaCreado: fechaCreado,
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
        this.spinertablapostulaciones = false

        if (this.tablaSolicitudesCarrera.nativeElement.classList.contains('collapsed-box')) {
          this.panelSuperiorButton.nativeElement.click()
        }
      }).catch((error) => { console.log(`${error}`); this.spinertablapostulaciones = true; })
  }

  getPaises() {
    this.paises = []
    return this.db.ref('/paises/')
      .orderByChild("nombre_pais")
      .once('value')
      .then(paisesSnap => {
        paisesSnap.forEach(pais => {
          this.paises.push(pais.val().nombre_pais)

        })

      })
      .catch(erro => {
        console.log(erro)
      })

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectSolicitud(row) {
    this.rowSelected = row;
    
    const estado = row['estado']
    switch (estado) {
      case 'Aprobada por DRI UV':
        this.estadoComponenteInferior = 3
        break;
        case 'En curso':
        this.estadoComponenteInferior = 4
        break;
      default:
        this.estadoComponenteInferior = 2
        break;
    }

    this.solicitud = this.solicitudes[row.key];

    console.log(this.solicitud)
    this.solicitud.key = row.key
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

    this.getProgramasPorFacultad()
    this.getProgramasPorFacultad2()
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
      "FECHA_EXPIRACION_DOCUMENTO": "",
      "LUGAR_NACIMIENTO": "",
      "PAIS_NACIMIENTO": "",
      "NACIONALIDAD": "",
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
      "UNIVERSIDAD DE PROCEDENCIA": "",
      "CIUDAD-SEDE": "",
      "PAÍS DE DESTINO": "",
      "UNIVERSIDAD - INSTITUCIÓN RECEPTORA": "",
      "PROGRAMA ACADÉMICO DE ORIGEN": "",
      "PROGRAMA ACADÉMICO DE ORIGEN 2": "",
      "CÓDIGO DEL PROGRAMA": "",
      "PROGRAMA ACADÉMICO DE DESTINO (1)": "",
      "PROGRAMA ACADÉMICO DE DESTINO (2)": "",
      "Facultad": "",
      "Facultad2": "",
      "FINANCIAMIENTO": "",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": "",
      "fechaActualizado": "",
      "estado": "",
      "DIRECCION": "",
      "PAIS_DIRECCION": "",
      "CIUDAD_DIRECCION": "",
      "POSTAL_CODE_DIRECCION": "",
      "ESTADO_PROVINCIA_REGION": "",
      "INSTITUCION_MEDICA": "",
      "matriculaIngles": "no",
      "curso1": "",
      "curso2": "",
      "curso3": "",
      "curso4": "",
      "curso5": "",
      "curso6": "",
      "finaciacionBeca_rango": "",
      "finaciacionInstitucionNacional": "",
      "finaciacionPaisInstitucionNacional": "",
      "finaciacionInstitucionInternacional": "",
      "finaciacionPaisInstitucionInternacional": "",
      "finaciacionONG": "",
      "CartaPresentacion": "",
      "CertificadoNotas": "",
      "ConocimientoEspanol": "",
      "CartaMotivacion": "",
      "DocumentoID": "",
      "Foto": "",
      "EuropassCV": "",
      "Fellows": ""

    }
  }
  actualizarSolicitud() {
    swal.showLoading()
    // var _this = this
    this.solicitud.estado = 'Solicitud completada por estudiante'
    this.solicitud.actualizadoPor = this.user.email

    this.solicitud.fechaActualizado = moment().format('DD/MM/YYYY HH:mm')
    let reader = new FileReader();
    var arrayPromesasFiles = []

    if (this.fileInputCartaPresentacion &&
      this.fileInputCartaPresentacion.nativeElement.files
      && this.fileInputCartaPresentacion.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaPresentacion.nativeElement.files[0];
      let extention = this.fileInputCartaPresentacion.nativeElement.files[0].name.split('.')
      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaPresentacion.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }

    if (this.fileInputCertificadoNotas &&
      this.fileInputCertificadoNotas.nativeElement.files
      && this.fileInputCertificadoNotas.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCertificadoNotas.nativeElement.files[0];
      let extention = this.fileInputCertificadoNotas.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CertificadoNotas.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputConocimientoEspanol &&
      this.fileInputConocimientoEspanol.nativeElement.files
      && this.fileInputConocimientoEspanol.nativeElement.files.length > 0
    ) {
      let file = this.fileInputConocimientoEspanol.nativeElement.files[0];
      let extention = this.fileInputConocimientoEspanol.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/ConocimientoEspanol.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputCartaMotivacion &&
      this.fileInputCartaMotivacion.nativeElement.files
      && this.fileInputCartaMotivacion.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaMotivacion.nativeElement.files[0];
      let extention = this.fileInputCartaMotivacion.nativeElement.files[0].name.split('.')
      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaMotivacion.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputDocumentoID &&
      this.fileInputDocumentoID.nativeElement.files
      && this.fileInputDocumentoID.nativeElement.files.length > 0
    ) {
      let file = this.fileInputDocumentoID.nativeElement.files[0];
      let extention = this.fileInputDocumentoID.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/DocumentoID.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputFoto &&
      this.fileInputFoto.nativeElement.files
      && this.fileInputFoto.nativeElement.files.length > 0
    ) {
      let file = this.fileInputFoto.nativeElement.files[0];
      let extention = this.fileInputFoto.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/Foto.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputEuropassCV &&
      this.fileInputEuropassCV.nativeElement.files
      && this.fileInputEuropassCV.nativeElement.files.length > 0
    ) {
      let file = this.fileInputEuropassCV.nativeElement.files[0];
      let extention = this.fileInputEuropassCV.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/EuropassCV.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputFellows &&
      this.fileInputFellows.nativeElement.files
      && this.fileInputFellows.nativeElement.files.length > 0
    ) {
      let file = this.fileInputFellows.nativeElement.files[0];
      let extention = this.fileInputFellows.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/Fellows.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputCartaTutor && this.fileInputCartaTutor.nativeElement.files
      && this.fileInputCartaTutor.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaTutor.nativeElement.files[0];
      let extention = this.fileInputCartaTutor.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaTutor.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputDescripcionProyecto &&
      this.fileInputDescripcionProyecto.nativeElement.files
      && this.fileInputDescripcionProyecto.nativeElement.files.length > 0
    ) {
      let file = this.fileInputDescripcionProyecto.nativeElement.files[0];
      let extention = this.fileInputDescripcionProyecto.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/DescripcionProyecto.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    Promise.all(arrayPromesasFiles).then((values) => {

      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        let name = element.a.name.split('.')
        console.log(element)
        this.solicitud[`${name[0]}`] = element.a.downloadURLs[0]

      }
      const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update(this.solicitud);
      return promise
        .then(res => {
          if (this.solicitud['Correo electrónico'] != '') {
            var body = 'cuerpo del correo de En espera de aprobación dirección de programa'
            var correos = `${this.solicitud['Correo electrónico']}, ${environment.mails.dirDRI}`
            this._mailServiceService.sendMailprograma
              (this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'], 'El estado de tu solicitud ha sido actualizada : "En espera de aprobación dirección de programa"', body)
              .subscribe((responseData) => {
                console.log(responseData)

              }, error => {

                console.log(error)
              })

            return this.enviarCorreo(correos, 'El estado de tu solicitud ha sido actualizada : "En espera de aprobación dirección de programa"', body)
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
          let notificationInfo = 'El estado de tu solicitud ha sido actualizada : "En espera de aprobación dirección de programa"'
          this._mailServiceService
            .crearNotification(this.solicitud['Correo electrónico'], notificationInfo)
            .subscribe((responseData) => {
              console.log(responseData)
            }, error => { console.log(error) })

          this._mailServiceService
            .createNotificationPrograma(this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'], notificationInfo)
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


    }).catch(error => {
      swal(
        `${error}`,
        '',
        'error'
      )
      console.log(error)
    })



  }
  cancelarSolicitud() {
    swal.showLoading()
    // var _this = this
    this.solicitud.estado = 'Cancelada por usuario'
    this.solicitud.actualizadoPor = this.user.email

    this.solicitud.fechaActualizado = moment().format('DD/MM/YYYY HH:mm')
    const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update(this.solicitud);
    promise
      .then(res => {
        if (this.solicitud['Correo electrónico'] != '') {
          var body = 'Cancelada por usuario'
          var correos = `${this.solicitud['Correo electrónico']}, ${environment.mails.dirDRI}`
          this._mailServiceService.sendMailprograma
            (this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'], 'El estado de tu solicitud ha sido actualizada : "Cancelada por usuario"', body)
            .subscribe((responseData) => {
              console.log(responseData)

            }, error => {

              console.log(error)
            })

          return this.enviarCorreo(correos, 'El estado de tu solicitud ha sido actualizada : "Cancelada por usuario"', body)
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
        let notificationInfo = 'El estado de tu solicitud ha sido actualizada : "Cancelada por usuario"'
        this._mailServiceService
          .crearNotification(this.solicitud['Correo electrónico'], notificationInfo)
          .subscribe((responseData) => {
            console.log(responseData)
          }, error => { console.log(error) })

        this._mailServiceService
          .createNotificationPrograma(this.solicitud['PROGRAMA ACADÉMICO DE DESTINO (1)'], notificationInfo)
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
  guardarSolicitud() {
    swal.showLoading()
    // var _this = this
    this.solicitud.actualizadoPor = this.user.email

    this.solicitud.fechaActualizado = moment().format('DD/MM/YYYY HH:mm')
    let reader = new FileReader();
    var arrayPromesasFiles = []

    if (this.fileInputCartaPresentacion &&
      this.fileInputCartaPresentacion.nativeElement.files
      && this.fileInputCartaPresentacion.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaPresentacion.nativeElement.files[0];
      let extention = this.fileInputCartaPresentacion.nativeElement.files[0].name.split('.')
      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaPresentacion.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }

    if (this.fileInputCertificadoNotas &&
      this.fileInputCertificadoNotas.nativeElement.files
      && this.fileInputCertificadoNotas.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCertificadoNotas.nativeElement.files[0];
      let extention = this.fileInputCertificadoNotas.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CertificadoNotas.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputConocimientoEspanol &&
      this.fileInputConocimientoEspanol.nativeElement.files
      && this.fileInputConocimientoEspanol.nativeElement.files.length > 0
    ) {
      let file = this.fileInputConocimientoEspanol.nativeElement.files[0];
      let extention = this.fileInputConocimientoEspanol.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/ConocimientoEspanol.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputCartaMotivacion &&
      this.fileInputCartaMotivacion.nativeElement.files
      && this.fileInputCartaMotivacion.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaMotivacion.nativeElement.files[0];
      let extention = this.fileInputCartaMotivacion.nativeElement.files[0].name.split('.')
      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaMotivacion.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputDocumentoID &&
      this.fileInputDocumentoID.nativeElement.files
      && this.fileInputDocumentoID.nativeElement.files.length > 0
    ) {
      let file = this.fileInputDocumentoID.nativeElement.files[0];
      let extention = this.fileInputDocumentoID.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/DocumentoID.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputFoto &&
      this.fileInputFoto.nativeElement.files
      && this.fileInputFoto.nativeElement.files.length > 0
    ) {
      let file = this.fileInputFoto.nativeElement.files[0];
      let extention = this.fileInputFoto.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/Foto.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputEuropassCV &&
      this.fileInputEuropassCV.nativeElement.files
      && this.fileInputEuropassCV.nativeElement.files.length > 0
    ) {
      let file = this.fileInputEuropassCV.nativeElement.files[0];
      let extention = this.fileInputEuropassCV.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/EuropassCV.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputFellows &&
      this.fileInputFellows.nativeElement.files
      && this.fileInputFellows.nativeElement.files.length > 0
    ) {
      let file = this.fileInputFellows.nativeElement.files[0];
      let extention = this.fileInputFellows.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/Fellows.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputCartaTutor && this.fileInputCartaTutor.nativeElement.files
      && this.fileInputCartaTutor.nativeElement.files.length > 0
    ) {
      let file = this.fileInputCartaTutor.nativeElement.files[0];
      let extention = this.fileInputCartaTutor.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/CartaTutor.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }
    if (this.fileInputDescripcionProyecto &&
      this.fileInputDescripcionProyecto.nativeElement.files
      && this.fileInputDescripcionProyecto.nativeElement.files.length > 0
    ) {
      let file = this.fileInputDescripcionProyecto.nativeElement.files[0];
      let extention = this.fileInputDescripcionProyecto.nativeElement.files[0].name.split('.')

      let storageRef = this.firebaseStorage.ref();
      let mountainsRef = storageRef.child(`postulaciones/${this.solicitud.key}/DescripcionProyecto.${extention[extention.length - 1]}`);

      arrayPromesasFiles.push(mountainsRef.put(file))
    }

    Promise.all(arrayPromesasFiles).then((values) => {

      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        let name = element.a.name.split('.')
        console.log(element)
        this.solicitud[`${name[0]}`] = element.a.downloadURLs[0]

      }
      const promise = this._angularfire.object(`/postulaciones/${this.solicitud.key}/`).update(this.solicitud);

      promise
        .then(res => {

          swal({
            title: `Solicitud actualizada`
          })
          this.consultaDatosTabla()


        })

        .catch(err => {
          swal({
            title: `${err}`
          })
          console.log(err, 'You dont have access!')
        });

    }).catch(error => {
      swal(
        `${error}`,
        '',
        'error'
      )
      console.log(error)
    })



  }

  getProgramas() {
    let programs = this.db.ref('/programasAcademicos/')
    return programs.once('value').then(snapProgramas => {
      this.programas = snapProgramas.val()
      return snapProgramas.forEach(programa => {
        this.arrayFacultades.push(programa.val()['FACULTAD-INSTITUTO'])
        this.arrayFacultades2.push(programa.val()['FACULTAD-INSTITUTO'])

      })
    })
      .then(resolve => {
        this.arrayFacultades = this._MixedFunctions.removeDuplicadesArray(this.arrayFacultades)
        this.arrayFacultades2 = this._MixedFunctions.removeDuplicadesArray(this.arrayFacultades2)

      })
  }

  getProgramasPorFacultad() {
    this.arrayProgramas = []
    for (const prog in this.programas) {
      if (this.programas.hasOwnProperty(prog)) {
        const element = this.programas[prog];

        if (element['FACULTAD-INSTITUTO'] == this.solicitud['Facultad']) {
          this.arrayProgramas.push(element['NOMBRE PROGRAMA ACADEMICO'])
        }

      }
    }
  }

  getProgramasPorFacultad2() {
    this.arrayProgramas2 = []
    for (const prog in this.programas) {
      if (this.programas.hasOwnProperty(prog)) {
        const element = this.programas[prog];

        if (element['FACULTAD-INSTITUTO'] == this.solicitud['Facultad2']) {
          this.arrayProgramas2.push(element['NOMBRE PROGRAMA ACADEMICO'])
        }

      }
    }
  }
  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }

  calculaDias() {

    if (this.finMobilidad && this.inicioMobilidad) {
      let dias = moment(this.finMobilidad).diff(this.inicioMobilidad, 'days')
      if (dias < 1) {
        swal('Las fechas que has ingresado son incorrectas', '', 'error')
      } else {
        this.solicitud['NUM_DIAS_MOVILIDAD'] = dias
      }
    }

  }



  openDialog(item) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: this.solicitud.key,
      curso1: this.solicitud['curso1'],
      curso2: this.solicitud['curso2'],
      curso3: this.solicitud['curso3'],
      curso4: this.solicitud['curso4'],
      curso5: this.solicitud['curso5'],
      curso6: this.solicitud['curso6']
    };

    this.dialog.open(DialogEstudianteComponent, dialogConfig);
  }
}
