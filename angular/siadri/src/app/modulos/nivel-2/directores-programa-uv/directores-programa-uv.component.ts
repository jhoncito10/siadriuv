import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-directores-programa-uv',
  templateUrl: './directores-programa-uv.component.html',
  styleUrls: ['./directores-programa-uv.component.css']
})
export class DirectoresProgramaUvComponent implements OnInit {

  convenios: any;
  convenio: any;
  dataTablaSolicitudes = [];

  displayedColumns = ['correo', 'fecha', 'facultad', 'nombre'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tablaSolicitudesCarrera') tablaConvenios: ElementRef;
  @ViewChild('descripcionConvenio') descripcionConvenio: ElementRef;
  @ViewChild('conveniosButton') conveniosButton: ElementRef;
  @ViewChild('descripcionConvenioButton') descripcionConvenioButton: ElementRef;

  constructor(private _angularfire: AngularFireDatabase,private localSt:LocalStorageService) {
    this.convenio = {
      
    }
  }

  ngOnInit() {
    this._angularfire.list('/solicitudes/')
    // .take(1)
    .subscribe(data => {
        console.log('programa',data)
      // this.storage.store('convenios', data);
      data.forEach((dat, index)=>{
        let dato = dat
        console.log(dato)
        let correo=dato.correo_solicitante || ''
        let fecha=`${dato.fecha.dia}/${dato.fecha.mes}/${dato.fecha.ano}` ||''
        let facultad=dato.solicitante.programa || ''
        let nombre=dato.solicitante.nombre || ''

        this.dataTablaSolicitudes.push({
          correo:correo,
          fecha:fecha,
          facultad:facultad,
          nombre:nombre       
        })
      })
      this.dataSource = new MatTableDataSource(this.dataTablaSolicitudes);
  
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.tablaConvenios.nativeElement.classList.remove('collapsed-box')
        this.conveniosButton.nativeElement.classList.remove('fa-plus')
        this.conveniosButton.nativeElement.classList.add('fa-minus')
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


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
