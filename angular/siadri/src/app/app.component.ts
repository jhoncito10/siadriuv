import { Component } from '@angular/core';
import { ConveniosService } from "./shared/services/main-service.service";

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
  }
}
