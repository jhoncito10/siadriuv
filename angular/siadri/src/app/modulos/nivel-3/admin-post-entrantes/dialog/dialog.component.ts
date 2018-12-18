import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';


import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ConveniosService, MailServiceService } from '../../../../shared/services/main-service.service';

import swal from 'sweetalert2';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

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


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service: ConveniosService, 
    private email: MailServiceService) {
    console.log(data);
    if (data.variable === 'compartir') {
      this.variable = true;
    } else {
      this.variable = false;
    }

    this.identificador = data.id;
  }


  ngOnInit() {

    this.dialogRef.updateSize('60%', '80%');

    this.form = this.fb.group({
      description: [this.description, []]
    });

    this.filteredOptions2 = this.myControl2.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter2(val))
      );

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.cargarfacultades();
  }

  filter2(val: string): string[] {
    const varia = this.getCleanedString(val.trim().toLowerCase());
    return this.facultades.filter(option =>
      this.getCleanedString(option['prog'].trim().toLowerCase()).indexOf(varia) !== -1);
  }

  filter(val: string): string[] {
    const varia = this.getCleanedString(val.trim().toLowerCase());
    return this.facultades.filter(option =>
      this.getCleanedString(option['prog'].trim().toLowerCase()).indexOf(varia) !== -1);
  }

  cargarfacultades() {
    this.service.getProgramas().subscribe(data => {
      const aray = this.removeDuplicates(data, 'NOMBRE PROGRAMA ACADEMICO');
      aray.forEach(doc => {
        this.facultades.push({prog: doc['NOMBRE PROGRAMA ACADEMICO'], correo: doc['correo']});
      })
    });
  }

  save() {
    console.log(this.identificador, this.programa, this.programa2);

    if (this.programa === '') {
      swal('No ha seleccionado ningun programa.', '', 'error');
    } else {

      swal({
        type: 'error',
        text: '¿Está seguro de compartir esta solicitud?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Compartir',
        cancelButtonText: 'No, Cancelar'

      }).then((result) => {

        if (result.value) {
          this.enviarCorreoPrograma();
          this.service.updateSolicitud(this.identificador, {
            'PROGRAMA ACADÉMICO DE DESTINO (1)' : this.programa,
            'PROGRAMA ACADÉMICO DE DESTINO (2)' : this.programa2,
            'estado': 'En espera de aprobación dirección de programa'
          }).then(() => {
           
            this.enviarCorreoPrograma();
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


  }

  enviarCorreoPrograma() {
    const array1 = this.facultades.find(o => o['prog'] === this.programa);
    const array2 = this.facultades.find(o => o['prog'] === this.programa2);

    const arra = [array1['correo']];

    let email = array1['correo'];
    if (array2) {
      email += ',' + array2['correo'];
      arra.push(array2['correo']);
    }
    const fecha = new Date().toISOString().split('T')[0];

    const mensaje = ' Se ha generado una nueva solicitud entrante para su programa academico.'
     + ' la solicitud tiene el codigo' + this.identificador + ' y fue generada en la fecha: '
     + fecha;

    this.email.send(email, 'SE HA GENERADO UNA NUEVA SOLICITUD ENTRANTE', mensaje);
    this.email.AnycrearNotifications(arra, mensaje);
    console.log(email);

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
