import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
    ModalPopupComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
