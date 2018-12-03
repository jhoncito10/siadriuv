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

  displayedColumns = ['correo', 'ano', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud

  rowSelected

  year

  user = JSON.parse(localStorage.getItem('usuario'));


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
    this.consultaDatosTabla()
    this.consultarProgramas()
  }
  consultaDatosTabla() {
    this.estadoComponenteInferior = 0

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
            let ano = dato['AÑO'] || ''
            let nombre = dato['NOMBRE'] || ''
            let estado = dato.estado || 'En espera de aprobación DRI'
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

  consultarProgramas() {
    this.db.ref('/programasAcademicos/')
      .orderByChild("NOMBRE PROGRAMA ACADEMICO")
      .once('value', pgrogramas => {

        pgrogramas.forEach((programa) => {

          let dato = programa.val()
          this.programas.push(dato['NOMBRE PROGRAMA ACADEMICO'])
          console.log(this.programas)


        })


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
    console.log(this.fileInput1.nativeElement.files[0])

    if (this.validarDatosFormlario()) {

      if (
        this.fileInput1.nativeElement.files && this.fileInput1.nativeElement.files.length > 0 &&
        this.fileInput2.nativeElement.files && this.fileInput2.nativeElement.files.length > 0 &&
        this.fileInput3.nativeElement.files && this.fileInput3.nativeElement.files.length > 0
      ) {
        swal({
          title: 'Cargando',
          html: '',
          onOpen: () => {
            swal.showLoading()

          }
        })
        var ref = this.db.ref('/postulaciones/').push()

        let reader = new FileReader();
        let file = this.fileInput1.nativeElement.files[0];
        console.log(file)
        // reader.readAsDataURL(file);
        var storageRef = this.firebaseStorage.ref();
        var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo1.pdf`);

        var promesaFile1 = mountainsRef.put(file)

        let file2 = this.fileInput2.nativeElement.files[0];
        console.log(file2)
        // reader.readAsDataURL(file);
        var storageRef = this.firebaseStorage.ref();
        var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo2.pdf`);

        var promesaFile2 = mountainsRef.put(file2)

        let file3 = this.fileInput3.nativeElement.files[0];
        console.log(file3)
        // reader.readAsDataURL(file);
        var storageRef = this.firebaseStorage.ref();
        var mountainsRef = storageRef.child(`postulaciones/${ref.key}/archivo3.pdf`);

        var promesaFile3 = mountainsRef.put(file3)


        Promise.all([promesaFile1, promesaFile2, promesaFile3]).then((values) => {
          console.log(values[0].a.downloadURLs[0])
          this.solicitud['urlFile1'] = values[0].a.downloadURLs[0]
          this.solicitud['urlFile2'] = values[1].a.downloadURLs[0]
          this.solicitud['urlFile3'] = values[2].a.downloadURLs[0]

          this.solicitud['fechaCreado'] = moment().format('DD/MM/YYYY HH:mm')
          this.solicitud['fechaActualizado'] = moment().format('DD/MM/YYYY HH:mm')


          return ref.set(this.solicitud).then(() => {
            this.consultaDatosTabla()

            if (this.solicitud['Correo electrónico'] != '') {
              let notificationInfo = 'Solicitud de movilidad entrante creada por un par externo'
              this._mailServiceService
                .crearNotification(environment.mails.dirDRI, notificationInfo)
                .subscribe((responseData) => {
                  console.log(responseData)
                }, error => { console.log(error) })


              var body = 'cuerpo del correo de solicitud de par externo'
              var correos = `${this.solicitud['Correo electrónico']},${environment.mails.dirDRI}`
              return this.enviarCorreo(correos, "Solicitud de movilidad entrante creada por un par externo", body)
                .subscribe((responseData) => {
                  console.log(responseData)

                  if (responseData) {
                    swal(
                      'Solicitud creada correctamente',
                      '',
                      'success'
                    )
                  } else {
                    swal(
                      'Solicitud creada correctamente',
                      '',
                      'success'
                    )
                  }

                }, error => {

                  console.log(error)
                })

            } else {

              return
            }

          })

        }).catch(error => {
          swal(
            `${error}`,
            '',
            'error'
          )
          console.log(error)
        })

      } else {
        swal(
          `Todos los documentos son requeridos`,
          '',
          'error'
        )
      }




    }

  }

  // onFileChange(event) {
  //   let reader = new FileReader();

  //   if (event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     console.log(file)
  //     // reader.readAsDataURL(file);
  //     var storageRef = this.firebaseStorage.ref();
  //     var mountainsRef = storageRef.child(`llave/archivo1.pdf`);

  //     mountainsRef.put(file).then(function (snapshot) {
  //       console.log('Uploaded a blob or file!');
  //     });

  //   };

  // }
  setsolicitud() {
    this.solicitud = {
      "AÑO": this.year,
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
      "CODIGO_CONVENIO": "ARG005",
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
