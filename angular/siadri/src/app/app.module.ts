import { RegistroService } from './shared/services/registro.service';
import { LoginService } from './shared/services/login.service';
import { AutocompleteService } from './shared/services/autocomplete.service';
nofound
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from './app.component';
import { HeaderTopComponent } from './shared/layouts/header-top/header-top.component';
import { SidebarLeftComponent } from './shared/layouts/sidebar-left/sidebar-left.component';
import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { DashboardCentralComponent } from './shared/layouts/dashboard-central/dashboard-central.component';
import { environment } from './../environments/environment';
import { AgreementsComponent } from './shared/layouts/sidebar-left-components/agreements/agreements.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { ModalPopupComponent } from './shared/layouts/modal-popup/modal-popup.component';
import { RightPanelComponent } from './shared/layouts/right-panel/right-panel.component';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { app_routing } from './app.route';

@NgModule({
  declarations: [
    AppComponent,
    HeaderTopComponent,
    SidebarLeftComponent,
    AgreementsComponent,
    DashboardMapComponent,
    DashboardCentralComponent,
    ModalPopupComponent,
    RightPanelComponent,
    LoginComponent,
    DashboardInComponent
  ],
  imports: [
    FormsModule,
    app_routing,
    BrowserModule,
    LeafletModule.forRoot(),
    HttpModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AutocompleteService, LoginService, RegistroService],
  bootstrap: [AppComponent]
})
export class AppModule { }
