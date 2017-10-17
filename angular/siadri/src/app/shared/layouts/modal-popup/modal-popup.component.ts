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

  constructor() { }

    ngOnInit() {
    }

  }
