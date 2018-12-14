import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { LocalStorageService } from 'ngx-webstorage';

import * as moment from 'moment';
import swal from 'sweetalert2';
import { NativeFirebaseService } from '../../../shared/services/main-service.service';
import { FirebaseApp } from 'angularfire2';
import { Http } from '@angular/http';

@Component({
  selector: 'app-admin-convenios',
  templateUrl: './admin-convenios.component.html',
  styleUrls: ['./admin-convenios.component.css']
})
export class AdminConveniosComponent implements OnInit, AfterViewInit {

  convenios: any;
  convenio: any;
  nuevoConv = false;
  dataTablaConvenios = [];
  spiner: boolean;

  displayedColumns = ['key', 'pais', 'institucion', 'facultad', 'tipo', 'estado'];
  dataSource: any;

  paises = [];

  file: File;

  firebaseStorage: any

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tablaConvenios') tablaConvenios: ElementRef;
  @ViewChild('descripcionConvenio') descripcionConvenio: ElementRef;
  @ViewChild('conveniosButton') conveniosButton: ElementRef;
  @ViewChild('descripcionConvenioButton') descripcionConvenioButton: ElementRef;


  constructor(private _angularfire: AngularFireDatabase, private localSt: LocalStorageService,
    private _NativeFirebaseService: NativeFirebaseService, private http: Http) {
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

    this.cargarPaises();

    this.firebaseStorage = this._NativeFirebaseService.fb.storage();
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    // Observa el cambio en la variable local que contiene los convenios
    setTimeout(() => {
      this._angularfire.list('convenios', { preserveSnapshot: true }).subscribe(data => {
        this.getDataConvenios(data);
      });

    });

  }

  cargarPaises() {
    this._angularfire.list('paises').subscribe(data => {
      data.forEach(doc => {
        this.paises.push(doc['nombre_pais']);
      });
    });

    console.log(this.paises);
  }

  nuevoConvenio() {
    this.nuevoConv = true;

    this.convenio = {
      'Alcance': '', 'Archivo': '', 'Areas de Cooperación': '', 'Aviso': '',
      'CIENCIAS': '', 'CIENCIAS DE LA ADMINISTRACIÓN': '',
      'CIENCIAS SOCIALES Y ECONOMICAS': '', 'Contacto': '', 'Contacto Movilidad': '',
      'Dirección': '', 'Email': '', 'Estado': 'Activo', 'FAI': '', 'Facultad': '',
      'Fecha de firma': '', 'Fecha de vencimiento': '', 'HUMANIDADES': '',
      'INGENIERIA': '', 'INSTITUTO DE PEDAGOGIA': '', 'INSTITUTO DE PSICOLOGIA': '',
      'Institucion': '', 'Objetivo': '', 'Objeto': '', 'Pais': '', 'Profesor': '',
      'Profesores encargados segun Area': '', 'Página Web': '', 'SALUD': '', 'Tipo': '',
      'Tipo de específico': '', 'URL of agreement': '', 'Unidad Academica': '', 'Vencidos': '',
      'email': ''
    };

    this.toglePanelDescripcion()
  }

  fileStorage(key) {
    console.log(this.file)
    // reader.readAsDataURL(file);
    const storageRef = this.firebaseStorage.ref();
    const mountainsRef = storageRef.child(`convenios/${key}/${this.file.name}`);
    return mountainsRef.put(this.file);
  }


  getDataConvenios(data) {
    this.spiner = true;

    const arr = [];

    data.forEach(element => {
      const aux = element.val();
      aux['key'] = element.key;
      arr.push(aux);
    });

    this.dataSource = new MatTableDataSource(arr);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.spiner = false;

    this.tablaConvenios.nativeElement.classList.remove('collapsed-box')
    this.conveniosButton.nativeElement.classList.remove('fa-plus')
    this.conveniosButton.nativeElement.classList.add('fa-minus')

  }

  guardar() {
    console.log(this.convenio);

    if (this.convenio['Fecha de firma'].indexOf('-') !== -1) {
      this.convenio['Fecha de firma'] = moment(this.convenio['Fecha de firma']).format('DD/MM/YYYY');
    }

    if (this.convenio['Fecha de vencimiento'].indexOf('-') !== -1) {
      this.convenio['Fecha de vencimiento'] = moment(this.convenio['Fecha de vencimiento']).format('DD/MM/YYYY');
      this.convenio['Vencimiento'] = true;
    }

    if (!this.nuevoConv) {
      this._angularfire.object('convenios/' + this.convenio.key).set(this.convenio).then(() => {
        swal(
          '',
          'Exito, datos actualizados',
          'success');

        if (this.file) {
          this.fileStorage(this.convenio.key).then(data => {
            const obj = {
              'Archivo': data.a.downloadURLs[0]
            };

            this._angularfire.object('convenios/' + this.convenio.key).update(obj);

          });
        }
      }).catch(error => {

        swal(
          '',
          '' + error,
          'error');
      });


    } else {
      let acron = '';

      let cont = 1;

      this._angularfire.list('convenios', {
        query: {
          orderByChild: 'Pais',
          equalTo: this.convenio.Pais
        },
        preserveSnapshot: true
      }).subscribe(data => {
        if (cont === 1) {
          if (this.validador()) {
            if (data.length !== 0) {
              acron = data[0].key.substr(0, 3);

              const tam = (data.length + 1);

              if (tam < 10) {
                acron += '00' + tam;
              } else if (10 <= tam && tam <= 100) {
                acron += '0' + tam;
              } else {
                acron += '' + tam;
              }
            } else {
              acron = this.convenio.Pais.toUpperCase().substr(0, 3) + '001';
            }
            const ref = 'convenios/' + acron;


            this._angularfire.object(ref).set(this.convenio).then(() => {
              swal(
                'Exito, convenio creado',
                '',
                'success');

              if (this.file) {
                this.fileStorage(acron).then(url => {
                  const obj = {
                    'Archivo': url.a.downloadURLs[0]
                  };

                  this._angularfire.object(ref).update(obj);

                });
              }
            }).catch(error => {

              swal(
                '' + error,
                '',
                'error');
            });



          } else {
            swal(
              'Revise los campos Institucion, Pais, Tipo, Objeto, Fecha de firma y Facultad.' +
              ' estos campos son obligatorios.',
              '',
              'error');
          }
          cont++;
        }


      });


    }





  }

  onFileChange(event) {
    this.file = event.target.files[0];
    console.log(event.target.files[0]);
  }

  validador() {
    let bool = false;
    if (this.convenio['Fecha de firma'] !== '' && this.convenio['Tipo'] !== '' &&
      this.convenio['Institucion'] !== '' && this.convenio['Pais'] !== '' &&
      this.convenio['Facultad'] !== '' && this.convenio['Objeto'] !== '') {
      bool = true;
    }

    return bool;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  selectConvenio(conv) {
    this.convenio = conv;

    this.nuevoConv = false;

    console.log(conv);
    if (this.convenio['Fecha de firma'].indexOf('/') !== -1) {
      this.convenio['Fecha de firma'] = moment(this.convenio['Fecha de firma']).format('YYYY-MM-DD');
    }

    if (this.convenio['Fecha de vencimiento'].indexOf('/') !== -1) {
      this.convenio['Fecha de vencimiento'] = moment(this.convenio['Fecha de vencimiento']).format('YYYY-MM-DD');
    }

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

  link() {
    window.open(this.convenio['Archivo']);
  }

  probar () {
    console.log('ssds');
    this.http.get(
      'https://us-central1-siadri-dev.cloudfunctions.net/validarPostulaciones'
    ).subscribe(data => {
      console.log(data);
    });
  }
}


