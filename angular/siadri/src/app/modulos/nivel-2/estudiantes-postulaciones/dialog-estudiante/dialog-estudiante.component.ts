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


  myControlChecks = {
    curso1: new FormControl({value: false}),
    curso2: new FormControl({value: false}),
    curso3: new FormControl({value: false}),
    curso4: new FormControl({value: false}),
    curso5: new FormControl({value: false}),
    curso6: new FormControl({value: false}),
  };


  myControlComent = {
    curso1: new FormControl({value: '', disabled: true}),
    curso2: new FormControl({value: '', disabled: true}),
    curso3: new FormControl({value: '', disabled: true}),
    curso4: new FormControl({value: '', disabled: true}),
    curso5: new FormControl({value: '', disabled: true}),
    curso6: new FormControl({value: '', disabled: true}),
  };

  correo = '';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service: ConveniosService,
    private email: MailServiceService) {
    console.log(data);

    this.identificador = data.id;

    this.myControlComent.curso1.setValue(data.curso1);
    this.myControlComent.curso2.setValue(data.curso2);
    this.myControlComent.curso3.setValue(data.curso3);
    this.myControlComent.curso4.setValue(data.curso4);
    this.myControlComent.curso5.setValue(data.curso5);
    this.myControlComent.curso6.setValue(data.curso6);
  }


  ngOnInit() {

    this.dialogRef.updateSize('60%', '80%');

    this.form = this.fb.group({
      description: [this.description, []]
    });

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

        // this.enviarCorreoPrograma();
        // this.service.updateSolicitud(this.identificador, {
        //   'estado': 'Aprobada  por  DRI  UV'
        // }).then(() => {

        //   this.enviarCorreoEstudiante();
        //   this.dialogRef.close();
        //   swal(
        //     'Exito',
        //     '',
        //     'success'
        //   );
        // }).catch(() => {
        //   swal(
        //     'En este momento no es posible guardar los cambios.',
        //     '',
        //     'error'
        //   );
        // });
      } else {
        swal(
          'Cancelado',
          '',
          'error'
        );
      }

    });
  
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
      + ' la solicitud tiene el codigo: "' + this.identificador + '" y fue generada en la fecha: '
      + fecha;

    this.email.send(email, 'SE HA GENERADO UNA NUEVA SOLICITUD ENTRANTE', mensaje);
    this.email.AnycrearNotifications(arra, mensaje);
    console.log(email);

  }

  enviarCorreoEstudiante() {

    const fecha = new Date().toISOString().split('T')[0];

    const mensaje = ' Se le notifica que su solicitud ha sido retornada. por favor revisela.'
      + ' la solicitud tiene el codigo: "' + this.identificador + '" y fue generada en la fecha: '
      + fecha;

    this.email.send(this.correo, 'NOTIFICACION DE RETORNO DE SOLICITUD', mensaje);
    this.email.crearNotification(this.correo, mensaje);

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
