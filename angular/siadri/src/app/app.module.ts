import { InscripcionesComponent } from './shared/layouts/dash-nivel2/inscripciones/inscripciones.component';
import { AdminGuard } from './shared/services/admin.guard';
import { Nivel3Guard } from './shared/services/nivel3.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FunuserService } from './shared/layouts/formularios-admin/usuarios/funuser.service';
import { RuleservicesService } from './shared/layouts/formularios-admin/roles/rule.service';
import { BuscadorService } from './shared/layouts/modal-popup/buscador.service';
import { ModalService } from './shared/modal.service';
import { LeaftletmapService } from './shared/layouts/dashboard-map/leaftletmap.service';
import { app_routing } from './app.route';
import { AuthGuard } from './shared/services/auth.guard';
import { RouterModule } from '@angular/router';
import { RegistroService } from './shared/services/registro.service';
import { LoginService } from './shared/services/login.service';
import { HttpService } from './shared/services/http.service';
import {
  MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatSortModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatExpansionModule,
  MatAutocompleteModule

} from '@angular/material';


import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from './app.component';
import { HeaderTopComponent } from './shared/layouts/header-top/header-top.component';
import { SidebarLeftComponent } from './shared/layouts/sidebar-left/sidebar-left.component';
import { DashboardMapComponent } from './shared/layouts/dashboard-map/dashboard-map.component';
import { environment } from './../environments/environment';
import { AgreementsComponent } from './shared/layouts/sidebar-left-components/agreements/agreements.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { ModalPopupComponent } from './shared/layouts/modal-popup/modal-popup.component';
import { LoginComponent } from './modulos/auth/login/login.component';
import { DashboardInComponent } from './shared/layouts/dashboard-in/dashboard-in.component';
import { DashNivel2Component } from './shared/layouts/dash-nivel2/dash-nivel2.component';
import { BorradoresComponent } from './shared/layouts/sidebar-left-components/borradores/borradores.component';
import { SolicitudesComponent } from './shared/layouts/sidebar-left-components/solicitudes/solicitudes.component';
import { RolesComponent } from './shared/layouts/formularios-admin/roles/roles.component';
import { UsuariosComponent } from './shared/layouts/formularios-admin/usuarios/usuarios.component';
import { AdminComponent } from './shared/layouts/sidebar-left-components/admin/admin.component';

import { DataTablesModule } from 'angular-datatables';
import { ModalusuarioComponent } from './shared/layouts/formularios-admin/usuarios/modalusuario/modalusuario.component';
import { DashNivel3Component } from 'app/shared/layouts/dash-nivel3/dash-nivel3.component';
import { GraficosComponent } from './shared/layouts/sidebar-left-components/graficos/graficos.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BarraComponent } from './shared/layouts/dash-nivel3/graficos/barra/barra.component';
import { DonaComponent } from './shared/layouts/dash-nivel3/graficos/dona/dona.component';
import { AreaComponent } from './shared/layouts/dash-nivel3/graficos/area/area.component';
import { LineaComponent } from './shared/layouts/dash-nivel3/graficos/linea/linea.component';

import { MomentModule } from 'angular2-moment';
import { BarraverticalComponent } from './shared/layouts/dash-nivel3/graficos/barravertical/barravertical.component';
import { Grafico1Component } from './shared/layouts/dash-nivel3/component-graficos/grafico1/grafico1.component';
import { Grafico2Component } from './shared/layouts/dash-nivel3/component-graficos/grafico2/grafico2.component';
import { CorreoComponent } from './shared/layouts/sidebar-left-components/correo/correo.component';
import { ComponentCorreoComponent } from './shared/layouts/dash-nivel3/component-correo/component-correo.component';
import { RenovacionComponent } from './shared/layouts/sidebar-left-components/renovacion/renovacion.component';
import { RenovacionesComponent } from './shared/layouts/dash-nivel2/renovaciones/renovaciones.component';
import { InscripcionComponent } from './shared/layouts/sidebar-left-components/inscripcion/inscripcion.component';
import { SpinerComponent } from './shared/layouts/spiner/spiner.component';
import { InvestigacionComponent } from './shared/layouts/sidebar-left-components/investigacion/investigacion.component';
import { InvestigacionesComponent } from './shared/layouts/dash-nivel2/investigaciones/investigaciones.component';
import { UnivalleGuard } from 'app/shared/services/univalle.guard';
import { ComponentInvestigacionComponent } from './shared/layouts/dash-nivel3/component-investigacion/component-investigacion.component';
import { TablainvestigacionComponent } from './shared/layouts/sidebar-left-components/tablainvestigacion/tablainvestigacion.component';
import { PrincipalComponent } from './shared/layouts/principal/principal.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2CompleterModule } from 'ng2-completer';

import { InicioAppComponent } from "./modulos/auth/inicio-app/inicio-app.component";
import { TablaConsultasComponent } from './modulos/nivel-1/tabla-consultas/tabla-consultas.component';

import {Ng2Webstorage} from 'ngx-webstorage';
import { ConveniosService, MailServiceService, MixedFunctions } from "./shared/services/main-service.service";
import { DirectoresProgramaUvComponent } from './modulos/nivel-2/directores-programa-uv/directores-programa-uv.component';
import { SideBarMenuDirectoresComponent } from './shared/layouts/sidebar-left-components/side-bar-menu-directores/side-bar-menu-directores.component';
import { ParesExternosComponent } from './modulos/nivel-2/pares-externos/pares-externos.component';
import { ParesExternosSalientesComponent } from './modulos/nivel-2/pares-externos/pares-externos-salientes/pares-externos-salientes.component';
import { SideBarMenuParesExternosComponent } from './shared/layouts/sidebar-left-components/side-bar-menu-pares-externos/side-bar-menu-pares-externos.component';
import { AdminDirectoresUvComponent } from './modulos/nivel-3/admin-directores-uv/admin-directores-uv.component';
import { SideBarMenuAdminDirectoresComponent } from './shared/layouts/sidebar-left-components/side-bar-menu-admin-directores/side-bar-menu-admin-directores.component';
import { AdminParesExternosComponent } from './modulos/nivel-3/admin-pares-externos/admin-pares-externos.component';
import { EstudiantesPostulacionesComponent } from './modulos/nivel-2/estudiantes-postulaciones/estudiantes-postulaciones.component';
import { SideBarMenuEstudiantesComponent } from './shared/layouts/sidebar-left-components/side-bar-menu-estudiantes/side-bar-menu-estudiantes.component';

import { NativeFirebaseService } from "./shared/services/nativeFirebaseService/native-firebase.service";
import { AdminPostEntrantesComponent } from './modulos/nivel-3/admin-post-entrantes/admin-post-entrantes.component';
import { AdminPostSalientesComponent } from './modulos/nivel-3/admin-post-salientes/admin-post-salientes.component';
import { SideBarMenuPostulacionesComponent } from './shared/layouts/sidebar-left-components/side-bar-menu-postulaciones/side-bar-menu-postulaciones.component';
import { AdminConveniosComponent } from './modulos/nivel-3/admin-convenios/admin-convenios.component';

import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderTopComponent,
    SidebarLeftComponent,
    AgreementsComponent,
    DashboardMapComponent,
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
    GraficosComponent,
    BarraComponent,
    DonaComponent,
    AreaComponent,
    LineaComponent,
    BarraverticalComponent,
    Grafico1Component,
    Grafico2Component,
    CorreoComponent,
    ComponentCorreoComponent,
    InscripcionesComponent,
    RenovacionComponent,
    RenovacionesComponent,
    InscripcionComponent,
    SpinerComponent,
    InvestigacionComponent,
    InvestigacionesComponent,
    ComponentInvestigacionComponent,
    TablainvestigacionComponent,
    PrincipalComponent,
    InicioAppComponent,
    TablaConsultasComponent,
    DirectoresProgramaUvComponent,
    SideBarMenuDirectoresComponent,
    ParesExternosComponent,
    ParesExternosSalientesComponent,
    SideBarMenuParesExternosComponent,
    AdminDirectoresUvComponent,
    SideBarMenuAdminDirectoresComponent,
    AdminParesExternosComponent,
    EstudiantesPostulacionesComponent,
    SideBarMenuEstudiantesComponent,
    AdminPostEntrantesComponent,
    AdminPostSalientesComponent,
    SideBarMenuPostulacionesComponent,
    AdminConveniosComponent

  ],
  imports: [
    app_routing,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTablesModule,
    NgxChartsModule,
    MomentModule,
    Ng2CompleterModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NgxEditorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    Ng2Webstorage
  ],
  // exports: [
  //   MatButtonModule,
  //   MatFormFieldModule,
  //   MatInputModule
  // ],
  providers: [
    LoginService,
    HttpService,
    RegistroService,
    AuthGuard,
    LeaftletmapService,
    ModalService,
    BuscadorService,
    DashboardMapComponent,
    RuleservicesService,
    FunuserService,
    Nivel3Guard,
    AdminGuard,
    UnivalleGuard,
    ConveniosService,
    MailServiceService,
    MixedFunctions,
    NativeFirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
