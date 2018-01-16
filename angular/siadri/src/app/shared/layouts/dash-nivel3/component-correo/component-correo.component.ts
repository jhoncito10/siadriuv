import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-correo',
  templateUrl: './component-correo.component.html',
  styleUrls: ['./component-correo.component.css']
})
export class ComponentCorreoComponent implements OnInit {

  email: string = '';
  cc: string = '';
  cco: string = '';
  asunto: string = '';
  mensaje: string = '';

  constructor() { }

  ngOnInit() {
  }
  enviarCorreo() { this.email = 'Nancy'; }

}
