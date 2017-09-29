import { ModalService } from './../servicio/modalservice';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  message = 'hola';
  constructor(private data: ModalService) { }
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
  }

}
