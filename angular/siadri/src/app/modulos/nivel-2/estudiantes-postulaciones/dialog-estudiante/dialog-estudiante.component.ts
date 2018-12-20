import { Component, OnInit, Inject } from '@angular/core';
import swal from 'sweetalert2';

import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DialogComponent } from '../../../nivel-3/admin-post-entrantes/dialog/dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MailServiceService, ConveniosService } from '../../../../shared/services/main-service.service';

@Component({
  selector: 'app-dialog-estudiante',
  templateUrl: './dialog-estudiante.component.html',
  styleUrls: ['./dialog-estudiante.component.css']
})
export class DialogEstudianteComponent implements OnInit {


  form: FormGroup;
  description: string;


  myControl: FormControl = new FormControl();

  filteredOptions: Observable<string[]>;


  myControl2: FormControl = new FormControl();

  filteredOptions2: Observable<string[]>;

  variable = false;

  facultades = [];

  identificador = '';

  programa = '';
  programa2 = '';

  select = new FormControl();
  array = [];

  inputs = {
    nombre: new FormControl({ value: '', disabled: true }),
    codigo: new FormControl({ value: '', disabled: true }),
    equivalente: new FormControl({ value: '', disabled: true }),
    grupo: new FormControl({ value: '', disabled: true })
  };

  arrayCambios = [];

  inputsNueva = {
    nombre: new FormControl({ value: '', disabled: false }),
    codigo: new FormControl({ value: '', disabled: false }),
    equivalente: new FormControl({ value: '', disabled: false }),
    grupo: new FormControl({ value: '', disabled: false })
  };


  correo = '';
  identificacion = '';
  nombre = '';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service: ConveniosService,
    private email: MailServiceService) {
    console.log(data);

    this.identificador = data.id;

    this.array = data.cursos;
    this.identificacion = data.identificacion;
    this.nombre = data.nombre;
    this.correo = data.correo;
    console.log(this.array);
  }


  ngOnInit() {

    this.dialogRef.updateSize('60%', '80%');

    this.form = this.fb.group({
      description: [this.description, []]
    });

  }

  CambiarInputs() {
    console.log(this.select.value);
    const item = this.array[this.select.value];
    this.inputs.nombre.setValue(item.nombre);
    this.inputs.codigo.setValue(item.codigo)
    this.inputs.equivalente.setValue(item.equivalente)
    this.inputs.grupo.setValue(item.grupo)
  }

  agregar() {
    const cambio = {
      id: this.select.value,
      cancelar: {
        nombre: this.inputs.nombre.value,
        codigo: this.inputs.codigo.value,
        grupo: this.inputs.grupo.value,
        equivalente: this.inputs.equivalente.value
      },
      nueva: {
        nombre: this.inputsNueva.nombre.value,
        codigo: this.inputsNueva.codigo.value,
        grupo: this.inputsNueva.grupo.value,
        equivalente: this.inputsNueva.equivalente.value
      }
    };

    if (!this.norepetido()) {
      if (this.validar() || this.select.value === '') {
        swal('Por favor diligencie todos los datos', '', 'error');
      } else {
        this.arrayCambios.push(cambio);
      }
    } else {
      swal('no puede cambiar sobre una materia ya agregada', '', 'error');
    }


  }

  norepetido() {
    let a = false;
    for (let i = 0; i < this.arrayCambios.length; i++) {
      const element = this.arrayCambios[i].id;
      if (this.select.value === element) {
        a = true;
      }
    }
    return a;
  }

  validar() {
    let vol = false;
    for (const key in this.inputsNueva) {
      if (this.inputsNueva.hasOwnProperty(key)) {
        const element = this.inputsNueva[key].value;
        if (element === '') {
          vol = true;
        }
      }
    }

    return vol;
  }

  enviar() {
    swal({
      type: 'error',
      text: '¿Está seguro de enviar esta solicitud?',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'No, Cancelar'

    }).then((result) => {

      if (result.value) {

        this.service.updateSolicitud(this.identificador, {
          'solicitudCursos': this.arrayCambios
        }).then(() => {

          this.enviarCorreo();
          this.dialogRef.close();
          swal(
            'Exito',
            '',
            'success'
          );
        }).catch(() => {
          swal(
            'En este momento no es posible guardar los cambios.',
            '',
            'error'
          );
        });
      } else {
        swal(
          'Cancelado',
          '',
          'error'
        );
      }

    });

  }


  enviarCorreo() {

    const fecha = new Date().toISOString().split('T')[0];

    const mensaje = ' Se le notifica que su solicitud de cambio de materias a la postulacion "' + this.identificador + '" ha sido enviada.'
      + ' esta solicitud fue generada en la fecha: ' + fecha;

    let mensaje2 = ' Se le notifica que se ha generado una solicitud de cambio de materias. por favor revisela.'
      + ' la solicitud fue hecha a la postulacion con codigo: "' + this.identificador + '" perteneciente a el estudiante'
      + 'con identificacion: "' + this.identificacion + '", nombre: "' + this.nombre + '" y correo: "' + this.correo + '"'
      + '<br><br><br> <h2>Materias para cancelar</h2><br> <table style="width:100%"><tr><th>Codigo</th>'
      + '<th>Nombre</th> <th>Grupo</th><th>Equivalente</th></tr>';

    for (let index = 0; index < this.arrayCambios.length; index++) {
      const element = this.arrayCambios[index].cancelar;
      mensaje2 += '<tr>';

      mensaje2 += '<td style="text-align: center;">' + element.codigo + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.nombre + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.grupo + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.equivalente + '</td>';

      mensaje2 += '</tr>';
    }

    mensaje2 += '</table><br><br><br> <h2>Materias para agregar</h2><br> <table style="width:100%"><tr><th>Codigo</th>'
    + '<th>Nombre</th> <th>Grupo</th><th>Equivalente</th></tr><tr>';

    for (let index = 0; index < this.arrayCambios.length; index++) {
      const element = this.arrayCambios[index].nueva;
      mensaje2 += '<tr>';
      mensaje2 += '<td style="text-align: center;">' + element.codigo + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.nombre + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.grupo + '</td>';
      mensaje2 += '<td style="text-align: center;">' + element.equivalente + '</td>';
      mensaje2 += '</tr>';
    }

    mensaje2 += '</table>';

    console.log(mensaje, mensaje2, this.correo);

    const noti =  'Se le notifica que se ha generado una solicitud de cambio de materias. por favor revisela.'
    + ' la solicitud fue hecha a la postulacion con codigo: "' + this.identificador + '" perteneciente a el estudiante'
    + 'con identificacion: "' + this.identificacion + '", nombre: "' + this.nombre + '" y correo: "' + this.correo + '"';

    this.email.send(this.correo, 'SOLICITUD DE CAMBIO DE MATERIAS', mensaje).subscribe(data => {
      console.log('envio correo');
    });
    this.email.crearNotification(this.correo, mensaje).subscribe(data => {
      console.log('envio notificaciones');
    });

    this.email.sendMailNivel3('SOLICITUD DE CAMBIO DE MATERIAS', mensaje2).subscribe(data => {
      console.log('envio correo');
    });
    this.email.createNotificationNivel3(noti).subscribe(data => {
      console.log('envio notificaciones');
    });

  }


  close() {
    this.dialogRef.close();
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

  getCleanedString(cadena) {
    // Definimos los caracteres que queremos eliminar
    // tslint:disable-next-line:prefer-const
    let specialChars = '!@#$^&%*()+=-[]\/{}|:<>?,.';

    // Los eliminamos todos
    for (let i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp('\\' + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, '_');

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, 'a');
    cadena = cadena.replace(/é/gi, 'e');
    cadena = cadena.replace(/í/gi, 'i');
    cadena = cadena.replace(/ó/gi, 'o');
    cadena = cadena.replace(/ú/gi, 'u');
    cadena = cadena.replace(/ñ/gi, 'n');
    return cadena;
  }

}
