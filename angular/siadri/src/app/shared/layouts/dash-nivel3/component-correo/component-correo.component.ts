import { Component, OnInit, ViewChild } from '@angular/core';
import { MailServiceService, ConveniosService } from '../../../services/main-service.service';
import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';
@Component({
  selector: 'app-component-correo',
  templateUrl: './component-correo.component.html',
  styleUrls: ['./component-correo.component.css']
})
export class ComponentCorreoComponent implements OnInit {

  itemsel: any;

  arregloSinFiltros = [];

  objsel = {
    sede: 'inicial',
    facultad: 'inicial',
    departamento: 'inicial',
    escuela: 'inicial'
  };

  htmlContent: any;

  correo = {
    asunto: '',
    mensaje: ''
  };

  notificacion: '';

  caracteres = 140;

  persona: any;

  historial = [];
  historialsel: any;

  displayedColumns = ['asunto', 'tipo', 'email', 'fecha'];
  dataSource = new MatTableDataSource([]);
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;


  formCheckBox = {
    todos: new FormControl({ value: false, disabled: false }),
    pares: new FormControl({ value: false, disabled: false }),
    estudiantesAct: new FormControl({ value: false, disabled: false }),
    estudiantesInac: new FormControl({ value: false, disabled: false }),
    directores: new FormControl({ value: false, disabled: false }),
    nivel2: new FormControl({ value: false, disabled: false }),
    nivel3: new FormControl({ value: false, disabled: false }),
    admin: new FormControl({ value: false, disabled: false }),
  };

  selectDir = new FormControl({ value: '', disabled: true });

  listSelect = {
    todos: [],
    pares: [],
    estudiantesAct: [],
    estudiantesInac: [],
    directores: [],
    nivel2: [],
    nivel3: [],
    admin: []
  };

  facultades = [];

  correos = [];

  constructor(private service: ConveniosService, private http: Http) {

  }

  ngOnInit() {

    this.cargarfacultades();
  }



  ejecutarQuerys() {
    const array = ['todos', 'pares', 'estudiantesAct', 'estudiantesInac', 'directores', 'nivel2', 'nivel3', 'admin'];
    let cont = 0;
    const tam = this.getTamanoValores(array);
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (this.formCheckBox[element].value) {
          this.swicthFiltros(element).then(() => {
            cont++;
            console.log(cont, tam);
            if (cont === tam) {
              resolve();
            }
          });
        }

      }
    });

    return promise;


  }

  getTamanoValores(array) {
    let cont = 0;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (this.formCheckBox[element].value) {
        cont++;
      }
    }

    return cont;
  }

  swicthFiltros(element) {

    const prom = new Promise((resolve, reject) => {
      let cont = 0;
      switch (element) {
        case 'todos': {
          this.service.getCollection('usuarios').subscribe(data => {

            data.forEach(doc => {
              this.correos.push(doc.email);

              cont++;

              if (data.length === cont) {
                resolve();
              }

            });
          });
        }
          break;
        case 'pares': {
          this.service.getCollection('paresExternos').subscribe(par => {
            par.forEach(doc => {
              this.correos.push(doc.correo);
              cont++;

              if (par.length === cont) {
                resolve();
              }
            });
          });
        }
          break;
        case 'estudiantesAct': {
          this.service.getCollection('postulaciones').subscribe(par => {
            par.forEach(doc => {
              if (doc['estado'] !== 'Denegada por dirección de programa' && doc['estado'] !== 'Denegada por DRI UV') {
                this.correos.push(doc['Correo electrónico']);
              }

              cont++;

              if (par.length === cont) {
                resolve();
              }
            });
          });
        }
          break;
        case 'estudiantesInac': {
          this.service.getCollection('postulaciones').subscribe(par => {
            par.forEach(doc => {
              if (doc['estado'] === 'Denegada por dirección de programa' || doc['estado'] === 'Denegada por DRI UV') {
                this.correos.push(doc['Correo electrónico']);
              }
              cont++;

              if (par.length === cont) {
                resolve();
              }
            });
          });
        }
          break;
        case 'directores': {

          const dir = this.selectDir.value;
          if (dir.length === 0) {
            this.service.getCollection('programasAcademicos').subscribe(par => {
              par.forEach(doc => {
                if (doc.correo) {
                  this.correos.push(doc.correo);
                }

                cont++;

                if (par.length === cont) {
                  resolve();
                }
              });

            });
          } else {
            for (let j = 0; j < dir.length; j++) {
              this.service.getnodeGeneral('programasAcademicos', 'FACULTAD-INSTITUTO', dir[j]).subscribe(par => {
                par.forEach(doc => {
                  if (doc.correo) {
                    this.correos.push(doc.correo);
                  }

                  cont++;

                  if (par.length === cont) {
                    resolve();
                  }
                });
              });
            }
          }
        }
          break;
        case 'nivel2': {
          this.service.getnodeGeneral('usuarios', 'roles', 'NIVEL2').subscribe(par => {
            par.forEach(doc => {
              this.correos.push(doc.email);
              cont++;

              if (par.length === cont) {
                resolve();
              }
            });
          });

        }
          break;
        case 'nivel3': {
          this.service.getnodeGeneral('usuarios', 'roles', 'NIVEL3').subscribe(par => {
            par.forEach(doc => {
              this.correos.push(doc.email);
              cont++;

              if (par.length === cont) {
                resolve();
              }
            });
          });
        }
          break;
        case 'admin': {
          this.service.getnodeGeneral('usuarios', 'roles', 'ADMIN').subscribe(par => {
            par.forEach(doc => {
              this.correos.push(doc.email);
              cont++;



              if (par.length === cont) {
                resolve();
              }
            });
          });
        }
          break;
      }
    });

    return prom;

  }

  aplicarFiltros() {
    this.correos = [];
    this.ejecutarQuerys().then(() => {
      const correos = this.eliminateDuplicates(this.correos);

      console.log(correos);


    });
  }


  controlChecks(item) {
    const arr = ['pares', 'estudiantesAct', 'estudiantesInac', 'directores', 'nivel2', 'nivel3', 'admin'];
    if (item === 'todos') {
      if (this.formCheckBox[item].value) {
        arr.forEach(elemen => {
          this.formCheckBox[elemen].setValue(false);
          this.formCheckBox[elemen].disable();
        });
      } else {
        arr.forEach(elemen => {
          this.formCheckBox[elemen].enable();
        });
      }
    } else if (item === 'nivel2') {
      if (this.formCheckBox[item].value) {
        for (let i = 0; i < 3; i++) {
          this.formCheckBox[arr[i]].setValue(false);
          this.formCheckBox[arr[i]].disable();
        }

        this.selectDir.disable();

      } else {
        for (let i = 0; i < 3; i++) {
          this.formCheckBox[arr[i]].enable();
        }
      }
    } else {
      if (this.formCheckBox[item].value) {
        this.selectDir.enable();
      } else {
        this.selectDir.disable();
        this.selectDir.setValue('');
      }
    }

  }

  cargarfacultades() {
    this.service.getProgramas().subscribe(data => {
      const aray = this.removeDuplicates(data, 'FACULTAD-INSTITUTO');
      aray.forEach(doc => {
        this.facultades.push(doc['FACULTAD-INSTITUTO']);
      })
    });
  }


  removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};

    // tslint:disable-next-line:forin
    for (const i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    // tslint:disable-next-line:forin
    for (const i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  eliminateDuplicates(arr) {
    let i;
    const len = arr.length;
    const out = [];
    const obj = {};

    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    // tslint:disable-next-line:forin
    for (i in obj) {
      out.push(i);
    }
    return out;
  }

  cambiarNumeroCaracteres(value) {
    this.caracteres = 140;
    this.caracteres -= value.length;
  }


}
