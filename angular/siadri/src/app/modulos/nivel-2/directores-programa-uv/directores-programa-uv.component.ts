import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
// require("firebase/database");

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
  displayedColumns = ['correo', 'fecha', 'facultad', 'nombre'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('panelSuperior') tablaSolicitudesCarrera: ElementRef;
  @ViewChild('panelinferior') descripcionConvenio: ElementRef;
  @ViewChild('panelSuperiorButton') conveniosButton: ElementRef;
  @ViewChild('panelinferiorButton') descripcionConvenioButton: ElementRef;

  constructor(private _angularfire: AngularFireDatabase,
    private localSt: LocalStorageService,
    @Inject(FirebaseApp) firebaseApp: any) {
    this.db = firebaseApp.database();
    this.solicitudes={}

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
    this.db.ref('/solicitudes/').once('value').then(solicitudesSnap => {
      console.log('solicitudes',solicitudesSnap.val())
      solicitudesSnap.forEach((solicitudSnap) => {
          let dato = solicitudSnap.val()

          console.log(solicitudSnap.key,dato)
          this.solicitudes[solicitudSnap.key]=dato
          let correo = dato.correo_solicitante || ''
          let dia = dato.fecha.dia|| ''
          let mes = dato.fecha.mes|| ''
          let ano = dato.fecha.ano|| ''

          let fecha = `${dia}/${mes}/${ano}` || ''
          let facultad = dato.solicitante.programa || ''
          let nombre = dato.solicitante.nombre || ''

          this.dataTablaSolicitudes.push({
            correo: correo,
            fecha: fecha,
            facultad: facultad,
            nombre: nombre,
            key: solicitudSnap.key
          })

      })

      this.dataSource = new MatTableDataSource(this.dataTablaSolicitudes);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.tablaSolicitudesCarrera.nativeElement.classList.remove('collapsed-box')
        this.conveniosButton.nativeElement.classList.remove('fa-plus')
        this.conveniosButton.nativeElement.classList.add('fa-minus')
    })
    // this._angularfire.list('/solicitudes/')
    //   // .take(1)
    //   .subscribe(data => {
    //     this.solicitudes = data;
    //     data.forEach((dat, index) => {
    //       let dato = dat
    //       let correo = dato.correo_solicitante || ''
    //       let fecha = `${dato.fecha.dia}/${dato.fecha.mes}/${dato.fecha.ano}` || ''
    //       let facultad = dato.solicitante.programa || ''
    //       let nombre = dato.solicitante.nombre || ''

    //       this.dataTablaSolicitudes.push({
    //         correo: correo,
    //         fecha: fecha,
    //         facultad: facultad,
    //         nombre: nombre,
    //         key: index
    //       })
    //     })
    //     this.dataSource = new MatTableDataSource(this.dataTablaSolicitudes);

    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;

    //     this.tablaSolicitudesCarrera.nativeElement.classList.remove('collapsed-box')
    //     this.conveniosButton.nativeElement.classList.remove('fa-plus')
    //     this.conveniosButton.nativeElement.classList.add('fa-minus')
    //   });
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

    this.toglePanelDescripcion()
  }

  toglePanelDescripcion() {
    if (this.descripcionConvenio.nativeElement.classList.contains('collapsed-box')) {
      this.descripcionConvenio.nativeElement.classList.remove('collapsed-box')
      this.descripcionConvenioButton.nativeElement.classList.remove('fa-plus')
      this.descripcionConvenioButton.nativeElement.classList.add('fa-minus')
    }
    this.descripcionConvenio.nativeElement.scrollIntoView();

  }

  aprobar(){
    const promise = this._angularfire.object(`/solicitudes/${this.solicitud.key}/`).update({ estado: 'aprobada por el director de programa' });
        promise
          .then(_ => console.log('success'))
          .catch(err => console.log(err, 'You dont have access!'));
          }
          
          denegar(){}
}

// function createConvenio(_key: any, el: any): Convenio {
//   const key = _key
//   const pais = el.Pais || ''
//   const institucion = el.Institucion || ''
//   const facultad = el.Facultad || ''
//   const email = el.Email || ''
//   const tipo = el.Tipo || ''

//   return {
//     key: key,
//     pais: pais,
//     institucion: institucion,
//     facultad: facultad,
//     email: email,
//     tipo: tipo
//   };
// }


// export interface Convenio {
//   key: string,
//   pais: string;
//   institucion: string;
//   facultad: string;
//   email: string;
//   tipo: string;
// }

