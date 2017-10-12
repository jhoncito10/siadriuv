import { AutocompleteService } from './../../services/autocomplete.service';
import { Subject } from 'rxjs/Rx';
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

  constructor(private servicio: AutocompleteService) { }

  ngOnInit() {
    this.servicio.getConvenios(this.startAt, this.endAt)
                  .subscribe(convenios => {this.convenios = convenios;
                  console.log(this.convenios)} );
  }

  search($event) {
    if ($event.timeStamp - this.lastKeypress > 200) {
      // tslint:disable-next-line:prefer-const
      let q = $event.target.value
      this.startAt.next(q)
      this.endAt.next(q + '\uf8ff')
    }
    this.lastKeypress = $event.timeStamp
  }
  mostrar(item: any) {
    console.log(item)
    /* this.convenios = null; */
  }
}
