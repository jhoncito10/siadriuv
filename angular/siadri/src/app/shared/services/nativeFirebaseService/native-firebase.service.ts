import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { environment } from "../../../../environments/environment";
firebase.initializeApp(environment.config);
@Injectable()
export class NativeFirebaseService {

  fb = firebase

  constructor() { }

}
