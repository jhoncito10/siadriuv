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
  enviarCorreo() {
    const url = `https://us-central1-siadriuv.cloudfunctions.net/enviarCorreo`;
    // const url = `http://localhost:5000/siadriuv/us-central1/enviarCorreo`;
    const mailData = {
      para:this.email,
      cc:this.cc,
      cco:this.cco,
      asunto:this.asunto,
      mensaje:this.mensaje
    };
    console.log(mailData);
    $.ajax(
      {
        type: 'POST',
        url: url,
        data: JSON.stringify(mailData),
        success: function (result) {
          alert('solicitud exitosa');

        },
        contentType: 'application/json'
      });
  }

}
