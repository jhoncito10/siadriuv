import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService } from "../../../shared/services/main-service.service";
import * as  moment from "moment";
import * as firebase from "firebase";
import { MomentModule } from 'angular2-moment';

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

  displayedColumns = ['correo', 'ano', 'destino', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  universidadProcedencia = 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA'

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva solicitud; 2 = datos solicitud

  year

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
    private _MomentModule: MomentModule
  ) {
    this.db = firebaseApp.database();
    this.firebaseStorage = firebase.storage();
    console.log(firebaseApp)
    this.solicitudes = {}
    this.year = moment().year()
    this.setsolicitud()
  }

  ngOnInit() {
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

    // if (this.validarDatosFormlario()) {      
      if (true) {      

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



          return ref.set(this.solicitud).then(()=>{
            // this.consultaDatosTabla()

            if (this.solicitud['Correo electrónico'] != '') {
              var body = 'cuerpo del correo de solicitud de par externo'
    
              return this.enviarCorreo(this.solicitud['Correo electrónico'], "Solicitud par externo", body)
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

      }else{
        swal(
          `Todos los documentos son requeridos`,
          '',
          'error'
        )
      }
    
     
      
     
    }

  }

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
      "fechaCreado":"",
      "fechaActualizado":"",
      "estado":"En espera de aprobación DRI"
    }
  }


  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }
}
