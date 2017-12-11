import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FunuserService } from './shared/layouts/formularios-admin/usuarios/funuser.service';
import { RuleservicesService } from './shared/layouts/formularios-admin/roles/rule.service';
import { BuscadorService } from './shared/layouts/modal-popup/buscador.service';
import { ModalService } from './shared/modal.service';
import { LeaftletmapService } from './shared/layouts/dashboard-map/leaftletmap.service';
import { app_routing } from './app.route';
import { PublicGuard } from './shared/services/public.guard';
import { AuthGuard } from './shared/services/auth.guard';
import { RouterModule } from '@angular/router';
import { RegistroService } from './shared/services/registro.service';
import { LoginService } from './shared/services/login.service';
import { HttpService } from './shared/services/http.service';

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
import { firebaseconfig } from './config';
import { AgreementsComponent } from './shared/layouts/sidebar-left-components/agreements/agreements.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { ModalPopupComponent } from './shared/layouts/modal-popup/modal-popup.component';
import { LoginComponent } from './shared/layouts/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { InscripcionesComponent } from './shared/layouts/sidebar-left-components/inscripciones/inscripciones.component';
import { DashNivel2Component } from './shared/layouts/dash-nivel2/dash-nivel2.component';
import { BorradoresComponent } from './shared/layouts/sidebar-left-components/borradores/borradores.component';
import { SolicitudesComponent } from './shared/layouts/sidebar-left-components/solicitudes/solicitudes.component';
import { RolesComponent } from './shared/layouts/formularios-admin/roles/roles.component';
import { UsuariosComponent } from './shared/layouts/formularios-admin/usuarios/usuarios.component';
import { AdminComponent } from './shared/layouts/sidebar-left-components/admin/admin.component';

import {DataTablesModule} from 'angular-datatables';
import { ModalusuarioComponent } from './shared/layouts/formularios-admin/usuarios/modalusuario/modalusuario.component';
import { DashNivel3Component } from 'app/shared/layouts/dash-nivel3/dash-nivel3.component';
import { GraficosComponent } from './shared/layouts/sidebar-left-components/graficos/graficos.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    AppComponent,
    HeaderTopComponent,
    SidebarLeftComponent,
    AgreementsComponent,
    DashboardMapComponent,
    DashboardCentralComponent,
    ModalPopupComponent,
    LoginComponent,
    DashboardInComponent,
    InscripcionesComponent,
    DashNivel2Component,
    BorradoresComponent,
    SolicitudesComponent,
    RolesComponent,
    UsuariosComponent,
    AdminComponent,
    ModalusuarioComponent,
    DashNivel3Component,
    GraficosComponent
    
  ],
  imports: [
    app_routing,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    HttpModule,
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTablesModule,
    NgxChartsModule
  ],
  providers: [
      LoginService,
      HttpService,
      RegistroService,
      PublicGuard,
      AuthGuard,
      LeaftletmapService,
      ModalService,
      BuscadorService,
      DashboardMapComponent,
      RuleservicesService,
      FunuserService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
