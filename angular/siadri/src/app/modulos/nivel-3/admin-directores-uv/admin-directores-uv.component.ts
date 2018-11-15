import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService } from "../../../shared/services/main-service.service";
import * as  moment from "moment";
import * as firebase from "firebase";

@Component({
  selector: 'app-admin-directores-uv',
  templateUrl: './admin-directores-uv.component.html',
  styleUrls: ['./admin-directores-uv.component.css']
})
export class AdminDirectoresUvComponent implements OnInit {



  //datos consulta
  programasAcademicos: any;
  // solicitud selecionada
  programa: any;
  // variable para la instacia de realtime databe de firebase
  db: any
  //datos de la tabla
  firebaseStorage: any
  dataTablaprogramasAcademicos = [];

  displayedColumns = ['correo', 'programa', 'estado'];
  dataSource: MatTableDataSource<any>;


  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva programa; 2 = datos programa

  rowSelected


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaprogramasAcademicosCarrera: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;




  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService: MailServiceService
  ) {
    this.db = firebaseApp.database();
    this.programasAcademicos = {}
    this.setprograma()
  }

  ngOnInit() {
    this.consultaDatosTabla()

  }
  consultaDatosTabla() {
    this.db.ref('/programasAcademicos/')
      // .orderByChild("TIPO DE MOVILIDAD")
      // .equalTo('ENTRANTE')
      .once('value', programasAcademicosSnap => {
        this.estadoComponenteInferior = 0
        this.dataTablaprogramasAcademicos = [];
        // console.log('consulta tabla', programasAcademicosSnap)

        programasAcademicosSnap.forEach((programaSnap) => {

          let dato = programaSnap.val()
          // console.log(dato)
          this.programasAcademicos[programaSnap.key] = dato
          let correo = dato['correo'] || 'Ninguno'
          let programa = dato['programa'] || ''
          let estado = dato['estado'] || 'Activo'



          this.dataTablaprogramasAcademicos.push({
            correo: correo,
            programa: programa,
            estado: estado,
            key: programaSnap.key
          })

        })

        this.dataSource = new MatTableDataSource(this.dataTablaprogramasAcademicos);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.tablaprogramasAcademicosCarrera.nativeElement.classList.contains('collapsed-box')) {
          this.panelSuperiorButton.nativeElement.click()
        }
      }).catch((error) => console.log(`${error}`))
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectprograma(row) {
    this.estadoComponenteInferior = 2
    this.rowSelected = row;

    this.programa = row
    console.log(row.key, this.rowSelected.key)
    this.programa.key = row.key


    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

  }

  actualizarPrograma() {
    if (this.validarCorreoUnivalle(this.programa.correo)) {
      swal({
        title: 'Cargando',
        html: '',
        onOpen: () => {
          swal.showLoading()

        }
      })
      var oldcorreo = this.programasAcademicos[this.programa.key].correo || false
      var newmail = this.programa.correo
      newmail = newmail.trim(); // Remove whitespace
      newmail = newmail.toLowerCase();


      var ref = this.db.ref(`/programasAcademicos/${this.programa.key}/correo/`)

      return ref.set(newmail).then(() => {
        this.consultaDatosTabla()
        this.setprograma()
        if (oldcorreo) {
          let body = 'Cuerpo del correo del director que pierde privilegios'

          this.enviarCorreo(oldcorreo, "Pierde derechos administrativos", body)
            .subscribe((responseData) => {
              console.log(responseData)             
            }, error => {

              console.log(error)
            })
        }

        let body = 'Cuerpo del correo del director que gana privilegios'

        this.enviarCorreo(newmail, "Gana derechos administrativos", body)
          .subscribe((responseData) => {
            console.log(responseData)

            if (responseData) {
              swal(
                `Programa académico "${this.programa.programa}" actualizado correctamente`,
                '',
                'success'
              )
            } else {
              swal(
                'Programa académico actualizado correctamente',
                '',
                'success'
              )
            }

          }, error => {

            console.log(error)
          })

      }).catch(error => {
        swal(
          `${error}`,
          '',
          'error'
        )
      })

    } else {
      swal(
        `Correo invalido`,
        '',
        'error'
      )
    }

  }

  validarCorreoUnivalle(email) {
    let mail = email.split('@')
    if (mail[1] == 'correounivalle.edu.co') {
      return true
    } else {
      return false
    }
  }

  editar() {
    this.estadoComponenteInferior = 1

  }
  setprograma() {

    this.programa = {
      correo: '',
      programa: '',
      estado: ''
    }
  }

  validarDatosFormlario() {
  }

  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }

}
