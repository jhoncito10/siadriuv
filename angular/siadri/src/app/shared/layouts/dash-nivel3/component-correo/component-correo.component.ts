import { Component, OnInit } from '@angular/core';
import { MailServiceService } from "../../../services/main-service.service";
import swal from 'sweetalert2';
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

  constructor(private _mailServiceService: MailServiceService) { }

  ngOnInit() {
  }
  enviarCorreo() {
    swal.showLoading()

    this._mailServiceService
    .send(this.email, this.asunto, this.mensaje, this.cc, this.cco)
    .subscribe((responseData) => {
      console.log(responseData)
      if (responseData) {
        swal({
          type: 'success',
          title: 'Correo enviado'        
        });
      } else {
        swal({
          type: 'error',
          title: 'Error al enviar el correo, intentalo nuevamente'        
        });
      }
      
    }, error=>{
      console.log(error)
    })
  }
}
