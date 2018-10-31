import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MailServiceService } from "../../../shared/services/main-service.service";


@Component({
  selector: 'app-directores-programa-uv',
  templateUrl: './directores-programa-uv.component.html',
  styleUrls: ['./directores-programa-uv.component.css']
})
export class DirectoresProgramaUvComponent implements OnInit {

  solicitudes: any;
  solicitud: any;
  dataTablaSolicitudes = [];
  db: any
  displayedColumns = ['correo', 'fecha', 'facultad', 'nombre', 'estado'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaSolicitudesCarrera: ElementRef;
  @ViewChild('panelinferior') panelInferior: ElementRef;
  @ViewChild('panelSuperiorButton') panelSuperiorButton: ElementRef;
  @ViewChild('panelinferiorButton') panelinferiorButton: ElementRef;

  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any,
    private _mailServiceService:MailServiceService) {
    this.db = firebaseApp.database();
    this.solicitudes = {}

    this.solicitud = {
      fecha: { dia: "", mes: "", ano: "" },
      solicitante: { nombre: "", programa: "", objetivo: "", alcance: "", justificacion: "", beneficios: "", coordinador: "", institucion: "", replegal: "", telefono: "", fax: "", correo: "" },
      conveniocontrato: { duracion: "", valor: "", resolucion: "", tipo: { convenio: { marco: false, especifico: false }, contrato: false }, clasificacion: { internacional: false, nacional: false, departamental: false, municipal: false, entidad: { publica: false, privada: false } } },
      tipoconvcont: { academico: { mov: false, ies: false, act: false, sac: false, ppp: false, cap: false, cos: false, oaa: false }, investigacion: { pdi: false, oai: false }, bienestar: { abu: false }, interna: { mi: false, pci: false } },
      vicerectoria: "",
      presupuesto: { ing: 0, idp: 0, ti: 0, gas: 0, mys: 0, galoj: 0, gali: 0, gtran: 0, cper: 0, pnu: 0, peu: 0, ops: 0, eqac: 0, iif: 0, gasg: 0, viu: 0, imp: 0, cap: 0, totcos: 0, dif: 0, sala: 0, repu: 0, per30: 0, ctp17: 0, valemi: 0, conciu: 0, rendf: 0, disr: 0, fc: 0, foi: 0, totalrec: 0 },
      observaciones: "",
      correo_solicitante: "",
      uid_diligenciado: "",
      correo_diligenciado: ""
    }
  }

  ngOnInit() {
    this.consultaDatosTabla()

  }
  consultaDatosTabla() {
    this.db.ref('/solicitudes/').once('value').then(solicitudesSnap => {
      this.dataTablaSolicitudes = [];

      solicitudesSnap.forEach((solicitudSnap) => {

        let dato = solicitudSnap.val()

        this.solicitudes[solicitudSnap.key] = dato
        let correo = dato.correo_solicitante || ''
        let dia = dato.fecha.dia || ''
        let mes = dato.fecha.mes || ''
        let ano = dato.fecha.ano || ''

        let fecha = `${dia}/${mes}/${ano}` || ''
        let facultad = dato.solicitante.programa || ''
        let nombre = dato.solicitante.nombre || ''
        let estado = dato.estado || 'Pendiente'
        let comentarioDenegacion = dato.comentarioDenegacion || 'Ninguno'

        this.dataTablaSolicitudes.push({
          correo: correo,
          fecha: fecha,
          facultad: facultad,
          nombre: nombre,
          key: solicitudSnap.key,
          estado: estado,
          comentarioDenegacion: comentarioDenegacion
        })

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
    const _convenioSelected = this.solicitudes[solic.key];
    this.solicitud = _convenioSelected
    this.solicitud.key = solic.key
    if (this.panelInferior.nativeElement.classList.contains('collapsed-box')) {
      this.panelinferiorButton.nativeElement.click()
    }
    this.panelInferior.nativeElement.scrollIntoView();

  }

  toglePanelDescripcion() {


  }

  aprobar() {
    swal.showLoading()
    var _this = this

    const promise = this._angularfire.object(`/solicitudes/${this.solicitud.key}/`).update({ estado: 'aprobada por el director de programa' });
    promise
      .then(res => {
        var body ='cuerpo del correo de aceptacion'

        return this.enviarCorreo(this.solicitud.correo_diligenciado,"Solicitud Aprobada por el director de programa",body)
        .subscribe((responseData) => {
          console.log(responseData)
          _this.consultaDatosTabla()

          if (responseData) {
            swal({
              title: `Solicitud actualizada`
            })
          } else {
            swal({
              title: `Solicitud actualizada`
            })
          }
          
        }, error=>{
          _this.consultaDatosTabla()

          console.log(error)
        })
        
      })
      .catch(err => {
        swal({
          title: `${err}`
        })
        console.log(err, 'You dont have access!')
      });

  }

  denegar() {
    var _this = this
    var mensajeDenegacion=''
    const promise = this._angularfire.object(`/solicitudes/${this.solicitud.key}/`);

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
          estado: 'Denegada por el director de programa',
          comentarioDenegacion: `${mensaje}`
        })
          
      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        var body =`cuerpo del correo de la razon por la cual la solicitud es denegada 
                    ${result} -- ${mensajeDenegacion}`

        return this.enviarCorreo(this.solicitud.correo_diligenciado,"Solicitud denegada por el director de programa",body)
        .subscribe((responseData) => {
          console.log(responseData)
          _this.consultaDatosTabla()

          if (responseData) {
            swal({
              title: `Solicitud actualizada`
            })
          } else {
            swal({
              title: `Solicitud actualizada`
            })
          }
          
        }, error=>{
          _this.consultaDatosTabla()

          console.log(error)
        })
        
      }
    }).catch(error=>{
      console.log(error)

    })
  }

  enviarCorreo(email,asunto,mensaje,cc ='',cco='') {

    return this._mailServiceService
    .send(email, asunto, mensaje, cc, cco)
    
  }
}