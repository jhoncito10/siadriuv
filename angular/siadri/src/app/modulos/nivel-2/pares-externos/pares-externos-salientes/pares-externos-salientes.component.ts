import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService, NativeFirebaseService } from "../../../../shared/services/main-service.service";
import * as  moment from "moment";
import { environment } from 'environments/environment';



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
  firebaseStorage: any
  dataTablaSolicitudes = [];

  programas = []

  displayedColumns = ["key", 'correo', 'fechaCreado', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  universidadProcedencia = ''

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud

  rowSelected

  year

  user = JSON.parse(localStorage.getItem('usuario'));
  datosParExt

  spinertablapostulaciones = false
  conveniosPar = []
  convenios = this.localSt.retrieve('convenios');
  campus = []


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
    // this.firebaseStorage = firebase.storage();
    // console.log(this._NativeFirebaseService.fb.auth().currentUser.email)
    this.solicitudes = {}
    this.year = moment().year()
    this.setsolicitud()
  }

  ngOnInit() {
    // Or you can save a line of code by using an inline function
    // and on()'s return value.
    var ref = this.db.ref('/postulaciones/')
    var _this = this
    var onValueChange = ref.on('child_changed', function (dataSnapshot) {
      _this.consultaDatosTabla()
    });
    // Sometime later...
    ref.off('value', onValueChange);
    this.consultaDatosTabla()

    this.consultarProgramas()
    this.consultaDatosPar()
    this.consultaCampus()

  }
  consultaDatosTabla() {
    this.estadoComponenteInferior = 0
    this.spinertablapostulaciones = true
    this.db.ref('/postulaciones/')
      .orderByChild("creadoPor")
      .equalTo(this.user.email)
      .once('value', solicitudesSnap => {
        this.dataTablaSolicitudes = [];
        // console.log('consulta tabla', solicitudesSnap)

        solicitudesSnap.forEach((solicitudSnap) => {

          let dato = solicitudSnap.val()
          // console.log(dato)
          if (dato['TIPO DE MOVILIDAD'] == 'ENTRANTE') {
            this.solicitudes[solicitudSnap.key] = dato
            let correo = dato['Correo electrónico'] || ''
            let fechaCreado = dato['fechaCreado'] || ''
            let nombre = dato['NOMBRE'] || ''
            let apellidos = dato['APELLIDOS'] || ''
            let nombreCompleto = `${nombre} ${apellidos}`
            let estado = dato.estado || 'En espera de aprobación DRI'
            let destino = dato['PROGRAMA ACADÉMICO DE DESTINO (1)'] || 'Ninguno'
            let comentarioDenegacion = dato['comentarioDenegacion'] || ''

            this.dataTablaSolicitudes.push({
              correo: correo,
              fechaCreado: fechaCreado,
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
      }).catch((error) => {
        console.log(`${error}`)
        this.spinertablapostulaciones = false

      })
  }

  consultarProgramas() {
    this.db.ref('/programasAcademicos/')
      .orderByChild("NOMBRE PROGRAMA ACADEMICO")
      .once('value', pgrogramas => {

        pgrogramas.forEach((programa) => {

          let dato = programa.val()
          this.programas.push(dato['NOMBRE PROGRAMA ACADEMICO'])


        })


      }).catch((error) => console.log(`${error}`))
  }

  consultaCampus() {
    return this.db.ref('/campus/')

      .once('value')

      .then(snapCampus => {
        this.campus = snapCampus.val()
        // snapCampus.forEach(campus => {
        //   this.campus.push ( campus.val())         
        // })
      }).catch(error => {
        console.log(error)
      })
  }
  consultaDatosPar() {
    return this.db.ref('/paresExternos/')
      .orderByChild("correo")
      .equalTo(this.user.email)
      .once('value')

      .then(snapParExt => {

        snapParExt.forEach(par => {
          this.datosParExt = par.val()
          this.universidadProcedencia = this.datosParExt.institucion
          for (const conv in this.datosParExt.convenio) {
            if (this.datosParExt.convenio.hasOwnProperty(conv)) {
              const element = this.datosParExt.convenio[conv];

              this.db.ref(`/convenios/${conv}`).once('value').then(snapConv => {

                if (snapConv.val()['Estado'] == 'Activo') {
                  this.conveniosPar.push(conv)

                }
              })

            }
          }
        })
      }).catch(error => {
        console.log(error)
      })
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
    this.solicitud.key = row.key
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
    // setTimeout(function(){ 

    //  }, 2500);
    this.panelInferior.nativeElement.scrollIntoView({ block: "start", behavior: "smooth" });


  }

  crearSolicitud() {

    if (this.validarDatosFormlario()) {

      swal({
        title: 'Cargando',
        html: '',
        onOpen: () => {
          swal.showLoading()

        }
      })
      var ref = this.db.ref('/postulaciones/').push()

      this.solicitud['fechaCreado'] = moment().format('DD/MM/YYYY HH:mm')
      this.solicitud['fechaActualizado'] = moment().format('DD/MM/YYYY HH:mm')


      return ref.set(this.solicitud).then(() => {
        this.consultaDatosTabla()
        swal(
          'Solicitud creada correctamente',
          '',
          'success'
        )
        if (this.solicitud['Correo electrónico'] != '') {

          /* seccion de envio de notificaciones*/

          let notificationInfonivel3 = 'Solicitud de movilidad entrante creada por un par externo'

          this._mailServiceService
            .createNotificationNivel3(notificationInfonivel3)
            .subscribe((responseData) => {
              console.log(responseData)
            }, error => { console.log(error) })


          /* seccion de envio de correos*/
          var bodyNivel3 = 'cuerpo del correo de para el DRI nivel 3 creación de postulacion'
          var correos = `${this.solicitud['Correo electrónico']}`
          this._mailServiceService
            .sendMailNivel3("asunto para el DRI nivel 3 creación de postulacion", bodyNivel3)
            .subscribe((responseData) => {
              console.log(responseData)
            }, error => {
              console.log(error)
            })

          var bodyPar = 'cuerpo del correo de para el Par de la creacion de postulacion'
          var correos = `${this.solicitud['creadoPor']}`
          this.enviarCorreo(correos, "asunto para el Par de la creacion de postulación", body)
            .subscribe((responseData) => {
              console.log(responseData)
            }, error => {
              console.log(error)
            })

          var body = 'cuerpo del correo de para el estudiante de la creacion de postulación'
          var correos = `${this.solicitud['Correo electrónico']}`
          return this.enviarCorreo(correos, "asunto para el estudiante de la creacion de postulación", body)
            .subscribe((responseData) => {
              console.log(responseData)
            }, error => {
              console.log(error)
            })

        } else {

          return
        }

      })

      // if (
      //   this.fileInput1.nativeElement.files && this.fileInput1.nativeElement.files.length > 0 &&
      //   this.fileInput2.nativeElement.files && this.fileInput2.nativeElement.files.length > 0 &&
      //   this.fileInput3.nativeElement.files && this.fileInput3.nativeElement.files.length > 0
      // ) {


      // let reader = new FileReader();
      // let file = this.fileInput1.nativeElement.files[0];
      // var storageRef = this.firebaseStorage.ref();
      // var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo1.pdf`);

      // var promesaFile1 = mountainsRef.put(file)

      // let file2 = this.fileInput2.nativeElement.files[0];
      // var storageRef = this.firebaseStorage.ref();
      // var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo2.pdf`);

      // var promesaFile2 = mountainsRef.put(file2)

      // let file3 = this.fileInput3.nativeElement.files[0];
      // var storageRef = this.firebaseStorage.ref();
      // var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo3.pdf`);

      // var promesaFile3 = mountainsRef.put(file3)


      // Promise.all([promesaFile1, promesaFile2, promesaFile3]).then((values) => {
      //   this.solicitud['urlFile1'] = values[0].a.downloadURLs[0]
      //   this.solicitud['urlFile2'] = values[1].a.downloadURLs[0]
      //   this.solicitud['urlFile3'] = values[2].a.downloadURLs[0]



      // }).catch(error => {
      //   swal(
      //     `${error}`,
      //     '',
      //     'error'
      //   )
      //   console.log(error)
      // })

      // } else {
      //   swal(
      //     `Todos los documentos son requeridos`,
      //     '',
      //     'error'
      //   )
      // }




    }

  }


  setsolicitud() {
    this.solicitud = {
      "AÑO": this.year,
      "NOMBRE": "Francisco Hurtado",
      "APELLIDOS": "",
      "ID_SEXO_BIOLOGICO": "",
      "ID_ESTADO_CIVIL": "",
      "FECHA_NACIMIENTO": "",
      "Correo electrónico": "francisco.hurtado@geoprocess.com.co",
      "TIPO DE IDENTIFICACIÓN": "",
      "NÚMERO DE IDENTIFICACIÓN": "",
      "CÓDIGO DEL ESTUDIANTE EN UNIVALLE": "",
      "PERIODO ACADÉMICO": "",
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
      "FINANCIAMIENTO": "",
      "VALOR_FINANCIACION_NACIONAL": "",
      "ID_FUENTE_INTERNACIONAL": "",
      "ID_PAIS_FINANCIADOR": "",
      "VALOR_FINANCIACION_INTERNAC": "",
      "CAMPUS": "Meléndez",
      "creadoPor": this.user.email,
      " ": "",
      "fechaActualizado": "",
      "estado": "En espera de aprobación DRI",
      "comentariosDRI":"",
      "comentariosDirector":"",
      "comentariosEstudiante":"",
      "comentariosPar":""
    }
    console.log(this.solicitud)
  }

  validarDatosFormlario() {
    if (this.solicitud["NOMBRE"] == '') {
      swal(
        'El campo nombre no puede estar vacio',
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


    else {
      return true

    }
  }

  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }
}
