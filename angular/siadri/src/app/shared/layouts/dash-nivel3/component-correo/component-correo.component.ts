import { Component, OnInit, ViewChild } from '@angular/core';
import { MailServiceService, ConveniosService } from '../../../services/main-service.service';
import swal from 'sweetalert2';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';

declare var $: any;

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

  usuario;

  constructor(private service: ConveniosService, private http: Http, private mail: MailServiceService) {

  }

  ngOnInit() {

    this.cargarfacultades();

    this.usuario = JSON.parse(localStorage.getItem('usuario'));


    this.service.consultarHistorial().subscribe(datos => {
      this.historial = datos;
      this.dataSource.data = datos;

      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, 200)
    });

    console.log(this.usuario);
  }

  cambiarDataHistorial(item) {
    console.log(item);
    this.historialsel = item;

    setTimeout(() => {
      $('#mensajeHtml').html(this.historialsel.mensaje);
    }, 1000);

    for (const key in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(key)) {
        const element = this.formCheckBox[key];
        element.setValue(false);
      }
    }
  }

  editarFiltros(item) {
    for (let i = 0; i < this.historialsel.filtro.length; i++) {
      const key = this.historialsel.filtro[i];
      this.formCheckBox[key].setValue(true);

      if (key !== 'todos') {
        this.formCheckBox['todos'].setValue(false);
        if (key === 'directores') {
          const valoresform = [];
          this.selectDir.enable();
          this.historialsel.valores[key].forEach(element => {

            const objenc = this.facultades.find(o => o === element);

            valoresform.push(objenc);
          });

          this.selectDir.setValue(valoresform);

        }
      }
    }

    if (item === 'reenviar') {
      this.notificacion = this.historialsel.mensaje;
      this.correo.asunto = this.historialsel.asunto;
      this.correo.mensaje = this.historialsel.mensaje;
      this.aplicarFiltros(this.historialsel.type);
    } else {
      $('#modalHisto').modal('hide');
      $('select').prop('disabled', false);
      if (this.historialsel.type === 'correo') {
        this.correo.asunto = this.historialsel.asunto;
        this.correo.mensaje = this.historialsel.mensaje;
        console.log(this.correo);
        $('.nav-tabs a[href="#home"]').tab('show');
      } else {
        this.notificacion = this.historialsel.mensaje;
        $('.nav-tabs a[href="#menu1"]').tab('show');
      }
    }
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

  aplicarFiltros(item) {
    this.correos = [];
    this.ejecutarQuerys().then(() => {
      if (this.correos.length !== 0) {
        const correos = this.eliminateDuplicates(this.correos);

        if (item === 'correo') {
          console.log(correos);
          if (correos.length !== 0) {
            this.servicioCorreo(correos);
          }

        } else {
          console.log(correos);
          this.servicioNotificacion(correos);

        }

        if (correos.length !== 0) {
          this.servicioalmacenarHistorial(item);
        }
      } else {
        swal('', 'No existen correos que correspondan a los filtros asociados.', 'error');
      }

    });
  }

  servicioCorreo(correos) {

    let cor = '';
    for (let i = 0; i < correos.length; i++) {
      cor += correos[i] + ',';
    }
    cor = cor.slice(0, -1);

    this.mail.send(cor, this.correo.asunto, this.correo.mensaje).subscribe(res => {
      console.log(res);
    });

    console.log(cor);

  }

  servicioNotificacion(notificaciones) {

    this.mail.AnycrearNotifications(notificaciones, this.notificacion).subscribe(res => {
      console.log(res);
    });

  }

  servicioalmacenarHistorial(tipo) {
    const valores = {};
    valores['directores'] = this.selectDir.value;

    const obj = {
      asunto: '',
      mensaje: '',
      type: tipo,
      fecha: new Date().toISOString(),
      email: this.usuario.email,
      filtro: this.valoresCheckbox(),
      valores: valores,
      texto: this.buscaObjectos()
    };

    if (tipo === 'correo') {
      obj.asunto = this.correo.asunto;
      obj.mensaje = this.correo.mensaje;
    } else {
      obj.asunto = 'notificacion'
      obj.mensaje = this.notificacion;
    }
    console.log(obj);
    this.service.agregarHistorial(obj).then(() => {

    });

  }

  buscaObjectos() {
    const texto = {};
    for (const clave in this.formCheckBox) {

      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if (element) {

          texto[clave] = this.textoSwicth(clave);

        }
      }
    }
    return texto;
  }

  textoSwicth(element) {
    switch (element) {
      case 'todos': {
        return 'Todos los correos';
      }
      case 'pares': {
        return 'Pares Externos';
      }
      case 'estudiantesAct': {
        return 'Solicitantes Activos';
      }
      case 'estudiantesInac': {
        return 'Solicitantes Inactivos';
      }
      case 'directores': {
        return 'Directores de programa';
      }
      case 'nivel2': {
        return 'Correos de Nivel 2';
      }
      case 'nivel3': {
        return 'Correos de Nivel 3';
      }
      case 'admin': {
        return 'Administradores';
      }

    }
  }

  valoresCheckbox() {
    const valores = [];
    for (const clave in this.formCheckBox) {
      if (this.formCheckBox.hasOwnProperty(clave)) {
        const element = this.formCheckBox[clave].value;

        if (element) {
          valores.push(clave);
        }
      }
    }

    return valores;
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
