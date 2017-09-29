import { environment } from './../environments/environment';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalService } from './shared/layouts/servicio/modalservice';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { HeaderTopComponent } from './shared/layouts/header-top/header-top.component';
import { SidebarLeftComponent } from './shared/layouts/sidebar-left/sidebar-left.component';
import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { DashboardCentralComponent } from './shared/layouts/dashboard-central/dashboard-central.component';

import { AgreementsComponent } from './shared/layouts/sidebar-left-components/agreements/agreements.component';

import { ModalPopupComponent } from './shared/layouts/modal-popup/modal-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderTopComponent,
    SidebarLeftComponent,
    AgreementsComponent,
    DashboardMapComponent,
    DashboardCentralComponent,
    ModalPopupComponent,
    MovieSearchComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    AngularFireModule.initializeApp(environment.config),
    HttpModule
  ],
  providers: [
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
