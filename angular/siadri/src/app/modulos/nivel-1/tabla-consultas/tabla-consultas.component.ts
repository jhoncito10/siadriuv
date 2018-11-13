import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Component({
  selector: 'app-tabla-consultas',
  templateUrl: './tabla-consultas.component.html',
  styleUrls: ['./tabla-consultas.component.css']
})
export class TablaConsultasComponent implements OnInit {

  convenios: any;
  convenio: any;
  dataTablaConvenios = [];
  spiner:boolean;

  displayedColumns = ['pais', 'institucion', 'facultad', 'tipo'];
  dataSource:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tablaConvenios') tablaConvenios: ElementRef;
  @ViewChild('descripcionConvenio') descripcionConvenio: ElementRef;
  @ViewChild('conveniosButton') conveniosButton: ElementRef;
  @ViewChild('descripcionConvenioButton') descripcionConvenioButton: ElementRef;


  constructor(private _angularfire: AngularFireDatabase,private localSt:LocalStorageService) {
    this.spiner = true;

    this.convenio = {
      pais: '',
      institucion: '',
      documentacion: '',
      site: '',
      cooperacion: '',
      objeto: '',
      email: '',
      tipo: '',
      facultad: ''
    }
  }
  ngOnInit(): void {

    

  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
      //Observa el cambio en la variable local que contiene los convenios
      setTimeout(() => {
        this.getDataConvenios()
      });

  }
 

  getDataConvenios(){
    this.spiner=true;
     var consultaConvenios = this.localSt.retrieve('convenios');
     console.log('local',consultaConvenios);
    if (consultaConvenios) {
        this.convenios = consultaConvenios;
        for (const key in consultaConvenios) {
  
          if (consultaConvenios.hasOwnProperty(key)) {
            const element = consultaConvenios[key];
            if (element.Archivo == 'Activo') {
              this.dataTablaConvenios.push(createConvenio(key, element));
  
            }
  
          }
        }
        this.dataSource = new MatTableDataSource(this.dataTablaConvenios);
  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spiner=true;

        this.tablaConvenios.nativeElement.classList.remove('collapsed-box')
        this.conveniosButton.nativeElement.classList.remove('fa-plus')
        this.conveniosButton.nativeElement.classList.add('fa-minus')
    } else {
      consultaConvenios=[]
      return this.localSt.observe('convenios')
			.subscribe((data) => {
        //executa el script al cambio en la variable local de canvios
        // this.storage.store('convenios', data);
        this.convenios = data;
        for (const key in data) {
  
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            if (element.Archivo == 'Activo') {
              this.dataTablaConvenios.push(createConvenio(key, element));
  
            }
  
          }
        }
        this.dataSource = new MatTableDataSource(this.dataTablaConvenios);
  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spiner=true;

        this.tablaConvenios.nativeElement.classList.remove('collapsed-box')
        this.conveniosButton.nativeElement.classList.remove('fa-plus')
        this.conveniosButton.nativeElement.classList.add('fa-minus')
      });
    }
   
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  selectConvenio(conv) {
    const _convenioSelected = this.convenios[conv.key];
    this.convenio = {
      pais: _convenioSelected.Pais,
      institucion: _convenioSelected.Institucion,
      documentacion: '',
      site: _convenioSelected["Página Web"] || '',
      cooperacion: '',
      objeto: _convenioSelected.Objeto,
      email: _convenioSelected.Email || '',
      tipo: _convenioSelected.Tipo || '',
      facultad: _convenioSelected.Facultad || ''
    }
    console.log(conv.key, this.convenio);
    this.toglePanelDescripcion()
  }

  toglePanelDescripcion() {
    console.log(this.descripcionConvenio.nativeElement.classList.contains('collapsed-box'))
    if (this.descripcionConvenio.nativeElement.classList.contains('collapsed-box')) {
      this.descripcionConvenio.nativeElement.classList.remove('collapsed-box')
      this.descripcionConvenioButton.nativeElement.classList.remove('fa-plus')
      this.descripcionConvenioButton.nativeElement.classList.add('fa-minus')
    }
    this.descripcionConvenio.nativeElement.scrollIntoView();

  }
}
/** Builds and returns a new User. */
function createConvenio(_key: any, el: any): Convenio {
  const key = _key
  const pais = el.Pais || ''
  const institucion = el.Institucion || ''
  const facultad = el.Facultad || ''
  const email = el.Email || ''
  const tipo = el.Tipo || ''

  return {
    key: key,
    pais: pais,
    institucion: institucion,
    facultad: facultad,
    email: email,
    tipo: tipo
  };
}


export interface Convenio {
  key: string,
  pais: string;
  institucion: string;
  facultad: string;
  email: string;
  tipo: string;
}


