import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService } from 'ngx-webstorage';
import { MailServiceService, MixedFunctions } from "../../../shared/services/main-service.service";
import { AngularFireAuth } from 'angularfire2/auth';
import * as  moment from "moment";
import { ReturnStatement } from '@angular/compiler';


@Component({
  selector: 'app-admin-pares-externos',
  templateUrl: './admin-pares-externos.component.html',
  styleUrls: ['./admin-pares-externos.component.css']
})
export class AdminParesExternosComponent implements OnInit {



  //datos consulta
  cuentasParesExt: any;
  // solicitud selecionada
  cuenta: any;
  // variable para la instacia de realtime databe de firebase
  db: any
  //datos de la tabla
  firebaseStorage: any
  dataTablaCuentasParesExt = [];

  displayedColumns = ['correo', 'nombre', 'institucion', 'convenio'];
  dataSource: MatTableDataSource<any>;
  instituciones = []
  convenios = []

  estadoComponenteInferior = 0 //0 = ninguno; 1 =  nueva programa; 2 = datos programa

  rowSelected

  loading = true;

  spinnerConvenios = false;
  conveniosSeleccionados = {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') paneslSuperior: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;




  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService: MailServiceService,
    private _MixedFunctions: MixedFunctions,
    private _AngularFireAuth: AngularFireAuth
  ) {
    this.db = firebaseApp.database();
    this.cuentasParesExt = {}
    this.setCuenta()
  }

  ngOnInit() {
    this.consultaDatosTabla()
    this.getInstituciones()


  }
  consultaDatosTabla() {
    this.estadoComponenteInferior = 0

    console.log('consulta tabla')
    this.db.ref('/paresExternos/')
      // .orderByChild("TIPO DE MOVILIDAD")
      // .equalTo('ENTRANTE')
      .once('value')

      .then(solicitudesSnap => {
        this.dataTablaCuentasParesExt = [];

        solicitudesSnap.forEach((solicitudSnap) => {
          let dato = solicitudSnap.val()
          console.log(dato)

          this.cuentasParesExt[solicitudSnap.key] = dato
          let correo = dato['correo'] || ''
          let nombre = dato['nombre'] || ''
          let institucion = dato['institucion'] || ''
          var convenio = ''
          for (const key in dato['convenio']) {
            if (dato['convenio'].hasOwnProperty(key)) {
              const element = dato['convenio'][key];
              if (element) {
                convenio += ' ' + key
              }
            }
          }

          this.dataTablaCuentasParesExt.push({
            correo: correo,
            nombre: nombre,
            key: solicitudSnap.key,
            institucion: institucion,
            convenio: convenio
          })
        })

        this.dataSource = new MatTableDataSource(this.dataTablaCuentasParesExt);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
        if (this.paneslSuperior.nativeElement.classList.contains('collapsed-box')) {
          this.panelSuperiorButton.nativeElement.click()
        }
      }).catch((error) => console.log(`${error}`))
  }
  getInstituciones() {
    var consultaConvenios = this.localSt.retrieve('convenios');
    console.log('local', consultaConvenios);
    if (consultaConvenios) {
      for (const key in consultaConvenios) {

        if (consultaConvenios.hasOwnProperty(key)) {
          const element = consultaConvenios[key];
          if (element.Archivo == 'Activo') {
            this.instituciones.push(element['Institucion'])
          }

        }
      }
      this.instituciones = this._MixedFunctions.removeDuplicadesArray(this.instituciones)

    } else {
      consultaConvenios = []
      return this.localSt.observe('convenios')
        .subscribe((data) => {

          for (const key in data) {

            if (data.hasOwnProperty(key)) {
              const element = data[key];
              if (element.Archivo == 'Activo') {
                this.instituciones.push(element['Institucion'])
              }
            }
          }
          this.instituciones = this._MixedFunctions.removeDuplicadesArray(this.instituciones)

        });
    }
    // for (let index = 0; index < this.convenios.length; index++) {
    //   const element = this.convenios[index];
    //   this.conve[index] = false
    // }
  }

  getConveniosInstitucion(insti) {
    this.spinnerConvenios = true
    this.convenios = []
    console.log(insti)
    return this.db.ref('/convenios/')
      .orderByChild("Institucion")
      .equalTo(insti)
      .once('value')

      .then(conveniosSnap => {
        console.log(conveniosSnap.val())
        var ResConvenios = conveniosSnap.val()
        for (const conv in ResConvenios) {
          if (ResConvenios.hasOwnProperty(conv)) {
            this.convenios.push({
              id: conv,
              data: ResConvenios[conv]
            })
            this.conveniosSeleccionados[conv] = false
          }
        }
        this.spinnerConvenios = false
      })
      .catch(erro => {
        console.log(erro)
        this.spinnerConvenios = true

      })

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectCuenta(row) {
    this.estadoComponenteInferior = 1
    this.rowSelected = row;

    this.cuenta = row
    this.cuenta.key = row.key
    console.log('205',this.conveniosSeleccionados)

    this.getConveniosInstitucion(this.cuenta['institucion']).then(()=>{
      this.conveniosSeleccionados = this.cuentasParesExt[row.key].convenio
      console.log('209',this.conveniosSeleccionados,this.cuentasParesExt[row.key])
    })

    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

  }

  crearnuevaCuenta() {
    console.log(this.conveniosSeleccionados)

    if (this._MixedFunctions.isEmail(this.cuenta.correo)) {
      swal({
        title: 'Cargando',
        html: '',
        onOpen: () => {
          swal.showLoading()

        }
      })
      var newmail = this.cuenta.correo
      newmail = newmail.trim(); // Remove whitespace
      newmail = newmail.toLowerCase();
      var pass = this._MixedFunctions.makePassword()

      this._AngularFireAuth.auth.createUserWithEmailAndPassword(newmail, pass)
        .then((user) => {
          user.sendEmailVerification()

          let body = `
              Cuerpo del correo de cuenta de par externo creada
              usuario: ${this.cuenta['correo']}
              password: ${pass} "Este password es tempral, No olvide cambiarlo"
            `

          this.enviarCorreo(newmail, "Cuenta creada", body)
            .subscribe((responseData) => {


            })
        })
        .catch(error => {
          console.log(error)
          if (error.message != 'The email address is already in use by another account.') {
            swal(
              `${error}`,
              '',
              'error'
            )
          }

        })

      var refPares = this.db.ref(`/paresExternos/`)
      refPares
        .orderByChild("correo")
        .equalTo(this.cuenta['correo'])
        .once('value')
        .then(snap => {
          if (snap.val()) {
            swal(
              `Este correo ya tiene cuenta de par externo`,
              '',
              'info'
            )
          } else {
            var ref = this.db.ref(`/paresExternos/`).push()
            let setUser =
            {
              "nombre": this.cuenta['nombre'],
              "correo": this.cuenta['correo'],
              "institucion": this.cuenta['institucion'],
              "otraInstitucion": this.cuenta['otraInstitucion'],
              "key": this.cuenta['key'],
              "convenio": this.conveniosSeleccionados
            }
            return ref.set(setUser).then(() => {
              this.consultaDatosTabla()
              let body = `
              Cuerpo del correo de cuenta de par externo creada
              usuario: ${this.cuenta['correo']} ahora eres par externo
            `

              this.enviarCorreo(newmail, "Cuenta creada", body)
                .subscribe((responseData) => {
                  console.log(responseData)
                  if (responseData) {
                    swal(
                      `La cuenta para el usuario : "${this.cuenta['nombre']}" se a creado correctamente`,
                      '',
                      'success'
                    )
                  } else {
                    swal(
                      `La cuenta para el usuario : "${this.cuenta['nombre']}" se a creado correctamente`,
                      '',
                      'success'
                    )
                  }
                  this.setCuenta()

                })
            })
          }
        })
        .catch(error => {

        })



    } else {
      swal(
        `Correo invalido`,
        '',
        'error'
      )
    }

  }

  nuevaCuenta() {
    this.estadoComponenteInferior = 2

    this.setCuenta()

    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();
  }

  validarCorreoUnivalle(email) {
    // let mail = email.split('@')
    // if (mail[1] == 'correounivalle.edu.co') {
    //   return true
    // } else {
    //   return false
    // }
  }

  editar() {
    swal.showLoading()

    var ref = this.db.ref(`/paresExternos/${this.cuenta.key}`)
    this.cuenta.fechaActualizado = moment().format('DD/MM/YYYY HH:mm')

    ref.update(this.cuenta).then(() => {
      swal({
        title: `Cuenta actualizada`
      })
    })
  }
  setCuenta() {
    this.cuenta = {
      "nombre": "Francisco par",
      "correo": "francisco.hurtado@geoprocess.com.co",
      "institucion": "",
      "key": "",
      "otraInstitucion": "",
      "convenio": ""
    }
    this.convenios = []

  }



  enviarCorreo(email, asunto, mensaje, cc = '', cco = '') {

    return this._mailServiceService
      .send(email, asunto, mensaje, cc, cco)

  }
}
