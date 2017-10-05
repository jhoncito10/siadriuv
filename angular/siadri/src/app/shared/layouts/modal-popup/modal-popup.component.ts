import { ServiceService } from './service.service';
import { Subject } from 'rxjs/Rx';
import { query } from '@angular/core/src/animation/dsl';
import { any } from 'codelyzer/util/function';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css']
})
export class ModalPopupComponent implements OnInit {

  convenios;
  startAt = new Subject()
  endAt = new Subject()
  lastKeypress = 0;
  constructor(private servicio: ServiceService) { }

  ngOnInit() {
    this.servicio.getConvenios(this.startAt, this.endAt)
                  .subscribe(convenios => this.convenios = convenios)
  }

  search($event) {
    if ($event.timeStamp - this.lastKeypress > 200) {
      const q = $event.target.value
      this.startAt.next(q)
      this.endAt.next(q + '\uf8ff')
    }
    this.lastKeypress = $event.timeStamp
  }
}
